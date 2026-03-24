import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log("--- Environment Variable Diagnostic ---");
const relevantKeys = [
    'CLAUDE_API_KEY',
    'ANTHROPIC_API_KEY',
    'PERPLEXITY_API_KEY',
    'DEEPSEEK_API_KEY',
    'GEMINI_API_KEY',
    'NEXT_PUBLIC_GEMINI_API_KEY',
    'GOOGLE_PROJECT_ID',
    'GOOGLE_SERVICE_ACCOUNT_JSON'
];

relevantKeys.forEach(key => {
    const val = process.env[key];
    console.log(`${key}: ${val ? 'EXISTS (Length: ' + val.length + ')' : 'MISSING'}`);
});
