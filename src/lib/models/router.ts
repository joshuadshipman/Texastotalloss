import { GoogleGenerativeAI } from '@google/generative-ai';
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
    private pplxKey: string;
    private deepseekKey: string;
    private xaiKey: string;
    private claudeKey: string;
    private registry: any;

    constructor() {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
        const genAI = new GoogleGenerativeAI(apiKey);
        // Default Google Models
        this.geminiFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.geminiPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        this.pplxKey = process.env.PERPLEXITY_API_KEY || '';
        this.deepseekKey = process.env.DEEPSEEK_API_KEY || '';
        this.xaiKey = process.env.XAI_API_KEY || '';
        this.claudeKey = process.env.CLAUDE_API_KEY || '';
        
        if (!apiKey) console.warn("[ModelRouter] Warning: No Gemini API key found in NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY.");
        
        this.loadRegistry();
    }

    private loadRegistry() {
        this.registry = registryData;
    }

    private getModelTier(modelId: string): 'FREE' | 'PAID' {
        return this.registry.models?.[modelId]?.tier || 'PAID';
    }

    private hasKeyForModel(modelId: string): boolean {
        const provider = this.registry.models?.[modelId]?.provider;
        if (provider === 'google') return !!(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY);
        if (provider === 'anthropic') return !!this.claudeKey;
        if (provider === 'xai') return !!this.xaiKey;
        if (provider === 'perplexity') return !!this.pplxKey;
        if (provider === 'deepseek') return !!this.deepseekKey;
        return false;
    }

    private async createInstance(modelId: string): Promise<ModelInstance> {
        const isPaid = this.getModelTier(modelId) === 'PAID';
        const provider = this.registry.models?.[modelId]?.provider;

        if (provider === 'google') {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelId });
            return {
                generateContent: (p) => model.generateContent(p),
                modelName: modelId,
                isPaid
            };
        }

        if (provider === 'anthropic') {
            return {
                modelName: modelId,
                isPaid,
                generateContent: async (prompt) => {
                    const res = await axios.post('https://api.anthropic.com/v1/messages', {
                        model: modelId,
                        max_tokens: 4096,
                        messages: [{ role: 'user', content: prompt }]
                    }, { headers: { 
                        'x-api-key': this.claudeKey, 
                        'anthropic-version': '2023-06-01',
                        'content-type': 'application/json'
                    } });
                    return { response: { text: () => res.data.content[0].text } };
                }
            };
        }

        if (provider === 'xai') {
            return {
                modelName: modelId,
                isPaid,
                generateContent: async (prompt) => {
                    const res = await axios.post('https://api.x.ai/v1/chat/completions', {
                        model: modelId,
                        messages: [{ role: 'user', content: prompt }]
                    }, { headers: { 'Authorization': `Bearer ${this.xaiKey}` } });
                    return { response: { text: () => res.data.choices[0].message.content } };
                }
            };
        }

        if (provider === 'perplexity') {
            return {
                modelName: modelId,
                isPaid,
                generateContent: async (prompt) => {
                    const res = await axios.post('https://api.perplexity.ai/chat/completions', {
                        model: modelId,
                        messages: [{ role: 'user', content: prompt }]
                    }, { headers: { 'Authorization': `Bearer ${this.pplxKey}` } });
                    return { response: { text: () => res.data.choices[0].message.content } };
                }
            };
        }

        if (provider === 'deepseek') {
            return {
                modelName: modelId,
                isPaid,
                generateContent: async (prompt) => {
                    const res = await axios.post('https://api.deepseek.com/chat/completions', {
                        model: modelId,
                        messages: [{ role: 'user', content: prompt }]
                    }, { headers: { 'Authorization': `Bearer ${this.deepseekKey}` } });
                    return { response: { text: () => res.data.choices[0].message.content } };
                }
            };
        }

        throw new Error(`Unknown provider for model ${modelId}`);
    }

    async getModel(options: RouterOptions = {}): Promise<ModelInstance> {
        const { taskType = 'GENERAL', complexity = 'medium', strict = false, allowPaid = false, reasoning = false } = options;
        const category = this.registry.categories[taskType] || this.registry.categories['GENERAL'];

        console.log(`[ModelRouter] ROUTING: Type=${taskType}, Complexity=${complexity}, Reasoning=${reasoning}, AllowPaid=${allowPaid}`);

        // 0. High Reasoning / High Complexity Override (If explicitly allowed or requested)
        if ((reasoning || complexity === 'high') && allowPaid) {
            console.log(`[ModelRouter] 🧠 High Reasoning/Complexity requested. Priority shift to Premium.`);
            for (const modelId of (category.paid_sequence || [])) {
                if (this.hasKeyForModel(modelId)) {
                    console.log(`[ModelRouter] 💎 Using PERFECTION Tier Model: ${modelId}`);
                    return this.createInstance(modelId);
                }
            }
        }

        // 1. Try Free Sequence first
        for (const modelId of (category.free_sequence || [])) {
            if (this.hasKeyForModel(modelId)) {
                console.log(`[ModelRouter] ✅ Using FREE Model: ${modelId}`);
                return this.createInstance(modelId);
            }
        }

        // 2. If no free options or routine task
        if (!allowPaid || taskType === 'CMD_SHELL') {
            const errorMsg = `[ModelRouter] 🏮 STOP: All FREE options for "${taskType}" are exhausted/unavailable. Paid fallback is DISABLED to save tokens.`;
            console.error(errorMsg);
            
            // Critical Fallback to Gemini Flash if available, otherwise hard error
            if (this.hasKeyForModel('gemini-1.5-flash')) {
                console.warn("[ModelRouter] emergency fallback to Gemini Flash (Free Tier).");
                return this.createInstance('gemini-1.5-flash');
            }
            throw new Error(errorMsg);
        }

        // 3. Try Paid Sequence (ONLY if explicitly allowed)
        console.warn(`[ModelRouter] 💰 ENTERING PAID TIER for ${taskType}...`);
        for (const modelId of (category.paid_sequence || [])) {
            if (this.hasKeyForModel(modelId)) {
                console.log(`[ModelRouter] 💸 Using PAID Model: ${modelId}`);
                return this.createInstance(modelId);
            }
        }

        // 4. Final Fallback (Google Pro - only if NOT strict)
        if (!strict && this.hasKeyForModel('gemini-1.5-pro')) {
            console.warn(`[ModelRouter] ⚠️ All sequences failed. Final fallback to Gemini Pro.`);
            return this.createInstance('gemini-1.5-pro');
        }

        throw new Error(`[ModelRouter] ❌ CRITICAL: Exhausted all model options for ${taskType}. Check API keys.`);
    }
}

export const modelRouter = new ModelRouter();
