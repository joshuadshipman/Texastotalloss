'use strict';

const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

if (!admin.apps.length) admin.initializeApp();

/**
 * Seed endpoint to populate Home Projects and Plants
 */
exports.seedDashboard = onRequest(async (req, res) => {
    const db = admin.firestore();
    
    try {
        // 1. Seed Home Projects
        const projectRef = db.collection('home_projects');
        const p1 = await projectRef.add({
            name: 'Rebuild the Deck',
            status: 'in-progress',
            budget: 2500,
            notes: 'Need to buy pressure-treated lumber and deck screws.',
            photo_url: 'https://images.unsplash.com/photo-1590644365607-1c5a71df388b?auto=format&fit=crop&w=800&q=80',
            created_at: new Date().toISOString()
        });

        const p2 = await projectRef.add({
            name: 'Bathroom Tile Repair',
            status: 'planned',
            budget: 450,
            notes: 'Secondary bathroom, master shower corner.',
            created_at: new Date().toISOString()
        });

        // 2. Seed Plants
        const plantRef = db.collection('plants');
        await plantRef.add({
            nickname: 'Monty',
            species: 'Monstera Deliciosa',
            location: 'Living Room Corner',
            watering_days: 10,
            last_watered_at: admin.firestore.Timestamp.fromDate(new Date()),
            photo_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80'
        });

        await plantRef.add({
            nickname: 'Ivy League',
            species: 'English Ivy',
            location: 'Shelf',
            watering_days: 5,
            last_watered_at: admin.firestore.Timestamp.fromDate(new Date()),
            photo_url: 'https://images.unsplash.com/photo-1599591459483-333bc4df498d?auto=format&fit=crop&w=400&q=80'
        });

        // 3. Seed Notes (2nd Brain)
        const notesRef = db.collection('notes');
        await notesRef.add({
            title: 'Best Pasta in Austin',
            content: 'Olive & June - The Carbonara is authentic (no cream), and the patio is amazing for sunsets.',
            category: 'Restaurant',
            created_at: new Date().toISOString()
        });
        await notesRef.add({
            title: 'Gemini 1.5 Pro context limit',
            content: 'Supports up to 2 million tokens. Essential for parsing whole codebases without RAG lag.',
            category: 'Tech Research',
            created_at: new Date().toISOString()
        });

        // 4. Seed User Feedback/Complaints (for Research Agent)
        const userPrefsRef = db.collection('user_preferences');
        const userPrefsSnap = await userPrefsRef.limit(1).get();
        if (!userPrefsSnap.empty) {
            await userPrefsRef.doc(userPrefsSnap.docs[0].id).update({
                complaints: "I strongly dislike cheap plastic fixtures that break after a year. I prefer heavy-duty materials like solid wood, copper, or steel, even if they cost more. I value durability and premium feel over saving a few dollars."
            });
        }

        res.status(200).send({
            message: 'Dashboard seeded successfully!',
            projectsCreated: 2,
            plantsCreated: 2,
            notesCreated: 2,
            complaintsUpdated: true
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
