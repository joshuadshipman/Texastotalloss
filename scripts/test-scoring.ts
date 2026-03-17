
import { calculateLeadScore, LeadScoringInput } from '../src/lib/scoring';

const scenarios: Record<string, LeadScoringInput> = {
    'Hot Lead (Max Value)': {
        vehicleValue: 45000,
        disputeGap: 6000,
        insuranceCompany: 'State Farm',
        toolsUsed: ['demand_letter', 'calculator'],
        chatMessageCount: 5,
        formCompleteness: 'full',
        lastActivityAt: new Date(),
        daysSinceLoss: 5,
        insuranceOfferStatus: 'received_not_accepted',
        source: 'organic',
        city: 'Frisco',
        language: 'en',
        deviceType: 'mobile'
    },
    'Warm Lead (Mid Value)': {
        vehicleValue: 28000,
        insuranceCompany: 'Progressive',
        toolsUsed: ['calculator'],
        formCompleteness: 'partial',
        lastActivityAt: new Date(),
        daysSinceLoss: 20,
        insuranceOfferStatus: 'pending',
        source: 'ppc',
        city: 'Dallas',
        language: 'en',
        deviceType: 'desktop'
    },
    'Cold Lead (Low Value/Stale)': {
        vehicleValue: 10000,
        toolsUsed: [],
        formCompleteness: 'minimal',
        lastActivityAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        daysSinceLoss: 70,
        insuranceOfferStatus: 'no_offer',
        source: 'shared',
        city: 'Plainview',
        language: 'en',
        deviceType: 'desktop'
    }
};

console.log('--- Lead Scoring Test Results ---\n');

for (const [name, input] of Object.entries(scenarios)) {
    const result = calculateLeadScore(input);
    console.log(`Scenario: ${name}`);
    console.log(`Total Score: ${result.totalScore}`);
    console.log(`Tier: ${result.tier}`);
    console.log('Breakdown:', JSON.stringify(result.breakdown, null, 2));
    console.log('---------------------------------\n');
}
