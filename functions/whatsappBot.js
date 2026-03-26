'use strict';
/**
 * GravityClaw WhatsApp Bot
 * Meta WhatsApp Cloud API (free tier) webhook receiver.
 * 
 * GET  /whatsappBot → Meta webhook verification
 * POST /whatsappBot → Incoming message handler
 * 
 * Supported commands:
 *   "add [item]"            → adds item to shopping_list
 *   "list" / "show list"   → returns pending shopping items
 *   "radar" / "news"       → returns latest Tech Radar articles
 *   "skills"               → lists enabled skills
 *   "summary"              → triggers weekly life summary task
 *   anything else          → routes to Gemini for a smart reply
 */

const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');
const https = require('https');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!admin.apps.length) admin.initializeApp();

// ─── WhatsApp Cloud API Helper ─────────────────────────────────────────────

async function sendWhatsAppMessage(to, text) {
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token   = process.env.WHATSAPP_TOKEN;
    if (!phoneId || !token) {
        logger.error('[whatsapp] Missing WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_TOKEN');
        return;
    }

    const payload = JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text.slice(0, 4096) } // WhatsApp max length
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
            res.on('end', () => {
                if (res.statusCode >= 400) {
                    logger.error('[whatsapp] Send failed:', data);
                    reject(new Error(data));
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

// ─── Intent Router ────────────────────────────────────────────────────────

async function routeIntent(db, fromNumber, messageText) {
    const text = messageText.trim().toLowerCase();
    const geminiKey = process.env.GEMINI_KEY;

    // ── 1. Shopping list: "add milk" / "add 2 eggs" ──────────────────────
    const addMatch = text.match(/^add\s+(.+)$/i) || text.match(/^add to (?:list|cart):?\s*(.+)$/i);
    if (addMatch) {
        const itemName = addMatch[1].trim();
        const docRef = await db.collection('shopping_list').add({
            product_name: itemName,
            quantity: 1,
            status: 'pending',
            source: 'whatsapp',
            user_phone: fromNumber,
            added_at: new Date().toISOString()
        });
        await db.collection('whatsapp_log').add({ from: fromNumber, message: messageText, intent: 'add_item', at: new Date() });
        return `✅ Added *${itemName}* to your shopping list!\n\nSend "list" to see everything, or "add [another item]" to keep going.`;
    }

    // ── 2. View shopping list ─────────────────────────────────────────────
    if (/^(list|show list|my list|shopping list|cart)$/i.test(text)) {
        const snap = await db.collection('shopping_list')
            .where('status', 'in', ['pending', 'pending_user_review'])
            .orderBy('added_at', 'desc')
            .limit(15)
            .get();

        if (snap.empty) return '🛒 Your shopping list is empty!';

        const items = snap.docs.map((d, i) => {
            const it = d.data();
            const store = it.recommended_store ? ` (${it.recommended_store})` : '';
            const price = it.recommended_price ? ` — $${it.recommended_price}` : '';
            return `${i + 1}. ${it.product_name}${store}${price}`;
        });
        await db.collection('whatsapp_log').add({ from: fromNumber, message: messageText, intent: 'view_list', at: new Date() });
        return `🛒 *Shopping List* (${items.length} items):\n\n${items.join('\n')}`;
    }

    // ── 3. Tech Radar / News ─────────────────────────────────────────────
    if (/^(radar|news|what'?s new|latest|tech radar)$/i.test(text)) {
        const snap = await db.collection('tech_radar_items')
            .orderBy('scraped_at', 'desc')
            .limit(5)
            .get();

        if (snap.empty) return '📡 No radar articles yet. The agent scrapes daily — check back later!';

        const articles = snap.docs.map((d, i) => {
            const it = d.data();
            return `${i + 1}. *${it.title}*\n   ${it.summary || ''}\n   ${it.url || ''}`;
        });
        await db.collection('whatsapp_log').add({ from: fromNumber, message: messageText, intent: 'tech_radar', at: new Date() });
        return `📡 *Tech Radar — Latest*:\n\n${articles.join('\n\n')}`;
    }

    // ── 4. Skills list ────────────────────────────────────────────────────
    if (/^skills?$/i.test(text)) {
        const snap = await db.collection('skill_registry').get();
        const enabled = snap.docs.filter(d => d.data().enabled).map(d => `✅ ${d.data().name}`);
        const disabled = snap.docs.filter(d => !d.data().enabled).map(d => `⏸ ${d.data().name}`);
        const allLines = [...enabled, ...disabled].join('\n');
        return `⚙️ *GravityClaw Skills*:\n\n${allLines}\n\nSend "enable [skill-name]" or "disable [skill-name]" to toggle.`;
    }

    // ── 5. Enable / disable skill ─────────────────────────────────────────
    const enableMatch = text.match(/^(enable|disable)\s+(.+)$/i);
    if (enableMatch) {
        const action = enableMatch[1].toLowerCase() === 'enable';
        const skillName = enableMatch[2].trim();
        const skillRef = db.collection('skill_registry').doc(skillName);
        const skillDoc = await skillRef.get();
        if (!skillDoc.exists) return `❌ Skill "${skillName}" not found. Send "skills" to see all available skills.`;
        await skillRef.update({ enabled: action });
        return `${action ? '✅ Enabled' : '⏸ Disabled'} *${skillName}*.`;
    }

    // ── 6. Weekly summary trigger ─────────────────────────────────────────
    if (/^(summary|weekly|week summary|life summary)$/i.test(text)) {
        // Find and trigger the summary task
        const tasksSnap = await db.collection('agent_tasks').where('name', '==', 'Weekly Life Summary').limit(1).get();
        if (!tasksSnap.empty) {
            await tasksSnap.docs[0].ref.update({ next_run_at: new Date() });
            return '📊 Weekly Life Summary scheduled for next agent cycle (within 15 min). I\'ll process the results and you can view them in the app.';
        }
        return '⚠️ Weekly Summary task not found. Run /seedAgentTasks first.';
    }

    // ── 7. Finance vault query ────────────────────────────────────────────
    if (/^(vault|finance|documents?|tax)$/i.test(text)) {
        const snap = await db.collection('finance_documents').orderBy('uploaded_at', 'desc').limit(5).get();
        if (snap.empty) return '🏦 No documents in the vault yet. Upload a tax doc or bank statement in the app → Vault tab.';
        const docs = snap.docs.map((d, i) => {
            const it = d.data();
            return `${i + 1}. ${it.category} ${it.tax_year} — ${it.entity_name}`;
        });
        return `🏦 *Finance Vault* (recent ${docs.length}):\n\n${docs.join('\n')}`;
    }

    // ── 8. Help ───────────────────────────────────────────────────────────
    if (/^(help|\?)$/i.test(text)) {
        return `🤖 *GravityClaw Commands*:\n
🛒 *add [item]* — add to shopping list
🛒 *list* — view shopping list
📡 *radar* — latest tech news
⚙️ *skills* — view all skills
✅ *enable [skill]* — enable a skill
📊 *summary* — trigger weekly summary
🏦 *vault* — view finance docs
💬 *anything else* — ask Gemini!`;
    }

    // ── 9. Default: route to Gemini ───────────────────────────────────────
    if (!geminiKey) return '⚠️ Gemini not configured. Add GEMINI_KEY to functions/.env';

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemContext = `You are GravityClaw, a friendly personal AI assistant. You help with shopping, life insights, tech news, and productivity. Keep replies concise and formatted for WhatsApp (use *bold* sparingly, keep under 400 words).`;

    const result = await model.generateContent(`${systemContext}\n\nUser said: "${messageText}"`);
    const reply = result.response.text();

    await db.collection('whatsapp_log').add({ from: fromNumber, message: messageText, intent: 'gemini_query', reply, at: new Date() });
    return reply;
}

// ─── Main Webhook Export ──────────────────────────────────────────────────

exports.whatsappBot = onRequest(async (req, res) => {
    const db = admin.firestore();

    // ── GET: Meta webhook verification ───────────────────────────────────
    if (req.method === 'GET') {
        const mode      = req.query['hub.mode'];
        const token     = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];
        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'gravityclaw-secret';

        if (mode === 'subscribe' && token === verifyToken) {
            logger.info('[whatsapp] Webhook verified by Meta ✅');
            return res.status(200).send(challenge);
        }
        return res.sendStatus(403);
    }

    // ── POST: Incoming message ────────────────────────────────────────────
    if (req.method === 'POST') {
        try {
            const body = req.body;
            const entry = body?.entry?.[0];
            const changes = entry?.changes?.[0];
            const value = changes?.value;
            const messages = value?.messages;

            if (!messages || messages.length === 0) {
                return res.sendStatus(200); // Ack delivery receipts / status updates
            }

            for (const msg of messages) {
                if (msg.type !== 'text') continue; // Skip non-text for now

                const fromNumber = msg.from;
                const messageText = msg.text?.body || '';

                logger.info(`[whatsapp] Message from ${fromNumber}: "${messageText}"`);

                // Route and generate reply
                const reply = await routeIntent(db, fromNumber, messageText);

                // Send reply back
                await sendWhatsAppMessage(fromNumber, reply);
                logger.info(`[whatsapp] Replied to ${fromNumber}`);
            }

            return res.sendStatus(200);
        } catch (err) {
            logger.error('[whatsapp] Error processing message:', err);
            return res.sendStatus(200); // Always ack to Meta even on error
        }
    }

    res.sendStatus(405);
});
