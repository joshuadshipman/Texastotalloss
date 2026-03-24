
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
}

export interface ScoreResult {
    totalScore: number;
    tier: 'Hot' | 'Warm' | 'Cold' | 'Low Priority';
    breakdown: {
        caseValue: number;
        engagement: number;
        timeline: number;
        source: number;
        geoFit: number;
    };
}

export function calculateLeadScore(input: LeadScoringInput): ScoreResult {
    const breakdown = {
        caseValue: 0,
        engagement: 0,
        timeline: 0,
        source: 0,
        geoFit: 0
    };

    // --- Dimension 1: Case Value Potential (Max 30) ---
    // Reflects potential for significant vehicle equity or injury recovery
    if (input.vehicleValue) {
        if (input.vehicleValue >= 40000) breakdown.caseValue += 15;
        else if (input.vehicleValue >= 25000) breakdown.caseValue += 10;
        else if (input.vehicleValue >= 12000) breakdown.caseValue += 5; // Texas average threshold
    }

    if (input.disputeGap) {
        if (input.disputeGap > 5000) breakdown.caseValue += 10;
        else if (input.disputeGap >= 2000) breakdown.caseValue += 5;
    }

    if (input.insuranceCompany) {
        const aggressive = ['state farm', 'allstate', 'progressive', 'farmers'];
        const company = input.insuranceCompany.toLowerCase();
        if (aggressive.some(c => company.includes(c))) breakdown.caseValue += 5;
    }
    breakdown.caseValue = Math.min(30, breakdown.caseValue);

    // --- Dimension 2: Engagement & Intent (Max 25) ---
    // Measures user's commitment to the process
    if (input.toolsUsed.includes('demand_letter')) breakdown.engagement += 10;
    if (input.toolsUsed.includes('calculator')) breakdown.engagement += 10; // High intent
    if (input.chatMessageCount && input.chatMessageCount > 5) breakdown.engagement += 10;

    if (input.formCompleteness === 'full') breakdown.engagement += 5;
    
    breakdown.engagement = Math.min(25, breakdown.engagement);

    // --- Dimension 3: Timeline & Statutory Exposure (Max 20) ---
    // Key "18% Hammer" logic (Texas Insurance Code § 542.060)
    if (input.daysSinceLoss !== undefined) {
        if (input.daysSinceLoss > 60) breakdown.timeline += 20; // Critical Statutory Violation
        else if (input.daysSinceLoss > 30) breakdown.timeline += 15;
        else if (input.daysSinceLoss > 15) breakdown.timeline += 10;
        else breakdown.timeline += 5; // Recent accident
    }
    breakdown.timeline = Math.min(20, breakdown.timeline);

    // --- Dimension 4: Source & Inbound Quality (Max 15) ---
    const sourcePoints: Record<string, number> = {
        'organic': 15,
        'referral': 15,
        'exclusive': 12,
        'ppc': 8
    };
    if (input.source && sourcePoints[input.source]) {
        breakdown.source += sourcePoints[input.source];
    }
    breakdown.source = Math.min(15, breakdown.source);

    // --- Dimension 5: Geo & Demographic Fit (Max 10) ---
    const highValueZips = ['75205', '75225', '76092', '75024', '75093']; // Dallas, Southlake, Plano
    if (input.zipCode && highValueZips.includes(input.zipCode)) breakdown.geoFit += 10;
    else if (input.city) breakdown.geoFit += 5;

    if (input.deviceType === 'mobile') breakdown.geoFit += 2;
    
    breakdown.geoFit = Math.min(10, breakdown.geoFit);

    const totalScore = breakdown.caseValue + breakdown.engagement + breakdown.timeline + breakdown.source + breakdown.geoFit;

    let tier: ScoreResult['tier'] = 'Low Priority';
    if (totalScore >= 85) tier = 'Hot';
    else if (totalScore >= 65) tier = 'Warm';
    else if (totalScore >= 45) tier = 'Cold';

    return {
        totalScore,
        tier,
        breakdown
    };
}
