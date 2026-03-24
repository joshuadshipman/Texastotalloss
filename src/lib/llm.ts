import { modelRouter, ModelTier as RouterTier, TaskType } from './models/router';

/**
 * Legacy Compatibility & Simplified LLM Interface
 * 
 * Routes all requests through the unified 'ModelRouter'.
 */

export type ModelTier = 'FREE' | 'PRO' | 'PERPLEXITY';

export interface LLMRequest {
  prompt: string;
  tier: ModelTier;
  taskType?: TaskType;
  maxTokens?: number;
  complexity?: 'low' | 'medium' | 'high';
}

/**
 * Routes the request to the correct provider and model via ModelRouter
 */
export async function callLLM(request: LLMRequest): Promise<string> {
  const { prompt, tier, taskType = 'GENERAL', complexity = 'medium' } = request;

  // Log "Token Burn Alert" if prompt is huge
  if (prompt.length > 20000) {
    console.warn("🚨 [TOKEN BURN ALERT]: Prompt exceeds 5,000 tokens. Tier:", tier);
  }

  // Map legacy tiers to Router tiers
  let routerTier: RouterTier = 'FREE';
  if (tier === 'PRO') routerTier = 'PRO';
  if (tier === 'PERPLEXITY') routerTier = 'RESEARCHER';

  try {
    const model = await modelRouter.getModel({
        tier: routerTier,
        taskType: tier === 'PERPLEXITY' ? 'RESEARCH' : taskType,
        complexity: complexity,
        allowPaid: tier === 'PRO' || tier === 'PERPLEXITY'
    });

    console.log(`[llm.ts] Routing to: ${model.modelName} (Tier: ${tier})`);
    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (error: any) {
    console.error(`[llm.ts] Critical Error:`, error.message);
    
    // Auto-fallback: Emergency out to Gemini Flash if anything fails
    if (tier !== 'FREE') {
      console.log("fallback: Retrying with EMERGENCY FLASH...");
      try {
        const fallbackModel = await modelRouter.getModel({ tier: 'FREE', strict: false });
        const result = await fallbackModel.generateContent(prompt);
        return result.response.text();
      } catch (innerErr: any) {
        throw new Error(`Complete connectivity failure: ${innerErr.message}`);
      }
    }
    throw error;
  }
}
