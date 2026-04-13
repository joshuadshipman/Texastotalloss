'use strict';

/**
 * recoveryJournalLexicon — Firebase Cloud Function (v2)
 *
 * This function handles the conversational API for the Recovery Journal App.
 * It uses a Model API (e.g., Gemini) to parse natural language from the user,
 * extract structured Pain & Suffering data, and reply with empathy and legal education.
 */

const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { logger } = require('firebase-functions');

// Simulated Model Router instance for architecture mapping
const parseUserMessage = async (userMessage, daysSinceLoss) => {
    // ── SYSTEM PROMPT / EDUCATIONAL LEXICON ────────────────────────────────
    
    // THE 72 HOUR RULE: Protects the claim value.
    const rule72HR = "I notice it has been less than 72 hours since your accident. It is CRITICAL that you visit an ER or Urgent Care immediately. Insurance companies use gaps in treatment to claim you weren't actually hurt. Do not worry about the cost right now; focus on your health and getting it documented.";
    
    // THE 14 DAY CHIRO RULE:
    const rule14Day = "Since it's been more than a few days, getting a full evaluation from a chiropractor or specialist is essential. Continuing your treatment plan is the most important thing you can do for your recovery and your case.";
    
    // THE LONG GAME (Always append to reassure them)
    const theLongGame = "Please focus entirely on your healing. Dealing with insurance takes time, and they want you to get impatient and settle quickly. We are documenting everything to protect you.";

    // Logic Tree (In production, this is passed to the LLM. We simulate the parser here)
    let reply = "I'm so sorry you're dealing with that type of pain. I've updated your medical journal so your attorney has a permanent record of what you're going through. ";
    
    // Inject Education based on timeline
    if (daysSinceLoss !== null) {
        if (daysSinceLoss <= 3) {
            reply += `\n\n${rule72HR}`;
        } else if (daysSinceLoss > 3 && daysSinceLoss <= 14) {
            reply += `\n\n${rule14Day}`;
        }
    }
    
    reply += `\n\n${theLongGame}`;

    // Fake JSON extraction from LLM parsing
    const extractedData = {
        painLevel: userMessage.toLowerCase().includes('killing me') || userMessage.toLowerCase().includes('severe') ? 8 : 5,
        mood: 'distressed',
        missedEvent: userMessage, 
    };

    return { reply, extractedData };
};

exports.recoveryJournalLexicon = onRequest({ region: 'us-central1' }, async (req, res) => {
    const { leadId, message, daysSinceLoss } = req.body;

    if (!leadId || !message) {
        return res.status(400).json({ error: 'Missing leadId or message' });
    }

    try {
        logger.info(`[LEXICON] Processing message for lead ${leadId}: "${message}"`);
        
        // Process message through the NLP pipeline
        const nlpResult = await parseUserMessage(message, daysSinceLoss || null);

        // Save Extracted Data to Firestore
        const db = admin.firestore();
        const docRef = db.collection(`insurance_leads/${leadId}/recovery_logs`).doc();
        await docRef.set({
            ...nlpResult.extractedData,
            rawMessage: message,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return compassionate/educational reply to the UI
        return res.status(200).json({
            success: true,
            reply: nlpResult.reply
        });

    } catch (error) {
        logger.error(`[LEXICON] Failure in processing lead ${leadId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
