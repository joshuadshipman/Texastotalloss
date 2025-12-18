import { AgentsClient } from '@google-cloud/dialogflow';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const PROJECT_ID = 'total-loss-intake-bot';
const KEY_FILE = path.join(process.cwd(), 'service-account.json');

const client = new AgentsClient({
    keyFilename: KEY_FILE,
});

async function createAgent() {
    try {
        const parent = `projects/${PROJECT_ID}`;
        console.log(`Connecting to ${parent}...`);

        // In Dialogflow ES, there is 1 agent per project.
        // 'setAgent' creates or updates the agent for the project.
        const [agent] = await client.setAgent({
            agent: {
                parent: parent,
                displayName: 'TotalLossBot',
                defaultLanguageCode: 'en',
                timeZone: 'America/Chicago',
            }
        });

        console.log('Agent initialized successfully!');
        console.log(`Name: ${agent.displayName}`);
        console.log(`Parent: ${agent.parent}`);

    } catch (error) {
        console.error('Failed to create/set agent. Details below:');
        console.error(error);
    }
}

createAgent();
