import { callLLM } from './llm';
import { injectStrategyPersona, STRATEGY_ROLES } from './persona';

/**
 * Strategy Research Agent
 * 
 * Uses the Model Router to trigger deep-dive research.
 */

export async function performStrategyResearch(
  topic: string, 
  role: keyof typeof STRATEGY_ROLES = 'CMO'
): Promise<string> {
  const prompt = injectStrategyPersona(`Investigate: ${topic}.
    
    RESEARCH GUIDELINES:
    1. How does this take competitive advantage away from generic 'Lead-Gen' firms?
    2. How do we target 'Witness-Stand Quality' leads (Clear liability + Physical Damage)?
    3. How can we implement this to be quicker/more profitable?
    4. Can this be 'Gamified' to feel easier for the customer?`, role, 'Research');

  return await callLLM({
    prompt,
    tier: 'PRO' // Research always uses 'PRO' tier for deep reasoning
  });
}
