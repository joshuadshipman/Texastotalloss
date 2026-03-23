import fs from 'fs';
import { execSync } from 'child_process';

/**
 * apply-fix.mjs
 * 
 * Usage: node scripts/apply-fix.mjs --solution=fix.json
 * 
 * The fix.json should be an array of objects:
 * [
 *   {
 *     "file": "path/to/file.ts",
 *     "find": "old code",
 *     "replace": "new code"
 *   }
 * ]
 */

function applyFix() {
    const args = process.argv.slice(2);
    const solutionArg = args.find(a => a.startsWith('--solution='));
    
    if (!solutionArg) {
        console.error("❌ No solution file provided. Use --solution=path/to/fix.json");
        process.exit(1);
    }

    const solutionPath = solutionArg.split('=')[1];
    if (!fs.existsSync(solutionPath)) {
        console.error(`❌ Solution file not found: ${solutionPath}`);
        process.exit(1);
    }

    try {
        const solution = JSON.parse(fs.readFileSync(solutionPath, 'utf8'));
        
        if (!Array.isArray(solution)) {
            console.error("❌ Invalid solution format. Expected an array of changes.");
            process.exit(1);
        }

        for (const change of solution) {
            const { file, find, replace } = change;
            if (!file || find === undefined || replace === undefined) {
                console.warn(`⚠️ Skipping invalid change: ${JSON.stringify(change)}`);
                continue;
            }

            if (!fs.existsSync(file)) {
                console.warn(`⚠️ File not found: ${file}`);
                continue;
            }

            let content = fs.readFileSync(file, 'utf8');
            if (content.includes(find)) {
                console.log(`✅ Applying fix to ${file}...`);
                content = content.replace(find, replace);
                fs.writeFileSync(file, content);
            } else {
                console.warn(`⚠️ Could not find target content in ${file}.`);
            }
        }

        console.log("🎉 All fixes applied! Try running 'npm run smart-build' now.");
    } catch (e) {
        console.error(`❌ Failed to apply fix: ${e.message}`);
        process.exit(1);
    }
}

applyFix();
