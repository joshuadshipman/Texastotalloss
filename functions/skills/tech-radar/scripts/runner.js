const { manualRadarRun } = require('../../../techRadar');

module.exports = async ({ taskId, taskParams, db }) => {
    console.info(`[tech-radar-runner] Starting tech-radar auto-run for task: ${taskId}`);
    try {
        const result = await manualRadarRun();
        return { status: 'success', summary: result };
    } catch (err) {
        console.error(`[tech-radar-runner] FAILED:`, err);
        throw err;
    }
};
