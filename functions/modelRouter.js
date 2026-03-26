const admin = require('firebase-admin');
const axios = require('axios');

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * The ModelRouter manages LLM quota and intelligently routes tasks across available models.
 * @param {Object} params
 * @param {string} params.prompt - The user/task prompt.
 * @param {string} [params.systemInstruction] - System instruction context.
 * @param {string} [params.preferredModel] - 'gemini', 'deepseek', 'perplexity', or null.
 * @param {boolean} [params.isBackgroundRun] - If true, prefers lower cost/background models.
 * @param {number} [params.expectedTokens] - Estimated output token size for quota tracking.
 * @returns {Promise<string>} - The LLM text response.
 */
exports.generateContent = async ({ prompt, systemInstruction, preferredModel = null, isBackgroundRun = false, expectedTokens = 500 }) => {
    // ... logic remains same, but we can call a common internal executor
    return internalExecute({ prompt, systemInstruction, preferredModel, isBackgroundRun, expectedTokens, stream: false });
};

/**
 * Returns a streaming iterator for the content generation.
 */
exports.generateContentStream = async ({ prompt, systemInstruction, preferredModel = null, isBackgroundRun = false, expectedTokens = 500, history = [] }) => {
    return internalExecute({ prompt, systemInstruction, preferredModel, isBackgroundRun, expectedTokens, stream: true, history });
};

