import { modelRouter } from '../src/lib/models/router';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testRouter() {
    const tests = [
        { taskType: 'GENERAL', complexity: 'low' },
        { taskType: 'GENERAL', complexity: 'high', allowPaid: true },
        { taskType: 'RESEARCH', complexity: 'medium' },
        { taskType: 'MARKETING', complexity: 'low' },
        { taskType: 'CODING', complexity: 'high', allowPaid: true }
    ];

    console.log('--- Model Router Fallback Test ---');
    for (const test of tests) {
        try {
            const instance = await modelRouter.getModel(test as any);
            console.log(`✅ Task: ${test.taskType} (${test.complexity}) -> Model: ${instance.modelName} (Paid: ${instance.isPaid})`);
        } catch (e: any) {
            console.log(`❌ Task: ${test.taskType} (${test.complexity}) -> Error: ${e.message}`);
        }
    }
}

testRouter();
