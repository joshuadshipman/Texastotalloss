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

// Intent Definitions
const intentsToCreate: IntentConfig[] = [
  // --- FAQs ---
  {
    displayName: 'FAQ - Total Loss Meaning',
    trainingPhrasesParts: ['What does total loss mean', 'When is a car totaled', 'Definition of total loss'],
    messageTexts: ['A car is a total loss when repair costs exceed a set percentage of its value (ACV) or when repairs cost more than its value.']
  },
  {
    displayName: 'FAQ - Calculation Method',
    trainingPhrasesParts: ['How do they calculate value', 'How is total loss value determined', 'Value calculation'],
    messageTexts: ['Insurers start with replacement cost, then subtract depreciation based on age, mileage, condition, and market data. They look at local comparable sales, physical condition, and options to determine the final ACV.']
  },
  {
    displayName: 'FAQ - ACV Definition',
    trainingPhrasesParts: ['What is ACV', 'Actual Cash Value meaning', 'What is actual cash value'],
    messageTexts: ['ACV (Actual Cash Value) is your car’s market value right before the loss, not what you paid or what you owe. It is replacement cost minus depreciation, so it is usually lower than the purchase price.']
  },
  {
    displayName: 'FAQ - Low Payout',
    trainingPhrasesParts: ['Why is my offer so low', 'Payout seems low', 'Low total loss offer'],
    messageTexts: ['Offers can feel low when reports use "comparables" that are older, have higher mileage, or miss your specific options.']
  },
  {
    displayName: 'FAQ - Negotiate Offer',
    trainingPhrasesParts: ['Can I negotiate', 'Challenge the offer', 'Dispute total loss value'],
    messageTexts: ['Yes! You can challenge low valuations with better comparable sales, proof of options, maintenance records, and independent appraisals.']
  },
  {
    displayName: 'FAQ - Gap Insurance',
    trainingPhrasesParts: ['What is gap insurance', 'How does gap work', 'Gap coverage meaning'],
    messageTexts: ['Gap insurance covers the difference between your car’s ACV payout and what you still owe on your loan if it is totaled.']
  },
  {
    displayName: 'FAQ - Upside Down',
    trainingPhrasesParts: ['What means upside down', 'Negative equity', 'Upside down on loan'],
    messageTexts: ['Being upside down means you owe more on your auto loan than your car is worth based on its current market value.']
  },
  {
    displayName: 'FAQ - Gap Extra Money',
    trainingPhrasesParts: ['Do I get extra money from gap', 'Does gap pay me directly'],
    messageTexts: ['No. Gap coverage pays your lender the shortfall to clear the loan; you do not receive extra cash.']
  },
  {
    displayName: 'FAQ - Loan Without Gap',
    trainingPhrasesParts: ['Do I still pay loan without gap', 'No gap insurance loan balance'],
    messageTexts: ['Yes, without gap coverage you remain responsible for any remaining loan balance above the insurance payout.']
  },
  {
    displayName: 'FAQ - Check Gap Coverage',
    trainingPhrasesParts: ['Do I have gap', 'How to check for gap insurance'],
    messageTexts: ['Check your finance contract, lease agreement, or auto policy declarations page. It is often an add-on.']
  },
  {
    displayName: 'FAQ - Gap Importance',
    trainingPhrasesParts: ['Do I need gap', 'When is gap important'],
    messageTexts: ['Gap is critical if you have a small down payment, long loan term, or rolled over negative equity.']
  },
  {
    displayName: 'FAQ - Gap Deductibles',
    trainingPhrasesParts: ['Does gap cover deductible', 'Gap fees'],
    messageTexts: ['Many gap policies exclude deductibles and late fees, covering only the principal difference. Check your policy.']
  },
  {
    displayName: 'FAQ - Totaled But Drivable',
    trainingPhrasesParts: ['Car still drives is it totaled', 'Drivable total loss'],
    messageTexts: ['Yes, a vehicle is totaled based on repair math/financials, even if it is technically still drivable.']
  },
  {
    displayName: 'FAQ - Total Loss Threshold',
    trainingPhrasesParts: ['What is the threshold', 'Total loss formula'],
    messageTexts: ['States stick to a percentage of ACV (e.g., 75%) or a formula (Repair + Salvage > ACV) to decide when to total a car.']
  },
  {
    displayName: 'FAQ - Car After Total Loss',
    trainingPhrasesParts: ['What happen to car after total loss', 'Who keeps the car'],
    messageTexts: ['The insurer usually pays you the ACV and takes the car to sell for salvage.']
  },
  {
    displayName: 'FAQ - Injuries',
    trainingPhrasesParts: ['How do injuries affect claim', 'Injury settlement'],
    messageTexts: ['Property damage and injury are separate. Your injury settlement covers medical bills and pain/suffering, on top of the car value.']
  },
  {
    displayName: 'FAQ - One Vendor',
    trainingPhrasesParts: ['Only one valuation', 'CCC report accuracy'],
    messageTexts: ['Most carriers use one vendor (like CCC), but you can dispute errors and present your own market data.']
  },
  {
    displayName: 'FAQ - Evidence',
    trainingPhrasesParts: ['What evidence helps', 'Proof for higher value'],
    messageTexts: ['Local ads for similar cars, window stickers, receipts for upgrades/repairs, and maintenance records help boost value.']
  },
  {
    displayName: 'FAQ - Balance After Gap',
    trainingPhrasesParts: ['Still owe money after gap', 'Gap didnt pay everything'],
    messageTexts: ['If your gap policy has limits or exclusions, you might still owe a small balance.']
  },
  {
    displayName: 'FAQ - Accept First Offer',
    trainingPhrasesParts: ['Should I accept first offer', 'Take the first check'],
    messageTexts: ['Experts suggest reviewing the valuation detail first. If comparables look bad, negotiate before accepting.']
  },
  {
    displayName: 'FAQ - 2025 Trends',
    trainingPhrasesParts: ['What are the 2025 trends', 'Latest total loss stats', 'Is this common in 2025', 'Class action lawsuits'],
    messageTexts: ['In 2025, 27% of claims are total losses. Major insurers face lawsuits for using algorithms to artificially lower offers, and only 58% of customers feel their valuation was fair.']
  },
  {
    displayName: 'FAQ - What Not To Say',
    trainingPhrasesParts: ['What should I not say', 'What to avoid telling insurance', 'Things not to say to adjuster'],
    messageTexts: ['NEVER say "I\'m sorry", "I made a mistake", or "I\'m fine" (regarding injuries). Do not guess about details; say "I don\'t know" instead.']
  },
  {
    displayName: 'FAQ - Safe Phrases',
    trainingPhrasesParts: ['What are safe phrases', 'What should I say about injuries', 'Safe things to tell adjuster'],
    messageTexts: ['Use safe phrases like: "I am receiving medical evaluation and will rely on my records" or "It is too early to know the full extent."']
  },
  {
    displayName: 'FAQ - Recorded Statement',
    trainingPhrasesParts: ['Should I give a recorded statement', 'They asked for a recorded statement', 'Can they record me'],
    messageTexts: ['Do NOT agree to a recorded statement for the at-fault insurer without legal advice. Statements can be used to attack your credibility later.']
  },

  // --- Core Flow ---
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
