import { callLLM } from './llm';
import { injectStrategyPersona, STRATEGY_ROLES } from './persona';

/**
 * Strategy Critic Agent
 * 
 * Uses the Model Router for adversarial audit.
 */

export interface StrategyCritique {
  frictionPoints: string[];
  profitabilityGaps: string[];
  competitiveWeakness: string[];
  confidenceScore: number;
}

export async function reviewStrategy(
  report: string, 
  role: keyof typeof STRATEGY_ROLES = 'OpsDirector'
): Promise<StrategyCritique> {
  const prompt = injectStrategyPersona(report, role, 'Critic');

  const responseText = await callLLM({
    prompt,
    tier: 'PRO' // Audit requires high reasoning
  });

  try {
    const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as StrategyCritique;
  } catch (error) {
    console.error("Strategy Critique JSON parse failed:", error);
    return { frictionPoints: ["Format error in critique"], profitabilityGaps: [], competitiveWeakness: [], confidenceScore: 0 };
  }
}
