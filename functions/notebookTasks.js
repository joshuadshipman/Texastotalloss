const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { execSync } = require('child_process');

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * List all available Notebooks using the local CLI
 */
exports.listNotebooks = functions.https.onCall(async (data, context) => {
    try {
        const cmd = 'C:\\Users\\17549\\AppData\\Local\\Python\\pythoncore-3.14-64\\Scripts\\notebooklm.exe list --json';
        const result = execSync(cmd, { encoding: 'utf-8' });
        const notebooks = JSON.parse(result.trim());
        return { success: true, data: notebooks };
    } catch (error) {
        functions.logger.error("Failed to list notebooks:", error);
        throw new functions.https.HttpsError('internal', 'Unable to list notebooks via CLI: ' + error.message);
    }
});

/**
 * Submit a request to generate multiple artifacts for a notebook
 */
exports.requestGeneration = functions.https.onCall(async (data, context) => {
    const { notebookId, formats, customDirections } = data;

    if (!notebookId || !formats || !Array.isArray(formats) || formats.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Must provide notebookId and an array of formats to generate.');
    }

    const db = admin.firestore();
    try {
        const newTaskRef = db.collection('notebook_tasks').doc();
        await newTaskRef.set({
            notebook_id: notebookId,
            formats: formats, // e.g., ['report', 'infographic', 'slide_deck']
            custom_directions: customDirections || '',
            status: 'pending',
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            artifacts: []
        });

        return { success: true, task_id: newTaskRef.id };
    } catch (error) {
        functions.logger.error("Failed to enqueue notebook generation task:", error);
        throw new functions.https.HttpsError('internal', 'Unable to create generation task.');
    }
});
