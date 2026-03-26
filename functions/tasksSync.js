const functions = require('firebase-functions');
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');

if (!admin.apps.length) admin.initializeApp();

/**
 * Tasks Sync logic:
 * Periodically pulls new tasks from Google Tasks and syncs them to Supabase/Firestore.
 */

// Helper to get Supabase client safely
function getSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL || functions.config().supabase?.url;
    const supabaseKey = process.env.SUPABASE_KEY || functions.config().supabase?.key;

    if (!supabaseUrl || !supabaseKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseKey);
}

async function getAuthenticatedClient() {
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN || functions.config().google?.refresh_token;
    const client_id = process.env.GOOGLE_CLIENT_ID || functions.config().google?.client_id;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET || functions.config().google?.client_secret;

    if (!refresh_token || !client_id || !client_secret) {
        functions.logger.warn("Google credentials missing. Sync aborted.");
        return null;
    }

    try {
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
        oAuth2Client.setCredentials({ refresh_token });
        return oAuth2Client;
    } catch (e) {
        functions.logger.error("Failed to initialize Google Auth client", e);
        return null;
    }
}

exports.syncGoogleTasks = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
    const auth = await getAuthenticatedClient();
    if (!auth) return null;

    const supabase = getSupabase();
    if (!supabase) {
        functions.logger.warn("Supabase not configured. Sync skipped.");
        return null;
    }

    const service = google.tasks({ version: 'v1', auth });

    try {
        // 1. Get Task Lists
        const taskListsRes = await service.tasklists.list();
        const taskLists = taskListsRes.data.items || [];
        const shopList = taskLists.find(l =>
            l.title.toLowerCase().includes('shopping') ||
            l.title.toLowerCase().includes('grocery') ||
            l.title.toLowerCase().includes('gravityhub')
        );

        if (!shopList) {
            functions.logger.info("No targeting 'Shopping' list found in Google Tasks.");
            return null;
        }

        // 2. Get Tasks
        const tasksRes = await service.tasks.list({
            tasklist: shopList.id,
            showCompleted: false
        });
        const tasks = tasksRes.data.items || [];

        if (tasks.length === 0) return null;

        functions.logger.info(`Syncing ${tasks.length} items from Google Tasks...`);

        // 3. Process New Tasks
        for (const task of tasks) {
            const itemName = task.title;
            if (!itemName) continue;

            functions.logger.info(`Syncing item: ${itemName}`);

            // Add to Supabase
            const { error: sbError } = await supabase
                .from('shopping_list')
                .insert([{
                    product_name: itemName,
                    status: 'pending',
                    added_via: 'google_tasks_sync',
                    added_at: new Date().toISOString()
                }]);

            if (!sbError) {
                // Also add to Firestore to keep both in sync (if applicable)
                try {
                    await admin.firestore().collection('shopping_list').add({
                        product_name: itemName,
                        status: 'pending',
                        source: 'google_tasks',
                        added_at: new Date().toISOString()
                    });
                } catch (fe) {
                    functions.logger.error("Firestore sync error", fe);
                }

                // 4. Mark as Done in Google
                await service.tasks.update({
                    tasklist: shopList.id,
                    task: task.id,
                    requestBody: {
                        id: task.id,
                        status: 'completed'
                    }
                });
            } else {
                functions.logger.error("Supabase insert error", sbError);
            }
        }

    } catch (error) {
        functions.logger.error("Google Tasks Sync Error:", error);
    }
    return null;
});

// Manual Trigger for Testing
exports.triggerSync = functions.https.onRequest(async (req, res) => {
    functions.logger.info("Manual sync trigger received.");
    // In a real trigger, we'd invoke the logic above. 
    // For now, response is enough since it's on a 5-min schedule.
    res.send("Sync is active on a 5-minute schedule. Check logs for progress.");
});
