const { generateContent } = require('../../../modelRouter');

/**
 * mcp-connector runner
 * Bridges Cloud Functions to external APIs to simulate MCP tools autonomously.
 */
module.exports = async ({ taskId, taskParams, db }) => {
    console.info(`[mcp-connector-runner] Executing for ${taskId}`);
    
    const targetTool = taskParams.tool_name || 'search';
    const query = taskParams.query || 'latest AI news for series-a-marketing';

    try {
        // Since Cloud Functions can't run local MCP npx commands,
        // we use the modelRouter to bridge to Perplexity/Serper/Tavily.
        const prompt = `AUTO_TASK: Use the ${targetTool} capability to find: ${query}. 
        Return a clean markdown summary for the Series A marketing board.`;
        
        const result = await generateContent({
            prompt: prompt,
            preferredModel: 'perplexity',
            isBackgroundRun: true,
            expectedTokens: 1000
        });

        return { status: 'success', tool: targetTool, summary: result };
    } catch (err) {
        console.error(`[mcp-connector-runner] FAILED:`, err);
        throw err;
    }
};
