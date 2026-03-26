const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Media & Photo Search Agent
 * Takes an uploaded screenshot or camera photo and uses Gemini Vision
 * to identify the object and provide search queries or exact matches.
 */
exports.findMatchingPhotos = onCall(async (request) => {
    const { imageBase64 } = request.data;

    if (!imageBase64) {
        throw new HttpsError('invalid-argument', 'Must provide an imageBase64 string.');
    }

    try {
        logger.info(`Starting reverse image/photo search...`);
        
        const geminiKey = process.env.GEMINI_KEY;
        if (!geminiKey) throw new Error("GEMINI_KEY is missing.");
        
        const genAI = new GoogleGenerativeAI(geminiKey);
        // Using Gemimi 1.5 Pro or Flash for vision tasks. Flash is faster/cheaper.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = `
            You are an expert visual search assistant. The user has uploaded a photo or screenshot.
            Identify the core subject of the image (clothing, gadget, decor, location, etc.).
            Provide 3 things:
            1. A highly detailed description of the item.
            2. The exact brand/model if you can identify it with high confidence.
            3. 3 highly optimized Google Search queries the user can click to find exact or near matches to buy or research.
            
            Return ONLY valid JSON in format:
            { "description": "...", "exact_match": "Brand/Model or null", "search_queries": ["query 1", "query 2", "query 3"] }
        `;

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([systemInstruction, imagePart]);
        const response = await result.response;
        
        let text = response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(text);

        return {
            success: true,
            analysis: parsedData
        };

    } catch (error) {
        logger.error("Failed to analyze photo", error);
        throw new HttpsError('internal', 'Media Search Agent failed: ' + error.message);
    }
});
