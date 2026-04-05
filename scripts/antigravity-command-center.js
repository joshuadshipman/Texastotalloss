const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { generateContent } = require('../functions/modelRouter');

// 1. Initialize Firebase (Local mode using Service Account or Default)
// Try to find the service account JSON
const serviceAccountPath = path.join(process.cwd(), 'service-account.json');
if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'total-loss-intake-bot'
    });
} else {
    // Fallback to default (usually works if logged into gcloud or inside Firebase environment)
    admin.initializeApp({
        projectId: 'total-loss-intake-bot'
    });
}

const db = admin.firestore();

// 2. Load Context (Workspace Knowledge)
function getWorkspaceContext() {
    try {
        const roadmap = fs.readFileSync(path.join(process.cwd(), 'ROADMAP.md'), 'utf-8');
        const tasks = fs.readFileSync(path.join(process.cwd(), 'PENDING_DECISIONS.md'), 'utf-8');
        return `Current ROADMAP:\n${roadmap}\n\nPENDING TASKS:\n${tasks}`;
    } catch (e) {
        return "No specific roadmap/task documents found in root.";
    }
}

console.log('🌌 Antigravity Command Center ACTIVE');
console.log('📅 Projects: Admin Mobile Dashboard, Shopping Bot Unified Bridge');
console.log('📡 Listening for direct commands...');

// 3. The Monitor Loop
db.collection('agent_direct_commands')
    .where('status', '==', 'pending')
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                const cmdId = change.doc.id;
                const command = data.message;
                const source = data.source || 'Unknown';

                console.info(`\n[INCOMING] ${source}: "${command}"`);

                // Mark as processing
                await change.doc.ref.update({ status: 'processing' });

                try {
                    // Decide strategy
                    const isResearch = command.toLowerCase().includes('search') || command.toLowerCase().includes('who');
                    const preferredModel = isResearch ? 'perplexity' : 'gemini';

                    const systemInstruction = `You are the Antigravity Agent CORE. 
                    You are talking directly to the USER (Joshua) from his mobile phone or admin dashboard.
                    Your local workspace context is:
                    ${getWorkspaceContext()}
                    
                    Respond concisely and professionally. If the user asks you to perform a task (like 'build' or 'deploy'), acknowledge that you (the local agent) are receiving the command and will execute it in the next cycle.`;

                    // Generate Response
                    const responseText = await generateContent({
                        prompt: command,
                        systemInstruction,
                        preferredModel
                    });

                    // Post Response
                    await change.doc.ref.update({
                        status: 'completed',
                        response: responseText,
                        completed_at: admin.firestore.FieldValue.serverTimestamp()
                    });

                    console.success(`[REPLY] Sent to ${source}.`);

                } catch (error) {
                    console.error(`[ERROR] Failed to process: ${error.message}`);
                    await change.doc.ref.update({
                        status: 'failed',
                        error: error.message
                    });
                }
            }
        });
    });

// Keep process alive
process.stdin.resume();
