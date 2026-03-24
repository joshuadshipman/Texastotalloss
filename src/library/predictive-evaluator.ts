import { VEHICLE_DATA } from '@/data/vehicles';

export interface AdvanceEvaluationRequest {
    vin?: string;
    year: string;
    make: string;
    model: string;
    trim?: string;
    mileage?: number;
    condition?: 'excellent' | 'good' | 'fair' | 'poor';
    impactType?: 'rear-end' | 'side-impact' | 'front-end' | 'rollover';
    involvedCommercialVehicle?: boolean;
    damageSeverity?: 'minor' | 'moderate' | 'severe' | 'total-loss';
}

export interface AdvanceEvaluationResult {
    estimatedValue: number;
    storageFeeLiability: number;
    statutoryHooks: string[];
    confidenceScore: number;
    liabilityScore: number; // 0-100 score for case strength
}

/**
 * Predictive evaluation engine for "Evaluation in Advance" strategy.
 * Used to score and triage leads discovered via VSF/Auction data.
 */
export const evaluateCaseInAdvance = (req: AdvanceEvaluationRequest): AdvanceEvaluationResult => {
    let baseValue = 0;
    let liabilityScore = 50; // Base score
    
    // 1. Basic Market Parity Logic
    if (VEHICLE_DATA[req.year]?.[req.make]?.[req.model]) {
        const trims = VEHICLE_DATA[req.year][req.make][req.model];
        baseValue = Math.max(...Object.values(trims).map((v: any) => v.base_value || 0));
    }

    // 2. Liability Scoring (User's Core Requirement)
    if (req.impactType === 'rear-end') liabilityScore += 30; // High probability no-fault
    if (req.involvedCommercialVehicle) liabilityScore += 20; // High policy limits
    if (req.damageSeverity === 'severe' || req.damageSeverity === 'total-loss') liabilityScore += 10;
    
    // Cap at 100
    liabilityScore = Math.min(liabilityScore, 100);

    // 3. Adjust for condition/mileage
    let multiplier = 1.0;
    if (req.condition === 'excellent') multiplier = 1.1;
    if (req.condition === 'fair') multiplier = 0.8;
    
    const finalValue = baseValue * multiplier;

    return {
        estimatedValue: Math.round(finalValue),
        storageFeeLiability: 187.10,
        statutoryHooks: [
            "TX Ins. Code § 542.003 - Prompt Payment",
            "TX Occ. Code § 2303.156 - Storage Fee Liability"
        ],
        confidenceScore: baseValue > 0 ? 85 : 0,
        liabilityScore
    };
};
