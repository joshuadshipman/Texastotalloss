'use strict';

const { onCall } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const modelRouter = require('./modelRouter');

if (!admin.apps.length) admin.initializeApp();

/**
 * Researches materials for a project based on user profile and feedback.
 * Leverages Perplexity for deep web research.
 */
exports.runProjectResearch = onCall(async (request) => {
    const { projectId } = request.data;
    if (!projectId) throw new Error('Project ID required.');

    const db = admin.firestore();
    const projectRef = db.doc(`home_projects/${projectId}`);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) throw new Error('Project not found.');
    const project = projectDoc.data();

    // 1. Fetch Context: User Profile + Shopping History
    const userPrefsSnap = await db.collection('system_config').doc('user_preferences').get();
    const userPrefs = userPrefsSnap.exists ? userPrefsSnap.data() : {};

    const shoppingSnap = await db.collection('shopping_list')
        .where('status', 'in', ['bought', 'approved'])
        .limit(10).get();
    const purchaseHistory = shoppingSnap.docs.map(d => d.data().product_name).join(', ');

    const complaints = userPrefs.complaints || userPrefs.dislikes || "None specifically mentioned.";

    // 2. Generate Research via ModelRouter (Preferred: Perplexity)
    const systemInstruction = `You are the "ProplexityGemini Gem" Research Agent.
        Your goal is to provide high-quality material recommendations based on specific project needs and user preferences.
        Always provide URLs where possible (if using Perplexity).`;

    const prompt = `
        Project: "${project.name}"
        Description: "${project.notes || 'No description'}"
        
        User Context:
        - Purchase History: [${purchaseHistory}]
        - User Complaints/Dislikes: "${complaints}"
        - General Bio: "${userPrefs.bio || 'Homeowner'}"

        Task: Identify 3 critical materials needed for this project. 
        For each, recommend a specific high-quality brand/model that avoids the user's past complaints.
        Format your response EXCLUSIVELY as a JSON array of objects: [{"name": String, "brand": String, "recommendation": String, "estimated_price": Number}]
        Do not include markdown formatting or backticks, just the raw JSON array.
    `;

    try {
        const result = await modelRouter.generateContent({
            prompt: prompt,
            systemInstruction: systemInstruction,
            preferredModel: 'perplexity',
            expectedTokens: 1000
        });

        // Clean potentially problematic characters if model ignored the "exclusive" instruction
        const jsonStr = result.replace(/```json|```/g, '').trim();
        const materials = JSON.parse(jsonStr);

        // 3. Update the Project Document
        await projectRef.update({
            materials: materials,
            last_research_at: new Date().toISOString()
        });

        // 4. Add a note to the 2nd Brain about this research
        await db.collection('notes').add({
            title: `Research: ${project.name}`,
            content: `Materials recommended: ${materials.map(m => m.name).join(', ')}. Logic used: Referenced preferences regarding "${complaints}".`,
            category: 'Research',
            created_at: new Date().toISOString()
        });

        return { success: true, materials };
    } catch (err) {
        console.error('[project-research] Error:', err);
        return { success: false, error: err.message };
    }
});
