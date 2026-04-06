import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const STATE_FILE = '.build-state.json';
const ERROR_PACKET = 'ERROR_PACKET.md';

function getState() {
    if (fs.existsSync(STATE_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        } catch (e) {
            console.warn("⚠️ Failed to read state file, resetting.");
        }
    }
    return { attempts: 0 };
}

function saveState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function clearCache() {
    console.log("🧹 Clearing build cache...");
    const paths = ['.next', 'node_modules/.cache'];
    paths.forEach(p => {
        if (fs.existsSync(p)) {
            console.log(`  - Removing ${p}`);
            fs.rmSync(p, { recursive: true, force: true });
        }
    });
}

function generateErrorPacket(output, cacheCleared) {
    const packetContent = `# Error Packet - ${new Date().toISOString()}

## Summary
The build failed. This is a system-generated report for automated or manual review.

## Error Output
\`\`\`text
${output}
\`\`\`

## Context
- **Attempts before reset**: 2
- **Cache cleared**: ${cacheCleared ? 'Yes' : 'No'}

## Instructions for Reviewer
Please analyze the error output above and provide a fix. The fix can be applied using the \`apply-fix.mjs\` script.
`;
    fs.writeFileSync(ERROR_PACKET, packetContent);
    console.log(`📝 Error details saved to ${ERROR_PACKET}`);
}

async function runSmartBuild() {
    const state = getState();
    console.log(`🚀 Starting Smart Build (Attempt ${state.attempts + 1})...`);

    try {
        console.log("📦 Running npm run build...");
        execSync('npm run build:raw', { stdio: 'pipe' });
        console.log("✅ Build successful!");
        saveState({ attempts: 0 });
        if (fs.existsSync(ERROR_PACKET)) fs.unlinkSync(ERROR_PACKET);
    } catch (error) {
        const output = error.stdout?.toString() + "\n" + error.stderr?.toString();
        state.attempts += 1;
        console.error(`❌ Build failed (Total failures: ${state.attempts}).`);

        let cacheCleared = false;
        if (state.attempts >= 2) {
            clearCache();
            state.attempts = 0;
            cacheCleared = true;
        }
        
        saveState(state);
        generateErrorPacket(output, cacheCleared);
        console.error("====== BUILD OUTPUT ======");
        console.error(output);
        console.error("==========================");
        process.exit(1);
    }
}

runSmartBuild();
