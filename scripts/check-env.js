
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Note: This requires the dist/ compiled version or using jiti/register
// Since we are in a Next.js project, we can try to use jiti or just assume the logic is correct.
// Alternatively, let's just check if the env variables are accessible.

console.log("Checking Environment Variables...");
console.log("GOOGLE_PROJECT_ID:", process.env.GOOGLE_PROJECT_ID);
console.log("PERPLEXITY_API_KEY:", process.env.PERPLEXITY_API_KEY ? "EXISTS" : "MISSING");
console.log("GOOGLE_SERVICE_ACCOUNT_JSON:", process.env.GOOGLE_SERVICE_ACCOUNT_JSON ? "EXISTS (Length: " + process.env.GOOGLE_SERVICE_ACCOUNT_JSON.length + ")" : "MISSING");

const serviceAccountRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if (serviceAccountRaw) {
    try {
        const credentials = JSON.parse(serviceAccountRaw.trim());
        console.log("✅ Service Account JSON is valid JSON.");
        console.log("Project ID from JSON:", credentials.project_id);
    } catch (e) {
        console.error("❌ Invalid JSON in GOOGLE_SERVICE_ACCOUNT_JSON:", e.message);
    }
}
