const { generateContent } = require('../../../modelRouter');

/**
 * Reputation & Review Agent
 * Monitors brand mentions and reviews autonomously.
 */
module.exports = async ({ taskId, taskParams, db }) => {
    console.info(`[reputation-review-runner] Starting autonomous audit for ${taskId}`);
    
    try {
        const brand = taskParams.brand_name || 'Texas Total Loss';
        
        // Step 1: Search for recent reviews/mentions
        const searchPrompt = `Search for recent customer reviews and social media mentions of "${brand}" in Texas.
        Identify any recurring complaints or high-praise items.
        Return as structured markdown analysis.`;
        
        const analysis = await generateContent({
            prompt: searchPrompt,
            preferredModel: 'perplexity',
            isBackgroundRun: true,
            expectedTokens: 1500
        });

        // Step 2: Store result to Firestore
        await db.collection('review_audits').add({
            brand,
            analysis,
            executed_at: new Date(),
            status: 'completed'
        });

        return { status: 'success', brand, message: 'Review audit completed and stored.' };
    } catch (err) {
        console.error(`[reputation-review-runner] FAILED:`, err);
        throw err;
    }
};
