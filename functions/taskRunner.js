const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require('firebase-admin');
const { generateContent } = require('./modelRouter');

if (!admin.apps.length) {
    admin.initializeApp();
}

// ── Skill Registry — PI Platform Skills Added ──────────────────────────────────
// Lazy-load skill runners to avoid crashing if a skill file is missing
const SKILL_RUNNERS = {
    // Original Skills
    'tech-radar':        () => require('./skills/tech-radar/scripts/runner'),
    'mcp-connector':     () => require('./skills/mcp-connector/scripts/runner'),
    'reputation-review': () => require('./skills/reputation-review/scripts/runner'),

    // Series B: PI Lead Platform Skills
    'plir-batch':        () => ({
        run: async () => {
            const { runPLIRBatch } = require('./logic/plirGenerator');
            return runPLIRBatch(10); // Process up to 10 leads per run
        }
    }),
    'firm-discovery':    () => ({
        run: async () => {
            const { runFirmDiscovery } = require('./firmDiscovery');
            return runFirmDiscovery(3); // 3 cities per weekly run
        }
    }),
    'voice-callbacks':   () => ({
        run: async () => {
            const { retryVoiceCallbacks } = require('./piVoiceWebhook');
            return retryVoiceCallbacks();
        }
    }),
    'outreach-agent':    () => require('./skills/outreach-agent/scripts/runner'),
};

/**
 * The TaskRunner executes on a cron schedule to evaluate personal data and run autonomous prompts.
 * Also auto-discovers enabled skills from skill_registry and runs their scheduled runners.
 */
