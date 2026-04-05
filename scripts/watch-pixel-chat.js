const admin = require('firebase-admin');
const https = require('https');

// Initialize Firebase Admin (Using service account from env if possible, or default)
// If running in development with GOOGLE_APPLICATION_CREDENTIALS set
if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'pmactioncontent' // Hardcoded for this project
    });
}

const db = admin.firestore();

async function sendWhatsAppMessage(to, text) {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token   = process.env.WHATSAPP_TOKEN;
    
    if (!phoneId || !token) {
        console.error('❌ Missing WhatsApp Credentials in Environment');
        return;
    }

    const payload = JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text }
    });

    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'graph.facebook.com',
            path: `/v19.0/${phoneId}/messages`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            }
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => res.statusCode >= 400 ? reject(data) : resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

console.log('👀 Watching for Direct Agent Commands...');

db.collection('agent_direct_commands')
    .where('status', '==', 'pending')
    .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                const id = change.doc.id;
                
                console.log(`\n📬 NEW COMMAND FROM PIXEL [${data.from}]:`);
                console.log(`> "${data.message}"`);
                
                // Mark as 'processing' so wait for agent to take action
                // Or if we want to auto-reply with a "Thinking..." message
                await change.doc.ref.update({ status: 'processing' });
                
                // In a real loop, the AGENT (me) would see this console output 
                // and then I would run a command to "reply" or perform the task.
            }
        });
    }, err => {
        console.error('Snapshot error:', err);
    });

// To allow the agent to reply from terminal: 
// Usage: node scripts/watch-direct-commands.js --reply "User Phone" "Message"
const args = process.argv.slice(2);
if (args[0] === '--reply') {
    const to = args[1];
    const text = args.slice(2).join(' ');
    if (to && text) {
        sendWhatsAppMessage(to, text)
            .then(() => console.log(`\n✅ Reply sent to ${to}`))
            .catch(e => console.error('❌ Failed to send reply:', e));
    }
}
