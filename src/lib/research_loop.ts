import { performStrategyResearch } from './research_agent';
import { reviewStrategy, StrategyCritique } from './critic_agent';
import { STRATEGY_ROLES, assignPersonaForTopic } from './persona';
import { saveStrategyReport } from './StrategyStorage';

/**
 * Autonomous Strategy Loop Manager
 * 
 * Orchestrates the "24/7 Improvement" cycle.
 * Automatically chooses the best roles for research and audit.
 */

export async function runAutonomousImprovement(
  topic: string, 
  maxIterations: number = 3
): Promise<{
  finalStrategy: string;
  critiqueHistory: StrategyCritique[];
  assignedPersona: string;
  totalCost: number;
}> {
  // 1. Intelligent Persona Assignment
  const primaryRole = assignPersonaForTopic(topic);
  let currentReport = "";
  const critiqueHistory: StrategyCritique[] = [];
  let confidence = 0;
  let totalCost = 0;

  console.log(`Autonomous Hub: Assigned ${primaryRole} to investigate "${topic}"`);

  for (let i = 0; i < maxIterations; i++) {
    // Simulated Cost Accumulation (Assuming 2 calls per iteration)
    totalCost += 0.015; 

    // 2. Research (Primary Role)
    const feedback = i === 0 
      ? "" 
      : `REBUTTAL/FIX REQUIRED: ${critiqueHistory[i-1].frictionPoints.join(', ')}`;
      
    currentReport = await performStrategyResearch(`${topic}\n${feedback}`, primaryRole);

    // 3. Critique (OpsDirector or TrafficStrategist for cost-focused topics)
    const auditorRole = (primaryRole === 'TrafficStrategist') ? 'TrafficStrategist' : 'OpsDirector';
    const critique = await reviewStrategy(currentReport, auditorRole as any); 
    critiqueHistory.push(critique);
    confidence = critique.confidenceScore;

    if (confidence >= 85) break;
  }

  // 4. Autonomous Knowledge Base Save
  await saveStrategyReport({
    topic,
    persona: STRATEGY_ROLES[primaryRole].name,
    content: currentReport,
    confidenceScore: confidence,
    totalCost,
    status: 'Draft'
  });

  return {
    finalStrategy: currentReport,
    critiqueHistory,
    assignedPersona: primaryRole,
    totalCost
  };
}
