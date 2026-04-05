'use strict';

const { logger } = require("firebase-functions");
const admin = require('firebase-admin');
const modelRouter = require('../modelRouter');

/**
 * Core YouTube Logic Ingestor
 * Extracts high-conversion Personal Injury intake questions from YouTube videos/searches.
 */
async function runYoutubeIngestion({ youtubeUrl, query }) {
    if (!admin.apps.length) admin.initializeApp();
    const db = admin.firestore();

    logger.info(`[YoutubeIngestor] ${youtubeUrl || query}...`);

    const systemInstruction = `
        You are a "Big 4" Legal Strategy & Markets Consultant. 
        Your goal is to reverse-engineer "High-Conversion" Personal Injury intake logic from YouTube research.
        Identify the "Gold-Standard" questions that maximize Case Value (LVI) and Attorney interest.
        Focus on: Liability, Insurance limits, Medical treatment, and Evidence (Photos/Police).
    `;

    const prompt = `
        Research Target: ${youtubeUrl || query}
        
        Task:
        1. Analyze the content at this location (if YouTube URL, find the transcript/summary).
        2. Extract 5-10 specific, high-intent intake questions used to qualify PI clients in Texas.
        3. For each question, explain the "Legal Theory" behind it (e.g., "Airbag deployment proves impact severity").
        4. Map each question to one of these LVI Categories: [Liability, Medical, Damages, Evidence].
        
        Return ONLY valid JSON in this format:
        {
            "extracted_questions": [
                {
                    "question": "...",
                    "theory": "...",
                    "category": "...",
                    "suggested_multiplier": 1.5
                }
            ],
            "source": "${youtubeUrl || query}"
        }
    `;

    const result = await modelRouter.generateContent({
        prompt: prompt,
        systemInstruction: systemInstruction,
        preferredModel: 'perplexity',
        expectedTokens: 1500
    });

    // Clean and parse
    let text = result.replace(/```json/g, '').replace(/```/g, '').trim();
    const intakeLogic = JSON.parse(text);

    // Save to system config for the intake engine to consume
    const docId = youtubeUrl ? Buffer.from(youtubeUrl).toString('base64').substring(0, 20) : "general_pi_logic";
    await db.collection('system_config').doc('intake_logic_v3').collection('sources').doc(docId).set({
        ...intakeLogic,
        ingested_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
        success: true,
        ingested_count: intakeLogic.extracted_questions.length,
        logic: intakeLogic
    };
}

module.exports = { runYoutubeIngestion };
