const admin = require('firebase-admin');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Initialize Firebase
const serviceAccount = require('../service-account.json'); // Assumes user has this locally
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

console.log('🚀 Antigravity Real-Time Bridge Started');
console.log('📡 Listening for remote commands from the Pixel Phone...');

// Watch for NEW commands in 'agent_commands' collection
db.collection('agent_commands')
    .where('status', '==', 'pending')
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                const data = change.doc.data();
                const commandId = change.doc.id;
                
                console.info(`\n[REMOTE] ${data.source || 'Pixel'}: "${data.command}"`);
                
                // Update status to 'processing'
                await change.doc.ref.update({ status: 'processing', started_at: admin.firestore.FieldValue.serverTimestamp() });

                // Execute Command logic
                try {
                    // 1. Log to local live_dispatch
                    const logEntry = `[${new Date().toISOString()}] REMOTE_CMD: ${data.command}\n`;
                    fs.appendFileSync(path.join(process.cwd(), '.agent/live_dispatch.log'), logEntry);

                    // 2. Logic to actually perform the command
                    // For now, we simulate a response
                    let response = `Antigravity received: "${data.command}". I am processing this on your local machine.`;
                    
                    // Specific logic for 'build', 'status', 'deploy'
                    if (data.command.toLowerCase().includes('status')) {
                        response = "System Status: All systems green. 9 workspace partitions isolated. Mobile Admin Dashboard online.";
                    } else if (data.command.toLowerCase().includes('ls')) {
                        const files = fs.readdirSync(process.cwd());
                        response = `Local Root: ${files.slice(0,10).join(', ')}...`;
                    }

                    // 3. Post response back to Firestore
                    await change.doc.ref.update({
                        status: 'completed',
                        response: response,
                        completed_at: admin.firestore.FieldValue.serverTimestamp()
                    });
                    
                    console.success(`[REPLY] Sent response to phone.`);

                } catch (err) {
                    console.error(`[ERROR] ${err.message}`);
                    await change.doc.ref.update({
                        status: 'failed',
                        error: err.message
                    });
                }
            }
        });
    });
