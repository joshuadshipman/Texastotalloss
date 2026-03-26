'use strict';
/**
 * GravityHub — Google Home Webhook
 * 
 * Receives commands from Google Home Routines (webhook action).
 * Supports the same intents as the WhatsApp bot.
 * 
 * Setup:
 *   1. Google Home app → Automations → New Routine
 *   2. Starter: Voice command e.g. "add [item] to my list"
 *   3. Action: Webhook → POST to this function URL
 *   4. Body: { "command": "$TriggerPhrase" }  (use Google's variable token)
 * 
 * Firebase Function URL (after deploy):
 *   https://us-central1-shipman-shopping-app.cloudfunctions.net/googleHomeWebhook
 */

const { onRequest } = require('firebase-functions/v2/https');
const { logger } = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) admin.initializeApp();

// Simple keyword intent extractor
function parseIntent(text = '') {
    const t = text.toLowerCase().trim();
    
    // "add [item] to my list" / "add [item]"
    const addMatch = t.match(/(?:add|put|place)\s+(.+?)(?:\s+(?:to|on|in)\s+(?:my\s+)?(?:list|cart|shopping))?$/i);
    if (addMatch) return { intent: 'add_item', item: addMatch[1].replace(/\bto (my )?(list|cart|shopping list)\b/i,'').trim() };

    if (/(?:show|read|what(?:'?s)?\s+on)\s+(?:my\s+)?(?:list|cart|shopping)/i.test(t))
        return { intent: 'read_list' };

    if (/(?:radar|news|tech|latest)/i.test(t))
        return { intent: 'radar' };

    if (/(?:summary|week|insights)/i.test(t))
        return { intent: 'summary' };

    return { intent: 'unknown', raw: text };
}

exports.googleHomeWebhook = onRequest(async (req, res) => {
    const db = admin.firestore();

    // Accept GET pings (for webhook verification)
    if (req.method === 'GET') {
        return res.status(200).json({ status: 'ok', service: 'GravityHub' });
    }

    if (req.method !== 'POST') return res.sendStatus(405);

    try {
        // Google Home sends the trigger phrase in several possible keys
        const body = req.body || {};
        const command = body.command || body.text || body.query || body.phrase || '';
        
        logger.info('[googleHome] Received command:', command);
        
        if (!command) {
            return res.status(400).json({ error: 'No command provided', hint: 'Send { "command": "your voice phrase" }' });
        }

        const { intent, item, raw } = parseIntent(command);
        let responseText = '';

        switch (intent) {
            case 'add_item': {
                if (!item) {
                    responseText = "I couldn't figure out what to add. Try saying: add milk to my list.";
                    break;
                }
                await db.collection('shopping_list').add({
                    product_name: item,
                    quantity: 1,
                    status: 'pending',
                    source: 'google_home',
                    added_at: new Date().toISOString()
                });
                responseText = `Got it! I've added ${item} to your shopping list.`;
                logger.info(`[googleHome] Added "${item}" to shopping list`);
                break;
            }

            case 'read_list': {
                const snap = await db.collection('shopping_list')
                    .where('status', 'in', ['pending', 'pending_user_review'])
                    .orderBy('added_at', 'desc')
                    .limit(10)
                    .get();
                
                if (snap.empty) {
                    responseText = 'Your shopping list is empty.';
                } else {
                    const names = snap.docs.map(d => d.data().product_name);
                    responseText = `You have ${names.length} items: ${names.join(', ')}.`;
                }
                break;
            }

            case 'radar': {
                const snap = await db.collection('tech_radar_items')
                    .orderBy('scraped_at', 'desc')
                    .limit(3)
                    .get();
                
                if (snap.empty) {
                    responseText = 'No tech radar articles yet. The agent scrapes daily.';
                } else {
                    const titles = snap.docs.map(d => d.data().title);
                    responseText = `Latest from your tech radar: ${titles.join('. ')}`;
                }
                break;
            }

            case 'summary': {
                const tasksSnap = await db.collection('agent_tasks')
                    .where('name', '==', 'Weekly Life Summary').limit(1).get();
                if (!tasksSnap.empty) {
                    await tasksSnap.docs[0].ref.update({ next_run_at: new Date() });
                    responseText = 'Weekly summary is on its way. Check the GravityHub app in a few minutes.';
                } else {
                    responseText = 'Weekly summary task not found. Check the GravityHub app.';
                }
                break;
            }

            default: {
                // Log unknown commands for learning
                await db.collection('google_home_log').add({ 
                    command, intent: 'unknown', at: new Date() 
                });
                responseText = `I heard you say: "${command}". I'm not sure how to handle that yet. Try: "add milk to my list" or "read my shopping list".`;
            }
        }

        return res.status(200).json({
            fulfillmentText: responseText,
            speech: responseText,
            displayText: responseText
        });

    } catch (err) {
        logger.error('[googleHome] Error:', err);
        return res.status(200).json({
            fulfillmentText: 'Something went wrong. Please try again.',
            speech: 'Something went wrong. Please try again.'
        });
    }
});
