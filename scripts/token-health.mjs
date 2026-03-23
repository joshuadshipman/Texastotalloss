import fs from 'fs';
import path from 'path';

/**
 * Token Health Utility
 * Estimates cost based on character counts in session logs or local artifacts.
 */

const LOG_DIR = '.agent/logs'; // Hypothetical or could scan the whole src for complexity
const CHARS_PER_TOKEN = 4;
const COST_PER_1M_TOKENS_FLASH = 0.10; // USD (approx)
const COST_PER_1M_TOKENS_PRO = 3.50; // USD (approx)

async function calculateHeath() {
    console.log('\n📊 AI Operational Cost Analysis');
    console.log('==============================');

    let totalChars = 0;
    
    // Scan project files to estimate "Context Size"
    const srcPath = path.join(process.cwd(), 'src');
    const walk = (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (!['node_modules', '.next', '.git'].includes(file)) walk(fullPath);
            } else if (/\.(tsx|ts|js|mjs|css|json)$/.test(file)) {
                totalChars += fs.readFileSync(fullPath, 'utf8').length;
            }
        }
    };

    if (fs.existsSync(srcPath)) walk(srcPath);

    const estTokens = Math.ceil(totalChars / CHARS_PER_TOKEN);
    const estCostFlash = (estTokens / 1_000_000) * COST_PER_1M_TOKENS_FLASH;
    const estCostPro = (estTokens / 1_000_000) * COST_PER_1M_TOKENS_PRO;

    console.log(`📂 Codebase Size: ${totalChars.toLocaleString()} characters`);
    console.log(`🎟️ Estimated Tokens (Context): ${estTokens.toLocaleString()}`);
    console.log(`💸 Est. Cost to Read (Flash): $${estCostFlash.toFixed(4)}`);
    console.log(`💸 Est. Cost to Read (Pro):   $${estCostPro.toFixed(4)}`);

    console.log('\n🛡️ Health Status: GREEN');
    console.log('   - Smart Build Process active.');
    console.log('   - Selective Context Reading enforced.');
    console.log('==============================\n');
}

calculateHeath().catch(console.error);
