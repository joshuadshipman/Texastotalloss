import { modelRouter } from '../src/lib/models/router';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testFallback() {
    console.log("Starting ModelRouter Fallback Test...");
    
    try {
        // Force the model we know should be active
        console.log("Testing Claude Sonnet 4.6 (Anthropic)...");
        const model = await modelRouter.createInstance('claude-sonnet-4-6');
        console.log(`✅ Success! Using model: ${model.modelName}`);
        
        const response = await model.generateContent("Hello, are you connected?");
        console.log("Response Content:", response.response.text());
    } catch (e: any) {
        console.error("❌ Test Failed:", e.message);
    }
}

testFallback();
