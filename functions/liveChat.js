const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require('firebase-admin');
const { generateContentStream } = require('./modelRouter');

if (!admin.apps.length) admin.initializeApp();

/**
 * Live Chat with Clawbot (Streaming SSE)
 * This function provides a "Live" typing experience similar to the Gemini app.
 */
exports.liveChat = onRequest({ region: "us-central1" }, async (req, res) => {
    // 1. Enable SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-age');
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        const { message, sessionId = 'default-session' } = req.body || req.query;

        if (!message) {
            res.write(`data: ${JSON.stringify({ error: 'Message is required' })}\n\n`);
            res.end();
            return;
        }

        const db = admin.firestore();
        
        // 2. Fetch Session History
        let history = [];
        try {
            const sessionDoc = await db.collection('clawbot_sessions').doc(sessionId).get();
            if (sessionDoc.exists) {
                history = sessionDoc.data().history || [];
            }
        } catch (e) {
            logger.warn("Session history retrieval failed", e);
        }

        const systemInstruction = `You are Clawbot, the integrated AI assistant for Texas Total Loss. 
        Your goal is to qualify high-value leads. Ensure you capture:
        1. Date of Loss (Timeline)
        2. Injury Status & Treatment (Severity)
        3. At-Fault Party Insurance Carrier (Case Value)
        
        If the user hasn't provided the at-fault party's insurer, politely ask for it as it significantly impacts their settlement potential. 
        Respond in a live, conversational manner. Use markdown for clarity.
        Current Session ID: ${sessionId}`;

        // 4. Start Streaming from ModelRouter
        const stream = await generateContentStream({
            prompt: message,
            systemInstruction,
            history // Pass history if modelRouter supports it (next upgrade)
        });

        let fullResponse = "";

        for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullResponse += chunkText;
            
            // Send chunk to client via SSE
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
        }

        // 5. Save History after stream completes
        try {
            const newHistory = [...history, 
                { role: 'user', content: message },
                { role: 'model', content: fullResponse }
            ].slice(-10); // Keep last 10 exchanges

            await db.collection('clawbot_sessions').doc(sessionId).set({
                history: newHistory,
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (hError) {
            logger.error("Failed to save session history", hError);
        }

        res.write('event: end\ndata: [DONE]\n\n');
        res.end();

    } catch (error) {
        logger.error('Live Chat Error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Internal system error' })}\n\n`);
        res.end();
    }
});
