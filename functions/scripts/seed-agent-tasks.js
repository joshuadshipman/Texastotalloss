require('dotenv').config();
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

const initialTasks = [
    {
        name: "Weekly Life Summary",
        task_type: "llm_analysis",
        prompt_template: "Review my life data log for the past 7 days. Give me a 1-paragraph summary of my mood, fitness, and any notable shopping habits. End with a motivational insight.",
        status: "active",
        interval_minutes: 10080, // 7 days
        explicit_model: "gemini_1_5_flash_free"
    },
    {
        name: "Account Creation Review",
        task_type: "llm_analysis",
        prompt_template: "Examine my recent emails/receipts for any newly created online accounts. List them out securely so I can review my digital footprint.",
        status: "active",
        interval_minutes: 1440, // 1 day
        explicit_model: "deepseek_v3_coder" // Cheap background
    },
    {
        name: "Resume Alignment Reminder",
        task_type: "llm_analysis",
        prompt_template: "Check my recent projects and NotebookLM learning topics. Suggest 2 bullet points I should add to my resume to reflect my continuous learning.",
        status: "active",
        interval_minutes: 43200, // 30 days
        explicit_model: "gemini_1_5_flash_free"
    },
    {
        name: "Daily Affirmation",
        task_type: "llm_analysis",
        prompt_template: "Generate a powerful, personalized 2-sentence daily affirmation for me based on my current health and shopping goals (e.g. eating healthy, working out).",
        status: "active",
        interval_minutes: 1440, // 1 day
        explicit_model: "gemini_1_5_flash_free"
    },
    {
        name: "Shopping Pending Review Check",
        task_type: "model_free_check",
        prompt_template: "System checking for items that need approval.",
        status: "active",
        interval_minutes: 60, // 1 hour
        explicit_model: null
    }
];

async function seedTasks() {
    console.log("Seeding initial Agent Tasks to Firestore...");
    try {
        const batch = db.batch();
        const collectionRef = db.collection('agent_tasks');

        for (const task of initialTasks) {
            const docRef = collectionRef.doc();
            batch.set(docRef, {
                ...task,
                last_run_at: null,
                next_run_at: admin.firestore.Timestamp.now(), // Run immediately
                created_at: admin.firestore.Timestamp.now()
            });
        }

        await batch.commit();
        console.log(`Successfully seeded ${initialTasks.length} agent tasks!`);
    } catch (e) {
        console.error("Error seeding tasks:", e);
    }
}

seedTasks();
