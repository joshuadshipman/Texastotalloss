import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PROJECT_NAME = "TexasTotalLoss-Automation";
const PROJECT_ID = `ttl-automation-${Math.floor(Date.now() / 1000)}`; // Random ID for uniqueness
const SERVICE_ACCOUNT_NAME = "seo-bot";

function run(cmd) {
    console.log(`\n🏃 Running: ${cmd}`);
    return execSync(cmd).toString();
}

try {
    console.info("Starting GCP Setup for Texas Total Loss...");

    // 1. Create Project
    try {
        run(`gcloud projects create ${PROJECT_ID} --name="${PROJECT_NAME}"`);
    } catch (e) {
        console.warn("Project might already exist or creation failed. Continuing...");
    }

    run(`gcloud config set project ${PROJECT_ID}`);

    // 2. Enable APIs
    console.info("Enabling Google APIs (This takes a moment)...");
    run(`gcloud services enable searchconsole.googleapis.com`);
    run(`gcloud services enable businessprofileperformance.googleapis.com`);
    run(`gcloud services enable mybusinessbusinessinformation.googleapis.com`);

    // 3. Create Service Account
    console.info("Creating Service Account...");
    run(`gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} --display-name="SEO Bot for Texas Total Loss"`);

    // 4. Grant Roles
    console.info("Granting Owner permissions...");
    const saEmail = `${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com`;
    run(`gcloud projects add-iam-policy-binding ${PROJECT_ID} --member="serviceAccount:${saEmail}" --role="roles/owner"`);

    // 5. Create Key
    console.info("Generating Key (service-account.json)...");
    run(`gcloud iam service-accounts keys create service-account.json --iam-account=${saEmail}`);

    console.success("GCP Setup 100% Complete. service-account.json has been generated in the root.");
    console.info(`\nNEXT STEP: You MUST add these to Vercel.`);
    console.info(`Email: ${saEmail}`);

} catch (err) {
    console.error(`\n❌ Setup Failed: ${err.message}`);
    process.exit(1);
}
