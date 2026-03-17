import { modelRouter } from '../src/lib/models/router';

async function testRouter() {
    console.log("--- 🧪 Testing Budget-Stiff Enforcement ---");
    
    try {
        console.log("\n1. Requesting GENERAL model (Default allowPaid=false):");
        const model = await modelRouter.getModel({ taskType: 'GENERAL' });
        console.log(`✅ Success: Using ${model.modelName} (isPaid: ${model.isPaid})`);
    } catch (e: any) {
        console.log(`❌ Expected Halt: ${e.message}`);
    }

    try {
        console.log("\n2. Requesting CODING model with allowPaid=true (Explicit):");
        const model = await modelRouter.getModel({ taskType: 'CODING', allowPaid: true });
        console.log(`✅ Success: Using ${model.modelName} (isPaid: ${model.isPaid})`);
    } catch (e: any) {
        console.log(`❌ Unexpected Halt: ${e.message}`);
    }

    try {
        console.log("\n3. Testing CMD_SHELL (Always Free):");
        const model = await modelRouter.getModel({ taskType: 'CMD_SHELL', allowPaid: true });
        console.log(`✅ Success: Using ${model.modelName} (isPaid: ${model.isPaid})`);
    } catch (e: any) {
        console.log(`❌ Error: ${e.message}`);
    }
}

testRouter();
