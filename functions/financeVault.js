const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Finance / Tax Vault Classifier
 * Processes uploaded document photos, extracts key values, 
 * categorizes them by Year and Document Type, and saves to `finance_documents`.
 */
exports.analyzeFinanceDocument = onCall(async (request) => {
    const { imageBase64, userEmail, fileName } = request.data;
    const db = admin.firestore();

    if (!imageBase64) {
        throw new HttpsError('invalid-argument', 'Must provide an imageBase64 string.');
    }

    try {
        logger.info(`Analyzing finance document for ${userEmail || 'unknown user'}...`);
        
        const geminiKey = process.env.GEMINI_KEY;
        if (!geminiKey) throw new Error("GEMINI_KEY is missing.");
        
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = `
            Analyze this financial document. 
            Determine the document category (e.g. 'W2', 'Bank Statement', '1099', 'Home Loan Interest', 'Other').
            Determine the tax year it applies to (e.g. 2024 or 2025).
            Determine the primary entity or person named (e.g. 'Husband', 'Chase Bank').
            Extract any key monetary values (e.g. 'total_income': 50000, 'ending_balance': 1500.50, 'tax_withheld': 200).
            
            Return ONLY valid JSON without markdown wrapping formatting in this exact format:
            { "category": "W2", "tax_year": 2025, "entity_name": "Husband", "key_values": { "total_income": 50000.00 } }
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

        // Save to Firestore
        const docRef = await db.collection('finance_documents').add({
            user_email: userEmail || 'unknown',
            original_file_name: fileName || 'Uploaded Image',
            category: parsedData.category || 'Unknown',
            tax_year: parsedData.tax_year || new Date().getFullYear(),
            entity_name: parsedData.entity_name || 'Unknown',
            key_values: parsedData.key_values || {},
            uploaded_at: admin.firestore.FieldValue.serverTimestamp()
        });

        logger.info(`Successfully categorized document as ${parsedData.category} for year ${parsedData.tax_year}. Doc ID: ${docRef.id}`);

        return {
            success: true,
            document_id: docRef.id,
            analysis: parsedData
        };

    } catch (error) {
        logger.error("Failed to analyze finance document", error);
        throw new HttpsError('internal', 'Finance Vault Agent failed: ' + error.message);
    }
});
