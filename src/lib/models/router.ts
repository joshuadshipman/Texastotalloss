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
            // Priority 1: Use the full Service Account JSON if provided (common in Vercel/Production)
            const serviceAccountRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
            if (serviceAccountRaw) {
                try {
                    const credentials = JSON.parse(serviceAccountRaw.trim());
                    this.vertexAI = new VertexAI({ 
                        project: credentials.project_id, 
                        location: process.env.GOOGLE_LOCATION || 'us-central1',
                        googleAuthOptions: { credentials }
                    });
                    console.log("[ModelRouter] Vertex AI Initialized from Service Account JSON.");
                    return;
                } catch (parseErr) {
                    console.error("[ModelRouter] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", parseErr);
                }
            }

            // Priority 2: Use individual environment variables (common in local .env)
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
                console.log("[ModelRouter] Vertex AI Initialized from discrete env variables.");
            }
        } catch (e) {
            console.error("[ModelRouter] Vertex AI Initialization failed:", e);
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
            const executeGoogleAction = async (useVertex: boolean, modelName: string, p: string) => {
                const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
                
                // Priority: Use Standard SDK (AI Studio Free) if apiKey is present and it's a Flash model OR vertex is not initialized
                if (apiKey && (!useVertex || !this.vertexAI || modelName.includes('flash'))) {
                    try {
                        const genAI = new GoogleGenerativeAI(apiKey);
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const res = await model.generateContent(p);
                        return { response: { text: () => res.response.text() } };
                    } catch (err: any) {
                        console.warn(`[ModelRouter] Standard SDK failed for ${modelName}: ${err.message}. Falling back to Vertex...`);
                    }
                }

                // Fallback to Vertex AI
                this.ensureVertex();
                if (this.vertexAI) {
                    const model = this.vertexAI.getGenerativeModel({ model: modelName });
                    const res = await model.generateContent(p);
                    return { response: { text: () => res.response.candidates?.[0]?.content?.parts?.[0]?.text || '' } };
                }

                throw new Error("No available method (Standard SDK or Vertex) to execute Google AI request.");
            };

            return {
                modelName: modelId,
                isPaid,
                generateContent: async (prompt) => {
                    try {
                        // For Flash models, always try non-Vertex (Free) first
                        const initiallyUseVertex = !modelId.includes('flash');
                        return await executeGoogleAction(initiallyUseVertex, modelId, prompt);
                    } catch (e: any) {
                        const errorMsg = e.message?.toLowerCase() || '';
                        const isOverloaded = errorMsg.includes('503') || errorMsg.includes('high traffic') || errorMsg.includes('overloaded');
                        const isAuthError = errorMsg.includes('403') || errorMsg.includes('404') || errorMsg.includes('forbidden') || errorMsg.includes('not found') || errorMsg.includes('not been used') || errorMsg.includes('disabled');
                        
                        if (isOverloaded || isAuthError) {
                            console.log(`[ModelRouter] 🚨 Google Service Issue (${isAuthError ? 'Auth/Config' : 'Overloaded'}). Attempting Self-Healing Fallback...`);
                            // Emergency cross-model fallback
                            if (modelId === 'gemini-1.5-flash') {
                                try { return await executeGoogleAction(true, 'gemini-1.5-pro', prompt); } catch (err) {}
                            }
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

        throw new Error(`Unknown or Decommissioned provider for model ${modelId}`);
    }

    async getModel(options: RouterOptions = {}): Promise<ModelInstance> {
        const { taskType = 'GENERAL', complexity = 'medium', strict = false, allowPaid = false, reasoning = false } = options;
        const category = this.registry.categories[taskType] || this.registry.categories['GENERAL'];

        // 1. Try Paid Sequence (if requested or complex)
        if ((reasoning || complexity === 'high') && allowPaid) {
            for (const modelId of (category.paid_sequence || [])) {
                if (this.hasKeyForModel(modelId)) return this.createInstance(modelId);
            }
        }

        // 2. Try Free Sequence (Standard for routine tasks)
        for (const modelId of (category.free_sequence || [])) {
            if (this.hasKeyForModel(modelId)) return this.createInstance(modelId);
        }

        // 3. Last Resort: Global Fallbacks
        if (!strict) {
            // Priority 1: Gemini 1.5 Flash (Global standard free fallback)
            if (this.hasKeyForModel('gemini-1.5-flash')) return this.createInstance('gemini-1.5-flash');
            
            // Priority 2: Perplexity (Research/Grounded fallback)
            if (this.hasKeyForModel('llama-3.1-sonar-small-128k-online')) return this.createInstance('llama-3.1-sonar-small-128k-online');
        }

        // 4. Critical Failure: If still nothing, try Pro models as an emergency out if allowed
        if (!strict && allowPaid) {
            for (const modelId of (category.paid_sequence || [])) {
                if (this.hasKeyForModel(modelId)) return this.createInstance(modelId);
            }
        }

        // 5. Final Emergency Fallback: If absolutely nothing found, try ANY authenticated model
        const allModelIds = Object.keys(this.registry.models);
        for (const modelId of allModelIds) {
            const provider = this.registry.models?.[modelId]?.provider;
            if (provider === 'deepseek') continue; // Skip decommissioned
            
            if (this.hasKeyForModel(modelId)) {
                console.log(`[ModelRouter] 🛡️ EMERGENCY FALLBACK: Using ${modelId}`);
                return this.createInstance(modelId);
            }
        }

        throw new Error(`[ModelRouter] Connectivity failure: No authenticated models available for ${taskType}. Please check your .env keys.`);
    }
}

export const modelRouter = new ModelRouter();
