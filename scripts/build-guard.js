/**
 * Build Guard (Self-Repair Mechanism)
 * 
 * This script runs the build process, captures errors, and uses AI 
 * to suggest or apply fixes for common lint/type issues.
 */

const { execSync } = require('child_process');
const fs = require('fs');

async function runBuildGuard() {
    console.log("🚀 Starting Build Guard...");

    try {
        console.log("📦 Running npm run build...");
        execSync('npm run build', { stdio: 'pipe' });
        console.log("✅ Build successful! Repository is healthy.");
    } catch (error) {
        const stderr = error.stderr ? error.stderr.toString() : "";
        const stdout = error.stdout ? error.stdout.toString() : "";
        const combinedOutput = stdout + "\n" + stderr;

        console.error("❌ Build failed. Analyzing errors...");
        fs.writeFileSync('build_error_current.log', combinedOutput);

        // Error categories
        const isTypeError = combinedOutput.includes('error TS');
        const isLintError = combinedOutput.includes('eslint');
        const isMissingModule = combinedOutput.includes('Module not found');

        console.log("--- ERROR ANALYSIS ---");
        if (isTypeError) console.log("Category: TypeScript Type Error");
        if (isLintError) console.log("Category: ESLint Violation");
        if (isMissingModule) console.log("Category: Missing Dependency");

        // In a real MCP environment, this would trigger an agent call to:
        // 1. Read the failing file(s).
        // 2. Propose a code change via multi_replace_file_content.

        console.log("📝 Error details saved to build_error_current.log");
        console.log("💡 FIX SUGGESTION: Run 'npm run lint --fix' or check type definitions in the reported files.");
    }
}

runBuildGuard();
