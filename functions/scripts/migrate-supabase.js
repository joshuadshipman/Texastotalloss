require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const admin = require('firebase-admin');

// Ensure firebase-admin is initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateShoppingList() {
    console.log("Starting Migration from Supabase to Firestore...");
    try {
        const { data: items, error } = await supabase
            .from('shopping_list')
            .select('*');

        if (error) throw error;
        
        console.log(`Found ${items.length} items in Supabase.`);

        const batch = db.batch();
        const collectionRef = db.collection('shopping_list');

        let count = 0;
        for (const item of items) {
            // Use Supabase's PK as the Firestore Doc ID if practical, or let Firestore generate it
            const docRef = item.list_item_id ? collectionRef.doc(item.list_item_id) : collectionRef.doc();
            
            // Convert timestamps if necessary, but writing ISO strings is usually fine for a direct sync
            // Firestore handles Objects naturally.
            batch.set(docRef, item);
            count++;

            // Firestore batches max out at 500
            if (count % 400 === 0) {
                await batch.commit();
                console.log(`Committed ${count} items...`);
            }
        }

        if (count % 400 !== 0) {
            await batch.commit();
        }

        console.log(`Migration Complete! Successfully copied ${count} records to Firestore.`);
    } catch (e) {
        console.error("Migration Error:", e);
    }
}

migrateShoppingList();
