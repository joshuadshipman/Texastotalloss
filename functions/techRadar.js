const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!admin.apps.length) admin.initializeApp();

/**
 * HTTP endpoint to manually trigger a Tech Radar scrape run.
 */
exports.runTechRadarNow = onRequest(async (req, res) => {
    // Lazy-load runner AFTER Firebase is initialized
    const runTechRadar = require('../skills/tech-radar/scripts/runner');
    const db = admin.firestore();
    try {
        logger.info('[techRadar] Manual run triggered');
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error('GEMINI_KEY missing');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await runTechRadar({ taskId: 'manual', db, geminiModel });
        res.status(200).send(`✅ Tech Radar complete. Added ${result.newItems} new items.`);
    } catch (e) {
        logger.error('[techRadar] Error:', e);
        res.status(500).send(`Error: ${e.message}`);
    }
});


/**
 * Seed the tech_radar_sources and skill_registry collections.
 * Run once via HTTP, then leave it in place as an idempotent refresh.
 */
exports.seedSkillRegistry = onRequest(async (req, res) => {
    const db = admin.firestore();
    try {
        // 1. Seed tech_radar_sources
        const defaultSources = [
            { url: 'https://blog.google/innovation-and-ai/models-and-research/google-labs/', label: 'Google Labs Blog', category: 'google_ai', enabled: true },
            { url: 'https://labs.google/experiments?category=all', label: 'Google Labs Experiments', category: 'google_ai', enabled: true },
            { url: 'https://ai.google.dev/news', label: 'Google AI Developer News', category: 'google_ai', enabled: true },
            { url: 'https://deepmind.google/discover/blog/', label: 'DeepMind Blog', category: 'google_ai', enabled: true },
            { url: 'https://github.com/trending?since=daily&language=javascript', label: 'GitHub Trending JS', category: 'dev_tools', enabled: true },
            { url: 'https://github.com/trending?since=daily&language=python', label: 'GitHub Trending Python', category: 'dev_tools', enabled: true },
        ];

        const sourceBatch = db.batch();
        for (const source of defaultSources) {
            // Use URL as the doc ID to keep it idempotent
            const docId = Buffer.from(source.url).toString('base64').slice(0, 20);
            sourceBatch.set(db.collection('tech_radar_sources').doc(docId), {
                ...source,
                created_at: new Date()
            }, { merge: true });
        }
        await sourceBatch.commit();

        // 2. Seed skill_registry
        const skills = [
            { name: 'web-search', description: 'Gemini Google Search grounding', enabled: true, version: '1.0.0', requires_model: 'gemini_1_5_flash_free', schedule: 'on_demand' },
            { name: 'browser-automation', description: 'Puppeteer + Gemini Vision', enabled: false, version: '1.0.0', requires_model: 'gemini_1_5_flash_free', schedule: 'on_demand' },
            { name: 'email-management', description: 'Gmail API triage + categorize', enabled: false, version: '1.0.0', requires_model: 'gemini_1_5_flash_free', schedule: 'daily' },
            { name: 'notes-pkm', description: 'Google Keep & Docs integration', enabled: false, version: '1.0.0', requires_model: 'gemini_1_5_flash_free', schedule: 'on_demand' },
            { name: 'speech-transcription', description: 'Google STT API transcriber', enabled: false, version: '1.0.0', requires_model: 'none', schedule: 'on_demand' },
            { name: 'tech-radar', description: 'Scrapes followed sites for new articles', enabled: true, version: '1.0.0', requires_model: 'gemini_1_5_flash_free', schedule: 'daily' },
            { name: 'mcp-connector', description: 'Generic MCP server HTTP bridge', enabled: false, version: '1.0.0', requires_model: 'none', schedule: 'on_demand' },
        ];

        const skillBatch = db.batch();
        for (const skill of skills) {
            skillBatch.set(db.collection('skill_registry').doc(skill.name), {
                ...skill,
                last_run_at: null,
                error_log: [],
                created_at: new Date()
            }, { merge: true });
        }
        await skillBatch.commit();

        logger.info(`Seeded ${defaultSources.length} radar sources and ${skills.length} skills.`);
        res.status(200).send(`✅ Seeded ${defaultSources.length} radar sources and ${skills.length} skills in registry.`);
    } catch (e) {
        logger.error('Seed Error:', e);
        res.status(500).send(`Error: ${e.message}`);
    }
});
