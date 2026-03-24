import { evaluateCaseInAdvance } from './src/library/predictive-evaluator';

const testCases = [
    {
        name: "High Value Rear-End",
        impact: "rear-end",
        commercial: false,
        severity: "severe",
        vehicleValue: 45000
    },
    {
        name: "Commercial Vehicle T-Bone",
        impact: "side",
        commercial: true,
        severity: "moderate",
        vehicleValue: 20000
    },
    {
        name: "Low Value Minor Fender Bender",
        impact: "front",
        commercial: false,
        severity: "minor",
        vehicleValue: 5000
    }
];

console.log("--- PHASE 5 PREDICTIVE EVALUATION TEST ---");
testCases.forEach(tc => {
    const result = evaluateCaseInAdvance(tc.impact as any, tc.commercial, tc.severity as any, tc.vehicleValue);
    console.log(`\nCase: ${tc.name}`);
    console.log(`- Liability Score: ${result.liabilityScore}%`);
    console.log(`- Total Est Value: $${result.estimatedTotalValue}`);
    console.log(`- Recommendation: ${result.recommendation}`);
    console.log(`- Action Priority: ${result.liabilityScore > 80 ? 'CRITICAL' : 'Standard'}`);
});
