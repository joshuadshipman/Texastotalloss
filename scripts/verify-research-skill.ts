import { modelRouter } from '../src/lib/models/router';

/**
 * Iron Law Verification Test for ttl-competitor-research-agent.
 * 
 * FAILURE CONDITION (No Skill): 
 * Agent attempts to "research" by simply summarizing surface text rather than identifying underlying 
 * lead-gen patterns (multi-step forms, logic jumps, conversion hooks).
 * 
 * SUCCESS CONDITION (With Skill):
 * Agent identifies structural architecture and conversion psychology patterns.
 */
async function verifyResearchSkill() {
    console.log("--- 🧠 Verifying Competitor Research Skill (Iron Law) ---");

    const researcher = await modelRouter.getModel({ taskType: 'RESEARCH', allowPaid: false });

    // Mock "Surface Info" to see if AI just repeats it or extracts patterns
    const baselinePrompt = `
    Analyze this competitor "Texas Car Crash Pro":
    - Home Page: "We win your Texas property damage claim or you pay nothing!"
    - Features: Free calculator, 24/7 chat, Video testimonial.
    - CTA: "Start Your Claim" links to a 15-question slider form.
    
    Instruction: Perform a research audit for Texas Total Loss.
    `;

    try {
        const result = await researcher.generateContent(baselinePrompt);
        const output = result.response.text();
        
        console.log("\nOutput Analysis:");
        const hasPatterns = output.toLowerCase().includes('pattern') || output.toLowerCase().includes('funnel structure');
        
        if (hasPatterns) {
            console.log("✅ SUCCESS: AI correctly identified patterns rather than just summarizing text.");
        } else {
            console.warn("🏮 FAILURE: AI just summarized the content. Skill Guidance is CRITICAL.");
            process.exit(1);
        }
    } catch (e) {
        console.error("Verification failed:", e);
    }
}

verifyResearchSkill();
