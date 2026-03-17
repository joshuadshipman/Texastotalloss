
import * as fs from 'fs';
import * as path from 'path';

// Load env before import
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

async function testRouting() {
    const { modelRouter } = await import('../src/lib/models/router');

    let output = "--- Testing Free-First Spending Guards ---\n";
    const log = (msg: string) => { console.log(msg); output += msg + "\n"; };

    // 1. Test CMD_SHELL (Should always be FREE)
    log("\nScenario 1: Internal Clawbot Command (CMD_SHELL)");
    try {
        const model = await modelRouter.getModel({ taskType: 'CMD_SHELL' });
        log(`Selection: ${model.modelName} (Paid: ${model.isPaid})`);
    } catch (e: any) { log("Error: " + e.message); }

    // 2. Test Forced Free (allowPaid: false)
    log("\nScenario 2: Coding Task - FORCED FREE (allowPaid: false)");
    try {
        const model = await modelRouter.getModel({ taskType: 'CODING', allowPaid: false });
        log(`Selection: ${model.modelName} (Paid: ${model.isPaid})`);
    } catch (e: any) { log("Error: " + e.message); }

    // 3. Test Coding Task - ALLOW PAID
    log("\nScenario 3: Coding Task - ALLOW PAID");
    try {
        const model = await modelRouter.getModel({ taskType: 'CODING', allowPaid: true });
        log(`Selection: ${model.modelName} (Paid: ${model.isPaid})`);
    } catch (e: any) { log("Error: " + e.message); }

    log("\n--- Verification Complete ---");
    fs.writeFileSync('test-results.log', output);
}

testRouting().catch(console.error);
