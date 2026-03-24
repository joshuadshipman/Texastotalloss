import { runAutonomousImprovement } from './src/lib/research_loop';

async function testDeepResearch() {
  const topic = `What are the top complaints regarding total losses against claimant carrier insurance companies. 
  What can we help the customer do to ensure they (the other carrier' or ours if UM) is properly addressing their needs. 
  What support can we provide, free of charge, to build trust and hopefully match the customer with a injury law firm.`;

  console.log("🚀 STARTING AUTONOMOUS DEEP DIVE...");
  console.log("-----------------------------------");
  
  try {
    const result = await runAutonomousImprovement(topic);

    console.log("\n✅ RESEARCH COMPLETE");
    console.log(`PERSONA ASSIGNED: ${result.assignedPersona}`);
    console.log(`TOTAL COST: $${result.totalCost.toFixed(4)}`);
    console.log(`FINAL CONFIDENCE: ${result.critiqueHistory[result.critiqueHistory.length - 1].confidenceScore}%`);
    
    console.log("\n--- FINAL STRATEGY REPORT ---");
    console.log(result.finalStrategy);
    
    console.log("\n--- AUDIT HISTORY (HOLE POKING) ---");
    result.critiqueHistory.forEach((c, i) => {
      console.log(`\nIteration ${i+1} Audit:`);
      console.log(`- Friction Points: ${c.frictionPoints.join(', ')}`);
      console.log(`- Confidence: ${c.confidenceScore}%`);
    });

  } catch (error) {
    console.error("Test Failed:", error);
  }
}

testDeepResearch();
