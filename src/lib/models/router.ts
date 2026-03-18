import { GoogleGenerativeAI } from '@google/generative-ai';
import { VertexAI } from '@google-cloud/vertexai';
import axios from 'axios';
import registryData from './model_registry.json';

export type ModelTier = 'FREE' | 'LOW_COST' | 'PRO' | 'RESEARCHER';
export type TaskType = 'CODING' | 'MARKETING' | 'RESEARCH' | 'GENERAL' | 'CMD_SHELL';

export interface RouterOptions {
    tier?: ModelTier;
    taskType?: TaskType;
    complexity?: 'low' | 'medium' | 'high';
    forceRefresh?: boolean;
    strict?: boolean;
    reasoning?: boolean;
    allowPaid?: boolean; // Default FALSE. Critical tasks must explicitly set this.
}

export interface ModelInstance {
    generateContent: (prompt: string) => Promise<{ response: { text: () => string } }>;
    modelName: string;
    isPaid: boolean;
}

class ModelRouter {
    private geminiFlash: any;
    private geminiPro: any;
    private vertexAI: any;
    private pplxKey: string;
    private deepseekKey: string;
    private xaiKey: string;
    private claudeKey: string;
    private registry: any;

    constructor() {
        this.registry = registryData;
        this.loadRegistry();
        
        this.pplxKey = process.env.PERPLEXITY_API_KEY || '';
        this.deepseekKey = process.env.DEEPSEEK_API_KEY || '';
        this.xaiKey = process.env.XAI_API_KEY || '';
        this.claudeKey = process.env.CLAUDE_API_KEY || '';
    }

    private ensureVertex() {
        if (this.vertexAI) return;
        
        try {
            const project = process.env.GOOGLE_PROJECT_ID;
            const location = process.env.GOOGLE_LOCATION || 'us-central1';
            const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
            const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (project && clientEmail && privateKey) {
                this.vertexAI = new VertexAI({ 
                    project, 
                    location,
                    googleAuthOptions: {
                        credentials: {
                            client_email: clientEmail,
                            private_key: privateKey
                        }
                    }
                });
                console.log("[ModelRouter] Vertex AI Initialized Lazily.");
            }
        } catch (e) {
            console.error("[ModelRouter] Vertex AI Lazy Initialization failed:", e);
        }
    }

    private loadRegistry() {
        this.registry = registryData;
    }

    private getModelTier(modelId: string): 'FREE' | 'PAID' {
        return this.registry.models?.[modelId]?.tier || 'PAID';
    }

    private hasKeyForModel(modelId: string): boolean {
        const provider = this.registry.models?.[modelId]?.provider;
        if (provider === 'google') {
            this.ensureVertex();
            return !!(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || this.vertexAI);
        }
        if (provider === 'anthropic') return !!(process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY);
        if (provider === 'xai') return !!process.env.XAI_API_KEY;
        if (provider === 'perplexity') return !!process.env.PERPLEXITY_API_KEY;
        if (provider === 'deepseek') return !!process.env.DEEPSEEK_API_KEY;
        return false;
    }

    private async createInstance(modelId: string): Promise<ModelInstance> {
        const isPaid = this.getModelTier(modelId) === 'PAID';
        const provider = this.registry.models?.[modelId]?.provider;

        if (provider === 'google') {
            this.ensureVertex();
            const executeGoogleAction = async (useVertex: boolean, modelName: string, p: string) => {
                if (useVertex && this.vertexAI) {
                    const model = this.vertexAI.getGenerativeModel({ model: modelName });
                    const res = await model.generateContent(p);
                    return { response: { text: () => res.response.candidates?.[0]?.content?.parts?.[0]?.text || '' } };
                } else {
                    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
                    if (!apiKey) throw new Error("No Gemini API Key for Standard SDK fallback");
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    return model.generateContent(p);
                }
            };

            return {
                modelName: modelId,
                isPaid,
                generateContent: async (prompt) => {
                    try {
                        return await executeGoogleAction(true, modelId, prompt);
                    } catch (e: any) {
                        const errorMsg = e.message?.toLowerCase() || '';
                        const isOverloaded = errorMsg.includes('503') || errorMsg.includes('high traffic') || errorMsg.includes('overloaded');
                        const isDisabled = errorMsg.includes('403') || errorMsg.includes('forbidden') || errorMsg.includes('not been used') || errorMsg.includes('disabled');
                        
                        if (isOverloaded || isDisabled) {
                            console.log(`[ModelRouter] 🚨 Google Service Issue (${isDisabled ? 'Disabled' : 'Overloaded'}). Attempting Self-Healing Fallback...`);
                            if (modelId === 'gemini-1.5-flash' && this.vertexAI) {
                                try { return await executeGoogleAction(true, 'gemini-1.5-pro', prompt); } catch (err) {}
                            }
                            try { return await executeGoogleAction(false, modelId, prompt); } catch (err) {}
                        }
                        throw e;
                    }
                }
            };
        }

        if (provider === 'anthropic') {
            const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
            return {
                modelName: modelId, isPaid,
                generateContent: async (prompt) => {
                    const res = await axios.post('https://api.anthropic.com/v1/messages', {
                        model: modelId, max_tokens: 4096,
                        messages: [{ role: 'user', content: prompt }]
                    }, { headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' } });
                    return { response: { text: () => res.data.content[0].text } };
                }
            };
        }

        if (provider === 'deepseek') {
            const key = process.env.DEEPSEEK_API_KEY;
            return {
                modelName: modelId, isPaid,
                generateContent: async (prompt) => {
                    const res = await axios.post('https://api.deepseek.com/chat/completions', {
                        model: modelId, messages: [{ role: 'user', content: prompt }]
                    }, { headers: { 'Authorization': `Bearer ${key}` } });
                    return { response: { text: () => res.data.choices[0].message.content } };
                }
            };
        }

        throw new Error(`Unknown provider for model ${modelId}`);
    }

    async getModel(options: RouterOptions = {}): Promise<ModelInstance> {
        const { taskType = 'GENERAL', complexity = 'medium', strict = false, allowPaid = false, reasoning = false } = options;
        const category = this.registry.categories[taskType] || this.registry.categories['GENERAL'];

        if ((reasoning || complexity === 'high') && allowPaid) {
            for (const modelId of (category.paid_sequence || [])) {
                if (this.hasKeyForModel(modelId)) return this.createInstance(modelId);
            }
        }

        for (const modelId of (category.free_sequence || [])) {
            if (this.hasKeyForModel(modelId)) return this.createInstance(modelId);
        }

        if (!allowPaid || taskType === 'CMD_SHELL') {
            if (this.hasKeyForModel('gemini-1.5-flash')) return this.createInstance('gemini-1.5-flash');
            throw new Error(`[ModelRouter] No FREE models available for ${taskType}.`);
        }

        for (const modelId of (category.paid_sequence || [])) {
            if (this.hasKeyForModel(modelId)) return this.createInstance(modelId);
        }

        if (!strict && this.hasKeyForModel('gemini-1.5-pro')) return this.createInstance('gemini-1.5-pro');
        throw new Error(`[ModelRouter] Critical failure: All model options exhausted.`);
    }
}

export const modelRouter = new ModelRouter();
