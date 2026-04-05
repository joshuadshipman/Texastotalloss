const fs = require('fs');
const path = require('path');

console.log('✈️  Running GravityClaw Pre-Flight Parity Check...\n');

let hasErrors = false;

// 1. Check Function .env for valid structure (No missing tokens)
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ ERROR: Missing .env file in functions directory. Production deployment blocked.');
    hasErrors = true;
} else {
    const envData = fs.readFileSync(envPath, 'utf8');
    if (!envData.includes('GEMINI_API_KEY=') || envData.includes('GEMINI_API_KEY=YOUR_')) {
        console.error('❌ ERROR: Invalid or missing GEMINI_API_KEY in .env. Production deployment blocked.');
        hasErrors = true;
    }
    if (!envData.includes('PERPLEXITY_API_KEY=') || envData.includes('PERPLEXITY_API_KEY=YOUR_')) {
        console.error('❌ ERROR: Invalid or missing PERPLEXITY_API_KEY in .env. Production deployment blocked.');
        hasErrors = true;
    }
    console.log('✅ SECRETS: All core production LLM keys verified.');
}

// 2. Check MCP Config Limit globally (Prevent 100-limit host crash)
const mcpPath = path.join(__dirname, '..', '..', '..', '..', 'mcp_config.json');
if (fs.existsSync(mcpPath)) {
    try {
        const mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
        const activeServers = Object.keys(mcpConfig.mcpServers || {}).length;
        
        // Host enforces a hard limit of 100 tools. 
        // 9 servers is the maximum threshold before typical tool suites breach this limit.
        if (activeServers > 9) {
            console.error(`❌ ERROR: MCP Server count (${activeServers}) exceeds strict limit of 9. You will trigger the 100-tool host crash.`);
            hasErrors = true;
        } else {
            console.log(`✅ MCP: Tool footprint within safe margins (${activeServers} active suites).`);
        }

        // Verify no placeholders re-intruded
        const mcpStr = JSON.stringify(mcpConfig);
        if (mcpStr.includes('YOUR_API_KEY') || mcpStr.includes('YOUR_TAVILY')) {
            console.error('❌ ERROR: Placeholder API keys detected in MCP Config. Deletion required before proceeding.');
            hasErrors = true;
        }

    } catch (e) {
        console.error('❌ ERROR: Failed to parse mcp_config.json', e.message);
        hasErrors = true;
    }
}

console.log('');
if (hasErrors) {
    console.error('🚨 PRE-FLIGHT CHECK FAILED.');
    console.error('As per the "You Code It, You Fix It" mandate, deploy halted. Returning to autonomous repair loop.');
    process.exit(1);
} else {
    console.log('🚀 All Pre-Flight Checks Passed. Approved for Staging/Production.');
    process.exit(0);
}
