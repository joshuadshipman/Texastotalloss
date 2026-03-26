const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'shipman-shopping-app' });
}

const db = admin.firestore();

async function findUser() {
  console.log('Searching for users named JD or recent WhatsApp logs...');
  
  // Try whatsapp_log first
  const logsSnap = await db.collection('whatsapp_log').orderBy('at', 'desc').limit(5).get();
  if (!logsSnap.empty) {
    console.log('Recent WhatsApp Logs:');
    logsSnap.forEach(doc => {
      const data = doc.data();
      console.log(`From: ${data.from}, Message: ${data.message}, Date: ${data.at.toDate()}`);
    });
  } else {
    console.log('No WhatsApp logs found.');
  }

  // Try participants
  const partSnap = await db.collection('participants').where('name', '==', 'JD').get();
  if (!partSnap.empty) {
    console.log('Found participant JD:');
    partSnap.forEach(doc => {
      console.log(doc.id, doc.data());
    });
  } else {
    console.log('No participant named JD found.');
  }

  // Try system_config for user preferences
  const prefDoc = await db.collection('system_config').doc('user_preferences').get();
  if (prefDoc.exists) {
    console.log('User Preferences found.');
    // console.log(prefDoc.data());
  }
}

findUser().catch(console.error);
