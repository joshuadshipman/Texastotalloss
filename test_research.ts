import { runStrategyRefinement } from './src/lib/research_loop';

async function testStrategyLoop() {
  console.log("=== STARTING STRATEGY REFINEMENT TEST ===");
  const topic = "Gamifying the EvidenceUploader to capture 'Witness-Stand Quality' photos in < 30 seconds.";
  
  // Running with CMO for the report and OpsDirector for the critique
  const result = await runStrategyRefinement(topic, 'ProductLead');
  
  console.log("\n=== FINAL STRATEGY REPORT ===");
  console.log(result.finalStrategy.substring(0, 800) + "...");
  
  console.log("\n=== CRITIQUE HISTORY (Ops Director Audit) ===");
  result.critiqueHistory.forEach((c, i) => {
    console.log(`Iteration ${i+1}: Confidence ${c.confidenceScore}%`);
    console.log(`Friction Points Found: ${c.frictionPoints.length}`);
    console.log(`Profitability Gaps: ${c.profitabilityGaps.length}`);
  });
}

testStrategyLoop();
