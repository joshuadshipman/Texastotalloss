
export interface LeadScoringInput {
    // Dimension 1: Case Value
    vehicleValue?: number;
    disputeGap?: number;
    insuranceCompany?: string;

    // Dimension 2: Engagement
    toolsUsed: string[]; // 'demand_letter', 'calculator', 'videos', 'chat'
    chatMessageCount?: number;
    formCompleteness: 'full' | 'partial' | 'minimal';
    lastActivityAt: Date;

    // Dimension 3: Timeline & Statutory (Ch. 542)
    daysSinceLoss?: number;
    insuranceOfferStatus?: 'received_not_accepted' | 'pending' | 'no_offer';
    responseTimeMinutes?: number;

    // Dimension 4: Source
    source?: string; // 'organic', 'referral', 'exclusive', 'ppc', 'shared', 'retargeting'

    // Dimension 5: Geo/Demo
    city?: string;
    zipCode?: string;
    language?: 'es' | 'en';
    deviceType?: 'mobile' | 'desktop';

    // Dimension 6: Physical Injury & Intent (NEW)
    hasInjury?: boolean;
    isTreating?: boolean;
    atFaultInsurance?: string;
    description_length?: number;
}

export interface ScoreResult {
    totalScore: number;
    tier: 'Hot' | 'Warm' | 'Cold' | 'Low Priority';
    breakdown: {
        caseValue: number;
        injuryIntent: number;
        engagement: number;
        timeline: number;
        fit: number;
    };
}

export function calculateLeadScore(input: LeadScoringInput): ScoreResult {
    const breakdown = {
        caseValue: 0,
        injuryIntent: 0,
        engagement: 0,
        timeline: 0,
        fit: 0
    };

    // --- Dimension 1: Case Value (Vehicle/Gap) (Max 20) ---
    if (input.vehicleValue) {
        if (input.vehicleValue >= 40000) breakdown.caseValue += 10;
        else if (input.vehicleValue >= 20000) breakdown.caseValue += 5;
    }
    if (input.disputeGap && input.disputeGap > 2000) breakdown.caseValue += 10;

    // --- Dimension 2: Injury & Treatment Status (Max 25) ---
    if (input.hasInjury) breakdown.injuryIntent += 15;
    if (input.isTreating) breakdown.injuryIntent += 10;
    
    // --- Dimension 3: Engagement & Evidence (Max 25) ---
    if (input.toolsUsed.includes('demand_letter')) breakdown.engagement += 10;
    if (input.toolsUsed.includes('calculator')) breakdown.engagement += 5;
    if (input.description_length && input.description_length > 150) breakdown.engagement += 5;
    if (input.atFaultInsurance) breakdown.engagement += 5;

    // --- Dimension 4: Timeline & Statutory Exposure (Max 15) ---
    if (input.daysSinceLoss !== undefined) {
        if (input.daysSinceLoss > 30) breakdown.timeline += 15;
        else if (input.daysSinceLoss > 10) breakdown.timeline += 10;
        else breakdown.timeline += 5;
    }

    // --- Dimension 5: Source & Geo Fit (Max 15) ---
    const sourcePoints: Record<string, number> = { 'organic': 10, 'referral': 10, 'exclusive': 8, 'ppc': 5 };
    if (input.source && sourcePoints[input.source]) breakdown.fit += sourcePoints[input.source];
    
    const highValueZips = ['75205', '75225', '76092', '75024', '75093'];
    if (input.zipCode && highValueZips.includes(input.zipCode)) breakdown.fit += 5;

    const totalScore = breakdown.caseValue + breakdown.injuryIntent + breakdown.engagement + breakdown.timeline + breakdown.fit;

    let tier: ScoreResult['tier'] = 'Low Priority';
    if (totalScore >= 80) tier = 'Hot';
    else if (totalScore >= 60) tier = 'Warm';
    else if (totalScore >= 35) tier = 'Cold';

    return {
        totalScore,
        tier,
        breakdown
    };
}