exports.scheduledTaskRunner = onSchedule("every 15 minutes", async (event) => {
    logger.info("Starting GravityClaw Scheduled Task Runner.");
    const db = admin.firestore();
    const now = new Date();

    // ─── Part 1: Run agent_tasks ───────────────────────────────────────
    try {
        const tasksSnap = await db.collection('agent_tasks')
            .where('status', '==', 'active')
            .where('next_run_at', '<=', now)
            .get();

        if (!tasksSnap.empty) {
            const batch = db.batch();

            for (const taskDoc of tasksSnap.docs) {
                const taskParams = taskDoc.data();
                const taskId = taskDoc.id;
                logger.info(`Executing Task: ${taskParams.name || taskId}`);
                let taskResult = "Did not execute logic.";

                try {
                    if (taskParams.task_type === 'model_free_check') {
                        const pendingItems = await db.collection('shopping_list').where('status', '==', 'pending_user_review').get();
                        taskResult = `Found ${pendingItems.size} items pending review.`;

                    } else if (taskParams.task_type === 'llm_analysis') {
                        // ─── Part 1.5: Inject SOPs from Firestore ────────────────
                        let sopContext = "";
                        try {
                            const sopsSnap = await db.collection('system_config').doc('sops').collection('entries').get();
                            if (!sopsSnap.empty) {
                                sopContext = "\n\n### RELEVANT SOPS:\n" + sopsSnap.docs.map(d => `- ${d.data().title}: ${d.data().content}`).join('\n');
                            }
                        } catch (sopErr) {
                            logger.warn("Failed to fetch SOPs, proceeding without context:", sopErr);
                        }

                        const basePrompt = taskParams.prompt_template || "What are some general life insights?";
                        const prompt = `${basePrompt}${sopContext}`;

                        taskResult = await generateContent({
                            prompt,
                            preferredModel: taskParams.explicit_model || null,
                            isBackgroundRun: true,
                            expectedTokens: 300
                        });
                    } else {
                        taskResult = `Unknown task_type: ${taskParams.task_type}`;
                    }

                    const runRef = db.collection('task_runs').doc();
                    batch.set(runRef, { task_id: taskId, task_name: taskParams.name, executed_at: now, result: taskResult, status: 'success' });

                    const intervalMinutes = taskParams.interval_minutes || 60;
                    const nextRunDate = new Date(now.getTime() + intervalMinutes * 60000);
                    batch.update(taskDoc.ref, { last_run_at: now, next_run_at: nextRunDate });

                } catch (err) {
                    logger.error(`Task ${taskId} failed:`, err);
                    const runRef = db.collection('task_runs').doc();
                    batch.set(runRef, { task_id: taskId, task_name: taskParams.name, executed_at: now, error: err.message, status: 'failed' });
                }
            }
            await batch.commit();
            logger.info(`agent_tasks: Processed ${tasksSnap.size} tasks.`);
        }
    } catch (e) {
        logger.error("Fatal error in agent_tasks section:", e);
    }

    // ─── Part 2: Auto-discover and run skill_registry scheduled skills ───
    try {
        const skillsSnap = await db.collection('skill_registry')
            .where('enabled', '==', true)
            .where('schedule', '==', 'daily')
            .get();

        for (const skillDoc of skillsSnap.docs) {
            const skill = skillDoc.data();
            const skillName = skill.name;

            // Only run once per day (check last_run_at)
            const lastRun = skill.last_run_at ? new Date(skill.last_run_at.seconds * 1000) : null;
            const hoursSinceLastRun = lastRun ? (now - lastRun) / 3600000 : Infinity;
            if (hoursSinceLastRun < 20) {
                logger.info(`[skill-runner] Skipping ${skillName} — ran ${Math.round(hoursSinceLastRun)}h ago`);
                continue;
            }

            if (SKILL_RUNNERS[skillName]) {
                try {
                    logger.info(`[skill-runner] Running skill: ${skillName}`);
                    const runner = SKILL_RUNNERS[skillName]();
                    const result = await runner({ taskId: `skill_${skillName}`, taskParams: skill, db });
                    await skillDoc.ref.update({ last_run_at: now, error_log: [] });
                    logger.info(`[skill-runner] ${skillName} complete:`, result);
                } catch (err) {
                    logger.error(`[skill-runner] ${skillName} failed:`, err.message);
                    await skillDoc.ref.update({
                        error_log: admin.firestore.FieldValue.arrayUnion({ error: err.message, at: now.toISOString() })
                    });
                }
            } else {
                logger.info(`[skill-runner] No runner registered for: ${skillName} (skill must be called externally)`);
            }
        }
    } catch (e) {
        logger.error("Fatal error in skill_registry section:", e);
    }

    // ─── Part 3: Process NotebookLM Tasks ───────────────────────────────────────
    try {
        const notebookTasksSnap = await db.collection('notebook_tasks')
            .where('status', '==', 'pending')
            .get();

        if (!notebookTasksSnap.empty) {
            const { execSync } = require('child_process');
            for (const taskDoc of notebookTasksSnap.docs) {
                const task = taskDoc.data();
                const taskId = taskDoc.id;
                logger.info(`[notebook-runner] Starting NotebookLM Task: ${taskId}`);

                await taskDoc.ref.update({ status: 'running', started_at: now });

                try {
                    const generatedArtifacts = [];
                    for (let format of task.formats) {
                        logger.info(`[notebook-runner] Generating format: ${format} for notebook ${task.notebook_id}`);

                        // Map valid CLI generation commands
                        const formatCmd = format.replace(/_/g, '-');
                        let cmd = `C:\\Users\\17549\\AppData\\Local\\Python\\pythoncore-3.14-64\\Scripts\\notebooklm.exe generate ${formatCmd} -n ${task.notebook_id}`;

                        if (task.custom_directions) {
                            cmd += ` "${task.custom_directions.replace(/"/g, '\\"')}"`;
                        }

                        // Block and wait for artifact to finish via --wait flag if available, but execSync blocks anyway
                        // To avoid infinite hang from execSync, we might use a timeout. The CLI generates artifacts quickly generally (seconds to 30s)
                        try {
                            const output = execSync(cmd, { encoding: 'utf-8', timeout: 120000 });
                            logger.info(`[notebook-runner] ${formatCmd} complete: ${output.substring(0, 100)}...`);
                            generatedArtifacts.push({ format, status: 'completed', output_log: output.substring(0, 200) });
                        } catch (execErr) {
                            logger.error(`[notebook-runner] Failed to run ${cmd}: ${execErr.message}`);
                            generatedArtifacts.push({ format, status: 'failed', output_log: execErr.message });
                        }
                    }

                    await taskDoc.ref.update({ status: 'completed', completed_at: new Date(), artifacts: generatedArtifacts });
                    logger.info(`[notebook-runner] Task ${taskId} finished successfully.`);
                } catch (err) {
                    logger.error(`[notebook-runner] Task ${taskId} failed:`, err);
                    await taskDoc.ref.update({ status: 'failed', error: err.message, failed_at: new Date() });
                }
            }
        }
    } catch (e) {
        logger.error("Fatal error in notebook_tasks section:", e);
    }

    // ─── Part 3.5: PI Platform Hourly Checks ──────────────────────────────────────
    // Runs PI-specific platform tasks on an hourly cadence (every 4 cycles of 15min)
    try {
        const hourMark = now.getMinutes() < 15; // Only run on the hour (first 15-min window)

        if (hourMark) {
            logger.info("[PI Platform] Running hourly PI platform tasks...");

            // 1. PLIR Batch — generate reports for new scored leads
            try {
                const { runPLIRBatch } = require('./logic/plirGenerator');
                const plirResult = await runPLIRBatch(5);
                logger.info(`[PI Platform] PLIR batch: ${plirResult.processed || 0} reports generated.`);
            } catch (plirErr) {
                logger.error('[PI Platform] PLIR batch failed:', plirErr.message);
            }

            // 2. Voice callback retries (for leads blocked by business hours)
            const ctHour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false }));
            if (ctHour === 8) { // Retry at 8am CT
                try {
                    const { retryVoiceCallbacks } = require('./piVoiceWebhook');
                    const callResult = await retryVoiceCallbacks();
                    logger.info(`[PI Platform] Voice retries: ${callResult?.processed || 0} processed.`);
                } catch (callErr) {
                    logger.error('[PI Platform] Voice callback retry failed:', callErr.message);
                }
            }

            // 3. Firm discovery (Monday only — weekly cadence)
            const isMonday = now.getDay() === 1;
            if (isMonday && ctHour === 9) {
                try {
                    const { runFirmDiscovery } = require('./firmDiscovery');
                    const discoveryResult = await runFirmDiscovery(3);
                    logger.info(`[PI Platform] Firm discovery: ${discoveryResult.totalSaved || 0} new firms.`);
                } catch (discErr) {
                    logger.error('[PI Platform] Firm discovery failed:', discErr.message);
                }
            }
        }
    } catch (e) {
        logger.error("Fatal error in PI Platform section:", e);
    }

    logger.info("TaskRunner complete.");
});

/**
 * Manual trigger for skills to bypass cron for high-priority audits (e.g. Board review)
 */
exports.manualRunSkill = async (request) => {
    const { name, params = {} } = request.data;
    const db = admin.firestore();
    
    if (!SKILL_RUNNERS[name]) {
        throw new Error(`Skill ${name} not found or no runner registered.`);
    }
    
    logger.info(`[manual-runner] Manual trigger for: ${name}`);
    const runner = SKILL_RUNNERS[name]();
    return await runner({ taskId: `manual_${name}`, taskParams: params, db });
};
