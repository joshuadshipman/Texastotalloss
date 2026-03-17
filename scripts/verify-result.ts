import { modelRouter } from '../src/lib/models/router';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Double-Audit Utility: Use a FREE model to sanity check a code change.
 * Prevents "rework" by catching obvious mistakes before declaring a task done.
 */
async function auditChange(filePath: string, instruction: string) {
    console.log(`--- 🔍 Auditing Change: ${path.basename(filePath)} ---`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const auditor = await modelRouter.getModel({ taskType: 'GENERAL', allowPaid: false });

    const auditPrompt = `
    Act as a Senior Verification Engineer. 
    Audit the following file content after a recent change.
    Target Instruction: "${instruction}"
    
    FILE CONTENT:
    ${content}
    
    Check for:
    1. Does it meet the target instruction?
    2. Are there obvious syntax errors or missing brackets?
    3. Is there anything that would cause a runtime crash?
    
    If it is PERFECT, reply: "PASS"
    If there are issues, reply with a SHORT numbered list of fixes needed.
    `;

    try {
        const result = await auditor.generateContent(auditPrompt);
        const report = result.response.text();
        
        if (report.trim().toUpperCase() === 'PASS') {
            console.log("✅ AUDIT PASSED.");
        } else {
            console.warn("🏮 AUDIT WARNINGS FOUND:");
            console.log(report);
            process.exit(1); // Signal failure to the agent
        }
    } catch (e) {
        console.error("Audit failed:", e);
    }
}

const [,, file, instr] = process.argv;
if (file && instr) {
    auditChange(file, instr);
} else {
    console.log("Usage: npx tsx scripts/verify-result.ts <file_path> <instruction>");
}
