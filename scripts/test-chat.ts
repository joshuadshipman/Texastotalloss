import dialogflow from '@google-cloud/dialogflow';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = 'total-loss-intake-bot';
const KEY_FILE = path.join(process.cwd(), 'service-account.json');

const sessionClient = new dialogflow.SessionsClient({
    keyFilename: KEY_FILE,
});

async function runTest(testName: string, messages: string[]) {
    const sessionId = uuidv4();
    const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, sessionId);

    console.log(`\n--- Test: ${testName} (Session: ${sessionId.substring(0, 8)}) ---`);

    for (const text of messages) {
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en-US',
                },
            },
        };

        try {
            const responses = await sessionClient.detectIntent(request);
            const result = responses[0].queryResult;

            console.log(`User: "${text}"`);
            console.log(`Bot:  "${result?.fulfillmentText}"`);
            console.log(`Intent: [${result?.intent?.displayName}]`);
            console.log('---');

        } catch (err) {
            console.error('Error:', err);
        }
    }
}

async function runAllTests() {
    await runTest('Core Intake Flow', [
        'Hi',
        'John Doe',
        '2022 Ford F150',
        'Yesterday',
        'I was rear ended at a light',
        'Yes my neck hurts',
        '555-123-4567'
    ]);

    await runTest('Value Dispute (Devaluation)', [
        'Why is my offer so low?',
        'The comparables they used are trash',
        'They are charging me for betterment on tires',
        'How does the appraisal clause work?'
    ]);

    await runTest('Liability & Fault', [
        'I got rear ended who is at fault?',
        'I was turning left and got hit',
        'Someone backed into me in a parking lot'
    ]);

    await runTest('Adjuster Script (Rights)', [
        'Are you recording this call?',
        'What is your settlement authority?',
        'Do you accept liability?'
    ]);

    await runTest('Mitigation & Storage', [
        'Who pays for storage fees?',
        'Should I move my car?',
        'I refused the ambulance am I screwed?'
    ]);
}

runAllTests();