const internalExecute = async ({ prompt, systemInstruction, preferredModel = null, isBackgroundRun = false, expectedTokens = 500, stream = false, history = [] }) => {
    const db = admin.firestore();
    const quotaRef = db.collection('system_config').doc('quota_state');
    const prefsRef = db.collection('system_config').doc('user_preferences');

    // 1. Fetch State
    const [quotaSnap, prefsSnap] = await Promise.all([quotaRef.get(), prefsRef.get()]);
    let quota = quotaSnap.exists ? quotaSnap.data() : { requests_today: 0, tokens_estimate_today: 0, last_reset: new Date() };
    const prefs = prefsSnap.exists ? prefsSnap.data() : {};
    const strategy = prefs.llm_quota_strategy || { global_default: 'gemini_1_5_flash_free', background_fallback: 'deepseek_v3_coder' };

    // 2. Daily Reset Check (UTC based simple check)
    const lastResetDate = quota.last_reset?.toDate ? quota.last_reset.toDate() : new Date(quota.last_reset);
    const today = new Date();
    if (lastResetDate.getUTCDate() !== today.getUTCDate() || lastResetDate.getUTCMonth() !== today.getUTCMonth()) {
        quota.requests_today = 0;
        quota.tokens_estimate_today = 0;
        quota.last_reset = admin.firestore.FieldValue.serverTimestamp();
    }

    // 3. Routing Logic
    let selectedModel = strategy.global_default;

    const lowerPrompt = prompt.toLowerCase();
    const isCoding = lowerPrompt.includes('code') || lowerPrompt.includes('build') || lowerPrompt.includes('fix') || lowerPrompt.includes('error');
    const isLogic = lowerPrompt.includes('logic') || lowerPrompt.includes('think') || lowerPrompt.includes('plan') || lowerPrompt.includes('architect');

    if (preferredModel === 'claude' || isCoding) {
        // PER USER: Prioritize Claude 3.5 Sonnet for building/fixing code
        selectedModel = process.env.ANTHROPIC_API_KEY ? 'anthropic_claude' : 'perplexity_claude';
    } else if (isLogic) {
        // PER USER: Prioritize Opus or Gemini 1.5 Pro for deep logic/planning (No Cost)
        selectedModel = process.env.ANTHROPIC_API_KEY ? 'anthropic_opus' : 'gemini_1_5_pro';
    } else if (isBackgroundRun && quota.requests_today > 100) {
        // Soft cap triggered, route to cheap fallback
        selectedModel = strategy.background_fallback;
    } else if (preferredModel) {
        selectedModel = preferredModel; // Direct override
    }

    console.info(`[ModelRouter] Routing to ${selectedModel}. Current quota: ${quota.requests_today} reqs.`);

    // 4. Execution
    let resultText = "";

    try {
        if (selectedModel === 'anthropic_opus') {
            const anthropicKey = process.env.ANTHROPIC_API_KEY;
            const axios = require('axios');
            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: "claude-3-opus-20240229",
                max_tokens: 4096,
                messages: [{ role: "user", content: prompt }],
                system: systemInstruction || "You are a senior logic architect."
            }, {
                headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }
            });
            resultText = response.data.content[0].text;

        } else if (selectedModel === 'anthropic_claude') {
            const anthropicKey = process.env.ANTHROPIC_API_KEY;
            const axios = require('axios');
            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [{ role: "user", content: prompt }],
                system: systemInstruction || "You are a senior logic and code architect."
            }, {
                headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }
            });
            resultText = response.data.content[0].text;

        } else if (selectedModel === 'perplexity_claude') {
            const perplexityKey = process.env.PERPLEXITY_KEY || process.env.PERPLEXITY_API_KEY;
            const response = await axios.post('https://api.perplexity.ai/chat/completions', {
                model: "claude-3-sonnet", // Or whatever Perplexity calls their Claude route
                messages: [
                    { role: "system", content: systemInstruction || "You are a senior logic and code architect." },
                    { role: "user", content: prompt }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${perplexityKey}` }
            });
            resultText = response.data.choices[0].message.content;

        } else if (selectedModel.includes('gemini_1_5_pro') || selectedModel.includes('gemini_pro')) {
            const geminiKey = process.env.GEMINI_API_KEY;
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            
            if (stream) {
                const result = await model.generateContentStream(prompt);
                return result.stream; // Returns an AsyncIterator seen as stream
            } else {
                const result = await model.generateContent(prompt);
                resultText = result.response.text();
            }

        } else if (selectedModel.includes('gemini')) {
            const geminiKey = process.env.GEMINI_API_KEY;

            if (geminiKey) {
                // FALLBACK: Use standard Google Generative AI SDK (AI Studio Key)
                const { GoogleGenerativeAI } = require('@google/generative-ai');
                const genAI = new GoogleGenerativeAI(geminiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: systemInstruction || "You are a helpful assistant." }] },
                        { role: 'model', parts: [{ text: "Understood. I'm ready to help." }] },
                        ...history.map(h => ({
                            role: h.role === 'user' ? 'user' : 'model',
                            parts: [{ text: h.content }]
                        }))
                    ]
                });

                if (stream) {
                    const result = await chat.sendMessageStream(prompt);
                    return result.stream;
                } else {
                    const result = await chat.sendMessage(prompt);
                    resultText = result.response.text();
                }
            } else {
                // DEFAULT: Use Vertex AI (Enterprise)
                const { VertexAI } = require('@google-cloud/vertexai');
                const project = process.env.GOOGLE_CLOUD_PROJECT || 'total-loss-intake-bot';
                const location = 'us-central1';
                
                const vertexAI = new VertexAI({ project, location });
                const model = vertexAI.getGenerativeModel({
                    model: "gemini-1.5-flash"
                });

                const chat = model.startChat({
                    history: [
                        { role: 'user', parts: [{ text: systemInstruction || "You are a helpful assistant." }] },
                        { role: 'model', parts: [{ text: "Understood. I'm ready to help." }] }
                    ]
                });

                if (stream) {
                    const result = await chat.sendMessageStream(prompt);
                    return result.stream;
                } else {
                    const result = await chat.sendMessage(prompt);
                    const response = result.response;
                    resultText = response.candidates[0].content.parts[0].text;
                }
            }

        } else if (selectedModel.includes('perplexity')) {
            const perplexityKey = process.env.PERPLEXITY_KEY || process.env.PERPLEXITY_API_KEY;

            if (!perplexityKey) {
                console.warn("Perplexity API key missing. Falling back to Gemini.");
                return exports.generateContent({ prompt, systemInstruction, preferredModel: 'gemini' });
            }

            const response = await axios.post('https://api.perplexity.ai/chat/completions', {
                model: "llama-3.1-sonar-small-128k-online",
                messages: [
                    { role: "system", content: systemInstruction || "You are a helpful research assistant." },
                    { role: "user", content: prompt }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${perplexityKey}` }
            });

            resultText = response.data.choices[0].message.content;

        } else if (selectedModel.includes('serper')) {
            const serperKey = process.env.SERPER_API_KEY;

            if (!serperKey) {
                console.warn("Serper API key missing. Falling back to Gemini.");
                return exports.generateContent({ prompt, systemInstruction, preferredModel: 'gemini' });
            }

            // ENFORCING: 85% Certainty Rule for credit conservation
            const isLocalSearch = prompt.toLowerCase().includes('near') || prompt.toLowerCase().includes('location') || prompt.toLowerCase().includes('address');
            if (!isLocalSearch && !prompt.includes('SPECIFIC_LOCAL_RESEARCH')) {
                console.info("[ModelRouter] Serper request rejected: Does not meet 85% certainty for local research. Falling back to Perplexity/Tavily.");
                return exports.generateContent({ prompt, systemInstruction, preferredModel: 'perplexity' });
            }

            // Proceed with Serper search...
            const response = await axios.post('https://google.serper.dev/search', {
                q: prompt
            }, {
                headers: { 'X-API-KEY': serperKey, 'Content-Type': 'application/json' }
            });

            resultText = JSON.stringify(response.data);

        } else if (selectedModel.includes('deepseek')) {
            const deepseekKey = process.env.DEEPSEEK_API_KEY;

            if (!deepseekKey) {
                console.warn("DeepSeek API key missing. Falling back to Gemini.");
                return exports.generateContent({ prompt, systemInstruction, preferredModel: 'gemini' });
            }

            const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
                model: "deepseek-reasoner", // R1 for complex logic
                messages: [
                    { role: "system", content: systemInstruction || "You are a senior logic architect." },
                    { role: "user", content: prompt }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${deepseekKey}` }
            });

            resultText = response.data.choices[0].message.content;

        } else if (selectedModel.includes('mirofish')) {
            const mirofishUrl = process.env.MIROFISH_URL || 'http://localhost:5001';
            const response = await axios.post(`${mirofishUrl}/api/predict`, {
                prompt: prompt,
                context: systemInstruction
            });
            resultText = response.data.result;

        } else {
            throw new Error(`Unknown model: ${selectedModel}`);
        }

        // 5. Update Quota
        quota.requests_today += 1;
        // Basic heuristic: 1 token ~ 4 chars of prompt + expected output
        quota.tokens_estimate_today += Math.round(prompt.length / 4) + expectedTokens;

        await quotaRef.set({
            requests_today: quota.requests_today,
            tokens_estimate_today: quota.tokens_estimate_today,
            last_reset: quota.last_reset // keep timestamp
        }, { merge: true });

        return resultText;

    } catch (e) {
        console.error(`[ModelRouter] Execution failed on ${selectedModel}`, e);
        throw e;
    }
};
