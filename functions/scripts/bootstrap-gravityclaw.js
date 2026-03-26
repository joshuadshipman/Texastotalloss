const admin = require('firebase-admin');

// Ensure we only initialize once
if (!admin.apps.length) {
    // If running via firebase emulators:exec or locally with GOOGLE_APPLICATION_CREDENTIALS
    // this will pick up the default credentials.
    admin.initializeApp();
}

const db = admin.firestore();

// Personal constraints and preferences from user prompt
const userPreferences = {
    automation_style: {
        cost_preference: "lowest_cost_first",
        code_preference: "no_code_low_code_preferred",
        autonomy: "high_autonomy_minimal_intervention"
    },
    shopping: {
        groceries: [
            "Lactose-free milk",
            "Extra sharp or sharp cheddar",
            "Coke over Pepsi",
            "Healthy and Non-Healthy Snacks"
        ],
        tech_gadgets: {
            research_international: true,
            validation_requirement: "Validate need to solve if unsure"
        },
        clothing: {
            favorite_brands: [
                "NoBull Polos (Currently ~10 in various colors)",
                "Jed North (Currently ~10 tank tops in various colors)",
                "Ten Thousand (Currently 5 pairs of Foundation Short 5\")",
                "Indochino Suits",
                "No Bull Workout Shoes (5 various pairs)",
                "Cole Hann Dress and Casual Shoes (6 pairs)"
            ],
            sizes: {
                height: "5'6\"",
                weight: "180lb",
                tops: ["Medium t-Shirts", "Large t-Shirts", "Large Stretch Polos"],
                jocks: ["XL", "XXL"],
                shoes_us_mens: 9,
                jeans: "varies by brand - ask" 
            }
        },
        health_supplements: [
            "Testosterone Cypionate 200mg/week",
            "Generic Vyanse 30mg",
            "Fiber Supplements",
            "Dyscovy",
            "Zinc Complex",
            "Lorazapam .5mg",
            "Men's Pre-workout High Stem (rotating by sale price)",
            "Morning greens/beets/vegetable blend supplement power"
        ]
    },
    llm_quota_strategy: {
        global_default: "gemini_1_5_flash_free",
        background_fallback: "deepseek_v3_coder",
        on_demand_research: "perplexity_api",
        gemini_soft_cap_percent: 70
    }
};

async function bootstrapGravityClaw() {
    console.log("🚀 Bootstrapping GravityClaw Firebase Architecture...");

    try {
        // 1. Write the User Preferences Singleton
        const prefsRef = db.collection('system_config').doc('user_preferences');
        await prefsRef.set(userPreferences, { merge: true });
        console.log("✅ Wrote user_preferences to system_config/user_preferences");

        // 2. Initialize the quota_state explicitly
        const quotaRef = db.collection('system_config').doc('quota_state');
        const quotaDoc = await quotaRef.get();
        if (!quotaDoc.exists) {
            await quotaRef.set({
                requests_today: 0,
                tokens_estimate_today: 0,
                last_reset: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log("✅ Initialized quota_state");
        }

        // 3. Touch dummy documents in new collections to ensure they exist in console
        const collectionsToInit = [
            'agent_tasks',
            'task_runs',
            'life_data',
            'content_sources',
            'learning_sessions',
            'food_ideas',
            'home_automation_scripts',
            'media_assets',
            'finance_documents'
        ];

        for (const col of collectionsToInit) {
            const initQuery = await db.collection(col).limit(1).get();
            if (initQuery.empty) {
                // write a placeholder
                await db.collection(col).doc('_init').set({ initialized_at: admin.firestore.FieldValue.serverTimestamp() });
                console.log(`✅ Scaffolding collection: ${col}`);
            } else {
                console.log(`ℹ️ Collection '${col}' already exists, skipping.`);
            }
        }

        console.log("🎉 GravityClaw Bootstrap Complete!");

    } catch (e) {
        console.error("❌ Failed to bootstrap:", e);
    }
}

bootstrapGravityClaw();
