const { google } = require('googleapis');
const open = require('open');
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const REQUIRED_SCOPES = ['https://www.googleapis.com/auth/tasks.readonly'];
const ENV_PATH = path.join(__dirname, '../../.env');

async function main() {
    console.log("🎤 Setting up Voice Commands (Google Tasks Sync)...");

    // 1. Check for existing credentials or ask user
    console.log("\n⚠️  IMPORTANT: You need a 'credentials.json' file from Google Cloud.");
    console.log("   If you don't have one, go to: https://console.cloud.google.com/apis/credentials");
    console.log("   Create 'OAuth Client ID' > 'Desktop App' > Download JSON.");
    console.log("   Save it as 'functions/credentials.json'.\n");

    const credentialsPath = path.join(__dirname, '../credentials.json');
    if (!fs.existsSync(credentialsPath)) {
        console.error("❌ 'functions/credentials.json' not found. Please download it first.");
        return;
    }

    const keys = require(credentialsPath).installed || require(credentialsPath).web;
    const oauth2Client = new google.auth.OAuth2(
        keys.client_id,
        keys.client_secret,
        'http://localhost:3005/oauth2callback'
    );

    // 2. Start Local Server to catch code
    const server = http.createServer(async (req, res) => {
        if (req.url.startsWith('/oauth2callback')) {
            const q = url.parse(req.url, true).query;
            const { tokens } = await oauth2Client.getToken(q.code);

            oauth2Client.setCredentials(tokens);
            saveTokens(tokens);

            res.end('Authentication successful! You can close this tab.');
            server.close();
            console.log("\n✅ Success! Tokens saved to .env");
            console.log("👉 You can now restart your server.");
            process.exit(0);
        }
    }).listen(3005);

    // 3. Open Browser
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: REQUIRED_SCOPES,
    });

    console.log("👉 Go to this URL to authorize:");
    console.log(authUrl);
    // await open(authUrl); // 'open' package causing issues with ESM/CJS, user can click link.
}

function saveTokens(tokens) {
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
        envContent = fs.readFileSync(ENV_PATH, 'utf8');
    }

    // Update or Add token keys
    const newLines = [];
    const lines = envContent.split('\n');
    let foundRefresh = false;

    lines.forEach(line => {
        if (line.startsWith('GOOGLE_REFRESH_TOKEN=')) {
            if (tokens.refresh_token) {
                newLines.push(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
                foundRefresh = true;
            } else {
                newLines.push(line); // Keep old one if new one is missing (access_token refresh)
            }
        } else if (!line.startsWith('GOOGLE_ACCESS_TOKEN=')) {
            newLines.push(line);
        }
    });

    if (!foundRefresh && tokens.refresh_token) {
        newLines.push(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    }

    // We don't really need to store access token purely in .env for long term, 
    // but good for immediate testing. Refresh token is key.

    fs.writeFileSync(ENV_PATH, newLines.join('\n').trim() + '\n');
}

main().catch(console.error);
