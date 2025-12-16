import dialogflow from '@google-cloud/dialogflow';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

// Configuration
const PROJECT_ID = 'total-loss-intake-bot'; // Hardcoded based on user input
const KEY_FILE = path.join(process.cwd(), 'service-account.json');

const intentsClient = new dialogflow.IntentsClient({
  keyFilename: KEY_FILE,
});

const agentPath = intentsClient.projectAgentPath(PROJECT_ID);

interface IntentConfig {
  displayName: string;
  trainingPhrasesParts: string[];
  messageTexts: string[];
  inputContextNames?: string[];
  outputContexts?: { name: string, lifespan: number }[];
  parameters?: {
    displayName: string;
    entityTypeDisplayName: string;
    mandatory: boolean;
    value: string;
    prompts?: string[];
  }[];
}

// Intent Definitions
const intentsToCreate: IntentConfig[] = [
  {
    displayName: 'Default Welcome Intent',
    trainingPhrasesParts: ['Hi', 'Hello', 'Start', 'I have a total loss', 'Good morning', 'Help'],
    messageTexts: ['Welcome to the Total Loss Intake support. I can help you file a claim for your vehicle. First, can I get your full name?'],
    outputContexts: [{ name: 'awaiting_name', lifespan: 2 }]
  },
  {
    displayName: 'Collect Name',
    inputContextNames: ['awaiting_name'],
    trainingPhrasesParts: ['My name is John Doe', 'Jane Smith', 'It is Alice'],
    parameters: [
      {
        displayName: 'given-name',
        entityTypeDisplayName: '@sys.person',
        mandatory: true,
        value: '$given-name',
        prompts: ['What is your name?']
      }
    ],
    messageTexts: ['Thanks $given-name. What is the make and model of your vehicle?'],
    outputContexts: [{ name: 'awaiting_vehicle', lifespan: 2 }]
  },
  {
    displayName: 'Collect Vehicle Info',
    inputContextNames: ['awaiting_vehicle'],
    trainingPhrasesParts: ['It\'s a Toyota Camry', '2020 Honda Civic', 'Ford F150', 'Tesla Model 3'],
    parameters: [
      {
        displayName: 'vehicle',
        entityTypeDisplayName: '@sys.any',
        mandatory: true,
        value: '$vehicle',
        prompts: ['Please tell me the year, make, and model.']
      }
    ],
    messageTexts: ['Got it. When did the accident happen?'],
    outputContexts: [{ name: 'awaiting_date', lifespan: 2 }]
  },
  {
    displayName: 'Collect Date',
    inputContextNames: ['awaiting_date'],
    trainingPhrasesParts: ['Yesterday', 'Last Monday', '2023-10-15', 'On Friday'],
    parameters: [
      {
        displayName: 'date',
        entityTypeDisplayName: '@sys.date',
        mandatory: true,
        value: '$date',
        prompts: ['When did this happen?']
      }
    ],
    messageTexts: ['I see. Briefly, what happened?'],
    outputContexts: [{ name: 'awaiting_description', lifespan: 2 }]
  },
  {
    displayName: 'Collect Description',
    inputContextNames: ['awaiting_description'],
    trainingPhrasesParts: ['I was rear-ended at a light', 'Hit a deer', 'Someone backed into me', 'I slid on ice'],
    parameters: [
        {
            displayName: 'description',
            entityTypeDisplayName: '@sys.any',
            mandatory: true,
            value: '$description',
            prompts: ['Please describe the incident.']
        }
    ],
    messageTexts: ['Okay. Were you or anyone else injured?'],
    outputContexts: [{ name: 'awaiting_injury_status', lifespan: 2 }]
  },
  {
    displayName: 'Collect Injury Status',
    inputContextNames: ['awaiting_injury_status'],
    trainingPhrasesParts: ['Yes', 'No', 'My neck hurts', 'Just minor cuts'],
    parameters: [
        {
            displayName: 'injury_status',
            entityTypeDisplayName: '@sys.any',
            mandatory: true,
            value: '$injury_status',
            prompts: ['Was anyone injured?']
        }
    ],
    messageTexts: ['Understood. Finally, what is the best phone number to reach you?'],
    outputContexts: [{ name: 'awaiting_phone', lifespan: 2 }]
  },
  {
    displayName: 'Collect Phone',
    inputContextNames: ['awaiting_phone'],
    trainingPhrasesParts: ['555-0123', '(555) 123-4567', 'My number is 123 456 7890'],
    parameters: [
        {
            displayName: 'phone-number',
            entityTypeDisplayName: '@sys.phone-number',
            mandatory: true,
            value: '$phone-number',
            prompts: ['What is your phone number?']
        }
    ],
    messageTexts: ['Thank you. An agent will review your details and contact you shortly. Is there anything else?'],
    outputContexts: [{ name: 'end_conversation', lifespan: 2 }]
  }
];

async function listIntents() {
  const [intents] = await intentsClient.listIntents({ parent: agentPath });
  return intents;
}

async function deleteIntent(name: string) {
    await intentsClient.deleteIntent({ name });
    console.log(`Deleted intent: ${name}`);
}

async function createIntent(config: IntentConfig) {
  const trainingPhrases = config.trainingPhrasesParts.map(part => ({
    type: 'EXAMPLE' as const,
    parts: [{ text: part }],
  }));

  const message = {
    text: {
      text: config.messageTexts,
    },
  };

  const parameters = config.parameters?.map(p => ({
    displayName: p.displayName,
    entityTypeDisplayName: p.entityTypeDisplayName,
    mandatory: p.mandatory,
    value: p.value,
    prompts: p.prompts,
  }));

  const inputContextNames = config.inputContextNames?.map(name => 
    `projects/${PROJECT_ID}/agent/sessions/-/contexts/${name}`
  );

  const outputContexts = config.outputContexts?.map(ctx => ({
    name: `projects/${PROJECT_ID}/agent/sessions/-/contexts/${ctx.name}`,
    lifespanCount: ctx.lifespan,
  }));

  const intent = {
    displayName: config.displayName,
    trainingPhrases: trainingPhrases,
    messages: [message],
    parameters: parameters,
    inputContextNames: inputContextNames,
    outputContexts: outputContexts,
  };

  // @ts-ignore
  const [response] = await intentsClient.createIntent({
    parent: agentPath,
    intent: intent,
  });

  console.log(`Created Intent: ${response.displayName}`);
}

async function run() {
  console.log(`Connecting to project: ${PROJECT_ID}`);
  
  try {
      const existingIntents = await listIntents();
      console.log(`Found ${existingIntents.length} existing intents.`);

      // Clean up existing intents with same names to avoid duplicates/conflicts
      for (const config of intentsToCreate) {
          const match = existingIntents.find(i => i.displayName === config.displayName);
          if (match && match.name) {
              await deleteIntent(match.name);
          }
      }

      // Create new intents
      for (const config of intentsToCreate) {
          await createIntent(config);
      }
      
      console.log('All intents configured successfully!');

  } catch (error) {
    console.error('Error configuring Dialogflow:', error);
  }
}

run();
