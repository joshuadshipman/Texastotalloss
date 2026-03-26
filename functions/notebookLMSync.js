const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { generateContent } = require('./modelRouter');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Presentation Agent
 * Takes a raw summary or exported study guide from NotebookLM,
 * routes it to Gemini to structure it specifically into an array 
 * of Slide objects optimized for Canva Bulk Create / Nano templates.
 */
exports.generateCanvaPresentation = onCall(async (request) => {
    const { notebookTopicId, rawContent } = request.data;
    const db = admin.firestore();

    if (!notebookTopicId && !rawContent) {
        throw new HttpsError('invalid-argument', 'Must provide rawContent or a notebookTopicId to pull from content_sources.');
    }

    let sourceText = rawContent;

    if (!sourceText) {
        // Fetch from content_sources
        const docSnap = await db.collection('content_sources').doc(notebookTopicId).get();
        if (!docSnap.exists) {
            throw new HttpsError('not-found', 'Topic not found in content_sources.');
        }
        sourceText = docSnap.data().raw_content;
    }

    const systemInstruction = `
        You are an expert Presentation Designer. 
        Your goal is to parse the user's study material (likely from NotebookLM) and structure it into a perfect CSV/JSON array for Canva Bulk Create.
        Each array object represents ONE slide.
        Return ONLY valid JSON.
        Format:
        [
            { "Slide_Number": 1, "Title": "Main Topic", "Bullet_1": "Key point", "Bullet_2": "Supporting detail", "Image_Prompt": "Visual idea for the slide" }
        ]
        Keep text concise. Max 5 bullets per slide. Aim for 5-10 slides total.
    `;

    try {
        logger.info("Generating Presentation from NotebookLM content.");
        const resultText = await generateContent({
            prompt: `Please format this content into Canva slides:\n\n${sourceText}`,
            systemInstruction: systemInstruction,
            preferredModel: 'gemini_1_5_flash_free', // Best for large context parsing
            expectedTokens: 1000
        });

        // Clean out markdown backticks if Gemini includes them
        const cleanedJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const slides = JSON.parse(cleanedJson);

        // Optionally save the generated presentation back to the DB
        const presentationRef = await db.collection('presentations').add({
            source_content_id: notebookTopicId || 'raw_input',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            slide_count: slides.length,
            slides: slides
        });

        return {
            success: true,
            presentation_id: presentationRef.id,
            data: slides
        };

    } catch (error) {
        logger.error("Failed to generate Canva presentation", error);
        throw new HttpsError('internal', 'Presentation Agent failed: ' + error.message);
    }
});
