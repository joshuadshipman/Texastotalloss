import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local BEFORE other imports
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

console.log("ENV CHECK:", {
    project: !!process.env.GOOGLE_PROJECT_ID,
    email: !!process.env.GOOGLE_CLIENT_EMAIL,
    key: !!process.env.GOOGLE_PRIVATE_KEY
});

import { modelRouter } from '../src/lib/models/router';

async function test() {
    console.log("Starting Vertex AI Diagnostic...");
    try {
        const model = await modelRouter.getModel({ taskType: 'GENERAL', complexity: 'low' });
        console.log("Model Instance Created:", model.modelName);
        
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response Text:", result.response.text());
        console.log("DIAGNOSTIC SUCCESSFUL");
    } catch (e) {
        console.error("DIAGNOSTIC FAILED:", e);
        process.exit(1);
    }
}

test();
