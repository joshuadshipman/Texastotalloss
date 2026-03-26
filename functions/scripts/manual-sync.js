const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Root env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Functions env
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getAuthenticatedClient() {
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    if (!refresh_token) {
        console.error("❌ No GOOGLE_REFRESH_TOKEN found in .env");
        return null;
    }

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);
    oAuth2Client.setCredentials({ refresh_token });
    return oAuth2Client;
}

async function runSync() {
    console.log("🔄 Starting Manual Sync...");

    const auth = await getAuthenticatedClient();
    if (!auth) return;

    const service = google.tasks({ version: 'v1', auth });

    try {
        // 1. Get Task Lists
        const { data: { items: taskLists } } = await service.tasklists.list();
        if (!taskLists) {
            console.log("❌ No task lists found.");
            return;
        }

        const shopList = taskLists.find(l => l.title.toLowerCase().includes('shopping') || l.title.toLowerCase().includes('grocery') || l.title.toLowerCase().includes('my tasks'));

        if (!shopList) {
            console.log("⚠️  Could not find a 'Shopping List' or 'My Tasks'. Available lists:", taskLists.map(l => l.title).join(', '));
            return;
        }
        console.log(`✅ Found List: "${shopList.title}"`);

        // 2. Get Tasks
        const { data: { items: tasks } } = await service.tasks.list({
            tasklist: shopList.id,
            showCompleted: false
        });

        if (!tasks || tasks.length === 0) {
            console.log("ℹ️  List is empty. Nothing to sync.");
            return;
        }

        console.log(`📦 Found ${tasks.length} items to sync.`);

        // 3. Process New Tasks
        for (const task of tasks) {
            const itemName = task.title;
            console.log(`   ➜ Syncing item: ${itemName}...`);

            // Add to Supabase
            const { data, error } = await supabase
                .from('shopping_list')
                .insert([{
                    product_name: itemName,
                    status: 'analyzing',
                    added_via: 'voice_sync',
                    added_at: new Date().toISOString()
                }]);

            if (!error) {
                console.log("     ✅ Added to Database");
                // 4. Mark as Done in Google
                // await service.tasks.update({
                //   tasklist: shopList.id,
                //   task: task.id,
                //   requestBody: {
                //     id: task.id,
                //     status: 'completed'
                //   }
                // });
                // console.log("     ✅ Marked as done in Google Tasks");
            } else {
                console.error("     ❌ Database Error:", error.message);
            }
        }
        console.log("\n🎉 Sync Complete!");

    } catch (error) {
        console.error("❌ Sync Error:", error);
    }
}

runSync();
