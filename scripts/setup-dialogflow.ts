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
  trainingPhrasesParts?: string[];
  trainingPhrases?: { parts: { text: string; alias?: string; entityType?: string }[] }[];
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
    messageTexts: ['Texas uses a 100% Threshold. The car is totaled if (Repair Cost + Salvage Value) is greater than or equal to the Actual Cash Value. This is stricter than many other states.']
  },
  {
    displayName: 'FAQ - Car After Total Loss',
    trainingPhrasesParts: ['What happen to car after total loss', 'Who keeps the car'],
    messageTexts: ['Usually, the insurer takes the car. BUT you can choose to keep it ("Owner Retention"). If you do, they deduct the Salvage Value from your payout, and you get a Salvage Title.']
  },
  // --- Liability & Fault ---
  {
    displayName: 'FAQ - Rear End Fault',
    trainingPhrasesParts: ['Who is at fault in rear end', 'I got rear ended', 'Is the person behind always at fault'],
    messageTexts: ['In a rear-end collision, the following driver is almost always at fault for following too closely or speeding. Exceptions exist (sudden reverse, cut-off), but they are rare.']
  },
  {
    displayName: 'FAQ - Left Turn Fault',
    trainingPhrasesParts: ['Left turn accident fault', 'T-boned at intersection', 'Who yields on left turn'],
    messageTexts: ['The driver turning left typically must yield to oncoming traffic. They are usually at fault unless the other driver ran a red light or was speeding significantly.']
  },
  {
    displayName: 'FAQ - Sideswipe Fault',
    trainingPhrasesParts: ['Sideswipe fault', 'He merged into me', 'Lane change accident'],
    messageTexts: ['The driver who leaves their lane (changing lanes, merging, drifting) is primarily at fault. Look for scrape marks to prove who crossed the line.']
  },
  {
    displayName: 'FAQ - Head On Fault',
    trainingPhrasesParts: ['Head on collision fault', 'Crossed center line'],
    messageTexts: ['The driver who leaves their lane into oncoming traffic is at fault. This is often due to distraction, fatigue, or impairment.']
  },
  {
    displayName: 'FAQ - Backing Fault',
    trainingPhrasesParts: ['Backing up accident', 'Parking lot accident'],
    messageTexts: ['The driver backing up has the duty to ensure the path is clear. If you are moving forward and they back into you, they are usually at fault.']
  },
  {
    displayName: 'FAQ - Determining Fault',
    trainingPhrasesParts: ['How do I prove fault', 'Impact points', 'Read damage'],
    messageTexts: ['Impact points tell the story. Rear damage = rear ended. Side/Door damage = T-bone. Scrapes = sideswipe. Document WHERE the cars hit to prove who moved into whom.']
  },

  // --- Devaluation Tactics ---
  {
    displayName: 'FAQ - Low ACV',
    trainingPhrasesParts: ['Why is my offer so low', 'My payout is too small', 'They lowballed me'],
    messageTexts: ['Insurers often start low by using "comparables" that are older or higher mileage than yours. They also deduct for "typical wear" without inspecting. Challenge every line item.']
  },
  {
    displayName: 'FAQ - Bad Comps',
    trainingPhrasesParts: ['These cars are not like mine', 'Wrong trim level', 'Bad comparables'],
    messageTexts: ['Vendors often pick cars from cheaper areas or lower trims. Demand they use locals cars with YOUR exact options. You can reject bad comps.']
  },
  {
    displayName: 'FAQ - Condition Adjustment',
    trainingPhrasesParts: ['Condition adjustment', 'Deduction for wear', 'They said my car is average'],
    messageTexts: ['Insurers deduct $500+ for "condition" on every comp to lower value. If your car was clean, send photos and maintenance records to prove it deserves a "Dealer Retail" rating.']
  },
  {
    displayName: 'FAQ - UPD',
    trainingPhrasesParts: ['Unrelated prior damage', 'UPD deduction', 'Old dent deduction'],
    messageTexts: ['UPD stands for Unrelated Prior Damage. They can deduct for old damage, BUT they cannot double-dip by deducting for condition AND UPD for the same thing.']
  },
  {
    displayName: 'FAQ - Betterment',
    trainingPhrasesParts: ['What is betterment', 'Why am I paying for tires', 'Betterment charge'],
    messageTexts: ['Betterment means you pay a share of new parts (like tires) because the new part makes your car "better" than before. Fight this by demanding proof of your old part\'s condition.']
  },
  {
    displayName: 'FAQ - Double Dipping',
    trainingPhrasesParts: ['Double dipping', 'Charged twice for damage'],
    messageTexts: ['"Double Dipping" is when they lower your Condition score AND charge a UPD fee for the same scratch. This is wrong. Point it out and demand one be removed.']
  },
  {
    displayName: 'FAQ - Appraisal Clause',
    trainingPhrasesParts: ['Should I hire an appraiser', 'Appraisal clause', 'Independent appraisal'],
    messageTexts: ['If you are stuck, the "Appraisal Clause" lets you hire your own appraiser. In Texas, this often results in significantly higher payouts (avg +$3,500), but costs you upfront fees.']
  },

  {
    displayName: 'FAQ - Injury Definition',
    trainingPhrasesParts: ['What counts as an injury', 'Is soreness an injury', 'Do I have an injury claim'],
    messageTexts: ['In Texas, "bodily injury" includes ANY physical pain (even soreness or stiffness) if it is documented by a doctor. If you are hurting, get it checked out—it counts.']
  },
  {
    displayName: 'FAQ - Pain and Suffering',
    trainingPhrasesParts: ['What is pain and suffering', 'Does whiplash count', 'Can I get paid for stress'],
    messageTexts: ['Texas law allows compensation for physical pain, mental anguish, and loss of enjoyment. Even soft-tissue injuries like whiplash qualify if documented. It involves more than just medical bills.']
  },
  {
    displayName: 'FAQ - Injuries',
    trainingPhrasesParts: ['How do injuries affect claim', 'Injury settlement'],
    messageTexts: ['Property damage and injury claims are SEPARATE. The insurer will NOT pay more for your car just because you are hurt. Do not expect injury money to fix your car loan gap.']
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
  {
    displayName: 'Valuation Request',
    trainingPhrasesParts: ['How much is my car worth', 'Get valuation', 'Check value', 'What is the value'],
    messageTexts: ['I can help with that. Please enter your VIN (Vehicle Identification Number) so I can pull the exact specs.'],
    outputContexts: [{ name: 'awaiting_vin', lifespan: 2 }]
  },
  {
    displayName: 'Receive VIN',
    inputContextNames: ['awaiting_vin'],
    trainingPhrasesParts: ['My VIN is 1HGCM...', 'VIN: 1G1...'],
    parameters: [
      {
        displayName: 'vin',
        entityTypeDisplayName: '@sys.any',
        mandatory: true,
        value: '$vin',
        prompts: ['Please enter the VIN.']
      }
    ],
    messageTexts: ['Thanks. To get the most accurate valuation, please upload photos of the vehicle (Front, Back, Side, Interior). You can attach them here.'],
    outputContexts: [{ name: 'awaiting_photos', lifespan: 2 }]
  },

  // --- Insurance & Coverage Guide (New) ---
  {
    displayName: 'FAQ - Low/No Insurance',
    trainingPhrasesParts: ['They have no insurance', 'Driver is uninsured', 'What if they have no money', 'Limits exhausted'],
    messageTexts: ['If they have no insurance or low limits, they are still liable, but collecting is hard. Using your own UMPD/Collision coverage is often the fastest route to get paid.']
  },
  {
    displayName: 'FAQ - UMPD Coverage',
    trainingPhrasesParts: ['What is UMPD', 'Do I have UMPD', 'Uninsured motorist property damage'],
    messageTexts: ['UMPD (Uninsured/Underinsured Motorist Property Damage) pays for your car repairs or total loss when the at-fault driver cannot pay. It usually has a lower deductible than Collision.']
  },
  {
    displayName: 'FAQ - Gap Coverage Explained',
    trainingPhrasesParts: ['Will gap pay my loan', 'I have gap insurance', 'Does insurance pay off my car'],
    messageTexts: ['Standard insurance only pays the cars current value (ACV). GAP insurance pays the difference between that value and what you still owe on your loan. Without GAP, you owe the difference.']
  },
  {
    displayName: 'FAQ - Payout Process',
    trainingPhrasesParts: ['How is payout calculated', 'When do I get paid', 'Who gets the money'],
    messageTexts: ['The payout is: (Actual Cash Value) minus (Deductible). This amount goes to your lienholder first to pay off the car. Any remainder comes to you.']
  },
  {
    displayName: 'FAQ - Action Steps',
    trainingPhrasesParts: ['What should I do next', 'Steps to take', 'Help me start'],
    messageTexts: ['1. Get their "no coverage" status in writing. 2. Check your policy for UMPD/Collision. 3. Gather your loan info. 4. Do NOT give a recorded statement yet.']
  },



  // --- Storage & Mitigation (New) ---
  {
    displayName: 'FAQ - Storage Fees',
    trainingPhrasesParts: ['Who pays storage fees', 'Tow yard fees', 'Daily charges', 'Cost per day'],
    messageTexts: ['Tow yards charge $20-$100/day. You must move the car ASAP. If you leave it there, the insurer may refuse to pay these "avoidable" fees.']
  },
  {
    displayName: 'FAQ - Duty to Mitigate',
    trainingPhrasesParts: ['What is duty to mitigate', 'Do I have to move my car', 'Why move the car'],
    messageTexts: ['"Duty to Mitigate" means you are legally required to minimize costs. Leaving a car in a paid lot violates this, and you will likely get stuck with the bill.']
  },
  {
    displayName: 'FAQ - Move Vehicle',
    trainingPhrasesParts: ['Should I let them move my car', 'Move to salvage yard', 'Permission to move'],
    messageTexts: ['YES. Give the insurer permission to move the car to a fee-free lot immediately. This stops the daily fees and preserves your payout.']
  },

  // --- Adjuster Script Intents ---
  {
    displayName: 'FAQ - Adjuster Recording',
    trainingPhrasesParts: ['Are you recording me', 'Can I record the call', 'Is this line recorded'],
    messageTexts: ['Always ask "Are you recording this call?". If yes, you should be very careful or refuse. You have the right to not be recorded without counsel.']
  },
  {
    displayName: 'FAQ - Adjuster Authority',
    trainingPhrasesParts: ['What is your authority', 'Are you the manager', 'Can you settle this'],
    messageTexts: ['Ask "What is your role and settlement authority?". You need to know if you are talking to a decision-maker or just a screener.']
  },
  {
    displayName: 'FAQ - Liability Investigation',
    trainingPhrasesParts: ['Is the investigation done', 'Who is at fault', 'Do you accept liability'],
    messageTexts: ['Ask "Have you completed your liability investigation?". Push for a "Yes" or "No". If they say "under review", they are stalling.']
  },
  {
    displayName: 'FAQ - Policy Limits',
    trainingPhrasesParts: ['What are the limits', 'Policy maximum', 'How much coverage'],
    messageTexts: ['Ask "What are the bodily injury and property damage limits?". You must know the cap to value your case correctly.']
  },
  {
    displayName: 'FAQ - Written Position',
    trainingPhrasesParts: ['Put it in writing', 'Send me a letter', 'Email that to me'],
    messageTexts: ['Always ask "Can you put that position in writing?". Whether they admit or deny fault, a written record is your best weapon.']
  },

  // --- Accident Checklist ---
  {
    displayName: 'FAQ - Accident Checklist',
    trainingPhrasesParts: ['I just crashed what do I do', 'Accident checklist', 'Steps after accident', 'Just got in a wreck'],
    messageTexts: ['Stay calm. 1. Ensure safety/Call 911. 2. Do NOT admit fault. 3. Get photos & witness info. 4. Go to the ER if you feel ANY pain. Check the site for our full 10-step guide.']
  },

  // --- Mitigation & Refusal (New) ---
  {
    displayName: 'FAQ - Medical Mitigation',
    trainingPhrasesParts: ['Should I go to the doctor', 'Toughing it out', 'I feel okay', 'Do I need a doctor'],
    messageTexts: ['Go to a doctor within 72 hours. "Toughing it out" creates gaps in care that insurers use to claim you weren\'t really hurt.']
  },
  {
    displayName: 'FAQ - Refusing Treatment',
    trainingPhrasesParts: ['I refused the ambulance', 'I didn\'t go to the hospital', 'Can I refuse treatment', 'I said I was fine'],
    messageTexts: ['Refusing treatment at the scene is okay, BUT you must see a doctor immediately afterwards. If you never go, the defense will argue your injuries aren\'t related to the crash.']
  },
  {
    displayName: 'FAQ - 51 Percent Rule',
    trainingPhrasesParts: ['What is the 51 percent rule', 'Comparative fault', 'Shared blame', 'My fault'],
    messageTexts: ['Texas uses a 51% Bar Rule. If you are found 51% or more responsible for your own damages (like by ignoring medical advice), you get $0. Don\'t give them a reason to shift blame.']
  },
  {
    displayName: 'FAQ - Property Mitigation',
    trainingPhrasesParts: ['Broken window', 'Rain damage', 'Prevent more damage', 'Loose bumper'],
    messageTexts: ['You must take "reasonable steps" to prevent further damage, like covering a broken window. Keep receipts for materials—they are reimbursable.']
  },

  {
    displayName: 'Default Welcome Intent',
    trainingPhrasesParts: ['Hi', 'Hello', 'Start', 'I have a total loss', 'Good morning', 'Help'],
    messageTexts: ['Welcome to the Total Loss Intake support. I can help you file a claim for your vehicle. First, can I get your full name?'],
    outputContexts: [{ name: 'awaiting_name', lifespan: 2 }]
  },
  {
    displayName: 'Collect Name',
    inputContextNames: ['awaiting_name'],
    // Annotated phrases so Dialogflow knows WHERE the name is
    trainingPhrases: [
      { parts: [{ text: 'My name is ' }, { text: 'John Doe', alias: 'given-name', entityType: '@sys.person' }] },
      { parts: [{ text: 'It is ' }, { text: 'Jane', alias: 'given-name', entityType: '@sys.person' }] },
      { parts: [{ text: 'Bob Smith', alias: 'given-name', entityType: '@sys.person' }] }
    ],
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
    trainingPhrases: [
      { parts: [{ text: 'It\'s a ' }, { text: 'Toyota Camry', alias: 'vehicle', entityType: '@sys.any' }] },
      { parts: [{ text: '2020 Honda Civic', alias: 'vehicle', entityType: '@sys.any' }] },
      { parts: [{ text: 'Ford F150', alias: 'vehicle', entityType: '@sys.any' }] }
    ],
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
    trainingPhrases: [
      { parts: [{ text: 'It happened ' }, { text: 'Yesterday', alias: 'date', entityType: '@sys.date' }] },
      { parts: [{ text: 'Last Monday', alias: 'date', entityType: '@sys.date' }] },
      { parts: [{ text: '2023-10-15', alias: 'date', entityType: '@sys.date' }] }
    ],
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
    // Use sys.any without annotation for description, as it acts as a "catch all" usually.
    // Or just make it mandatory so it grabs the whole input if not matched?
    // Actually for 'sys.any' description, often best to just rely on "whole payload" or make it mandatory.
    // Let's use generic parts for now, but we'll relax mandatory if needed.
    // Actually, let's keep it simple.
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
    // We want to detect Yes/No/Maybe etc.
    trainingPhrases: [
      { parts: [{ text: 'Yes', alias: 'injury_status', entityType: '@sys.any' }] },
      { parts: [{ text: 'No', alias: 'injury_status', entityType: '@sys.any' }] },
      { parts: [{ text: 'My neck hurts', alias: 'injury_status', entityType: '@sys.any' }] }
    ],
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
    trainingPhrases: [
      { parts: [{ text: '555-0123', alias: 'phone-number', entityType: '@sys.phone-number' }] },
      { parts: [{ text: 'My number is ' }, { text: '123-456-7890', alias: 'phone-number', entityType: '@sys.phone-number' }] }
    ],
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
  let trainingPhrases;

  if (config.trainingPhrases) {
    trainingPhrases = config.trainingPhrases.map(phrase => ({
      type: 'EXAMPLE' as const,
      parts: phrase.parts.map(part => ({
        text: part.text,
        entityType: part.entityType, // e.g. @sys.person
        alias: part.alias,           // e.g. given-name
        userDefined: !!part.alias
      }))
    }));
  } else if (config.trainingPhrasesParts) {
    trainingPhrases = config.trainingPhrasesParts.map(part => ({
      type: 'EXAMPLE' as const,
      parts: [{ text: part }],
    }));
  }

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
        await new Promise(resolve => setTimeout(resolve, 1500)); // Throttling
      }
    }

    // Create new intents
    for (const config of intentsToCreate) {
      await createIntent(config);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Throttling
    }

    console.log('All intents configured successfully!');

  } catch (error) {
    console.error('Error configuring Dialogflow:', error);
  }
}

run();
