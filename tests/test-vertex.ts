import { modelRouter } from '../src/lib/models/router';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testVertex() {
    console.log("Starting Vertex AI Test...");
    
    try {
        // Try gemini-1.5-flash via Vertex
        const model = await modelRouter.createInstance('gemini-1.5-flash');
        console.log(`✅ Success! Created instance: ${model.modelName}`);
        
        const response = await model.generateContent("Hello, are you connected via Vertex?");
        console.log("Response Content:", response.response.text());
    } catch (e: any) {
        console.error("❌ Vertex Test Failed:", e.message);
        console.error("Stack:", e.stack);
    }
}

testVertex();
