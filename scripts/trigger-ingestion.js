'use strict';

/**
 * Trigger YouTube Logic Ingestion
 * This script runs the ingestion logic for the specific PI research targets provided by the user.
 */

const { runYoutubeIngestion } = require('../functions/logic/youtubeIngestor');
const admin = require('firebase-admin');

// Service Account setup for local execution
const serviceAccount = require('../service-account.json'); 

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const targets = [
    { youtubeUrl: "https://youtu.be/zptzU8KkkW8" },
    { query: "Texas personal injury intake questionnaire legal theory" },
    { query: "High-value commercial vehicle accident intake questions" }
];

async function runIngestion() {
    console.log("🚀 Starting Autonomous PI Intake Research...");
    
    for (const target of targets) {
        console.log(`\n🔍 Researching: ${target.youtubeUrl || target.query}...`);
        try {
            const result = await runYoutubeIngestion(target);
            console.log(`✅ Success: Ingested ${result.ingested_count} questions.`);
            console.log("Questions:", result.logic.extracted_questions.map(q => q.question).slice(0, 3), "...");
        } catch (error) {
            console.error(`❌ Failed: ${error.message}`);
        }
    }
    
    console.log("\n✨ Research Complete. LVI Engine refined with new intake logic.");
}

runIngestion().catch(console.error);
