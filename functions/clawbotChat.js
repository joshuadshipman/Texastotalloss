const functions = require('firebase-functions');
const admin = require('firebase-admin');
const modelRouter = require('./modelRouter');

if (!admin.apps.length) admin.initializeApp();

const { onCall, HttpsError } = require("firebase-functions/v2/https");

exports.chatWithClawbot = onCall(async (request) => {
  const { message, history } = request.data;

  if (!message) {
    throw new HttpsError('invalid-argument', 'Message is required.');
  }

  try {
    const db = admin.firestore();

    // Fetch User Preferences to give Clawbot context
    let userPreferences = {};
    try {
      const prefsDoc = await db.collection('system_config').doc('user_preferences').get();
      if (prefsDoc.exists) {
        userPreferences = prefsDoc.data();
      }
    } catch (e) {
      functions.logger.warn("Could not fetch user preferences for Clawbot context", e);
    }

    const systemInstruction = `You are Clawbot, the integrated AI assistant for GravityHub. 
      You are the user's elite personal operations manager. Your tone is professional, slightly cynical (sarcastic but effective), and always focused on efficiency.
      
      Capabilities & Knowledge:
      - Strategy Workshop: Access the URL "https://wet-walls-return.loca.lt" (share this if asked for the workshop link).
      - Roster & Identity: You know the user is "JD", Master Host.
      
      User Preferences Context:
      ${JSON.stringify(userPreferences)}
      
      Rules:
      1. Format nicely with markdown (use bolding and lists).
      2. If asked for a link, provide the strategy workshop URL.
      3. Keep responses under 300 words.`;

    const responseText = await modelRouter.generateContent({
        prompt: message,
        systemInstruction: systemInstruction,
        preferredModel: 'gemini',
        expectedTokens: 500
    });

    return { response: responseText };

  } catch (error) {
    functions.logger.error('Error in chatWithClawbot:', error);
    throw new functions.https.HttpsError('internal', 'Unable to talk to Clawbot right now.', error.message);
  }
});
