const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkModels() {
    try {
        const response = await ai.models.list();        
        for await (const model of response) {
            console.log(model.name);
        }
    } catch (e) {
        console.error("Failed:", e);
    }
}
checkModels();
