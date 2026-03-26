const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
} catch (e) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON from .env.local');
    process.exit(1);
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const VSF_DATA = [
    { id: '1', name: 'Dallas Auto Pound', city: 'Dallas', address: '1661 Robert B. Cullum Blvd, Dallas, TX 75210', phone: '(214) 670-5116', tdlr_license: '0012345VSF', daily_rate: 22.85 },
    { id: 'dal-001', name: 'Dallas Auto Pound', city: 'Dallas', address: '1661 Robert B. Cullum Blvd, Dallas, TX 75210', phone: '(214) 670-5116', tdlr_license: '0012345VSF', daily_rate: 22.85 },
    { id: 'hou-001', name: 'Houston Westside Impound', city: 'Houston', address: '123 Hammerly Blvd, Houston, TX 77043', phone: '(713) 555-0199', tdlr_license: '0067890VSF', daily_rate: 22.85 },
    { id: 'aus-001', name: 'Austin South Storage', city: 'Austin', address: '456 IH-35, Austin, TX 78744', phone: '(512) 555-0123', tdlr_license: '0098765VSF', daily_rate: 22.85 },
];

async function seedVsf() {
    console.log('Starting seed...');
    const batch = db.batch();
    const collectionRef = db.collection('vsf_locations');

    for (const loc of VSF_DATA) {
        const docRef = collectionRef.doc(loc.id);
        batch.set(docRef, loc, { merge: true });
        console.log(`Queued: ${loc.name}`);
    }

    await batch.commit();
    console.log('Seed completed successfully!');
    process.exit(0);
}

seedVsf().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
