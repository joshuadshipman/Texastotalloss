
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

    // Dimension 3: Timeline
    daysSinceLoss?: number;
    insuranceOfferStatus?: 'received_not_accepted' | 'pending' | 'no_offer';
    responseTimeMinutes?: number;

    // Dimension 4: Source
    source?: string; // 'organic', 'referral', 'exclusive', 'ppc', 'shared', 'retargeting'

    // Dimension 5: Geo/Demo
    city?: string;
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
    if (input.vehicleValue) {
        if (input.vehicleValue >= 40000) breakdown.caseValue += 15;
        else if (input.vehicleValue >= 25000) breakdown.caseValue += 10;
        else if (input.vehicleValue >= 15000) breakdown.caseValue += 5;
    }

    if (input.disputeGap) {
        if (input.disputeGap > 5000) breakdown.caseValue += 10;
        else if (input.disputeGap >= 2000) breakdown.caseValue += 5;
    }

    if (input.insuranceCompany) {
        const highDiff = ['state farm', 'allstate', 'geico'];
        const medDiff = ['progressive', 'liberty mutual'];
        const company = input.insuranceCompany.toLowerCase();

        if (highDiff.some(c => company.includes(c))) breakdown.caseValue += 5;
        else if (medDiff.some(c => company.includes(c))) breakdown.caseValue += 3;
    }
    breakdown.caseValue = Math.min(30, breakdown.caseValue);

    // --- Dimension 2: Engagement & Intent (Max 25) ---
    if (input.toolsUsed.includes('demand_letter')) breakdown.engagement += 10;
    if (input.toolsUsed.includes('calculator')) breakdown.engagement += 7;
    if (input.toolsUsed.includes('videos')) breakdown.engagement += 5;
    if (input.chatMessageCount && input.chatMessageCount > 3) breakdown.engagement += 8;

    if (input.formCompleteness === 'full') breakdown.engagement += 5;
    else if (input.formCompleteness === 'partial') breakdown.engagement += 2;

    const hoursSinceActivity = (new Date().getTime() - input.lastActivityAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceActivity <= 24) breakdown.engagement += 5;
    else if (hoursSinceActivity <= 168) breakdown.engagement += 2; // Last 7 days
    else breakdown.engagement -= 5;

    breakdown.engagement = Math.max(0, Math.min(25, breakdown.engagement));

    // --- Dimension 3: Timeline & Urgency (Max 20) ---
    if (input.daysSinceLoss !== undefined) {
        if (input.daysSinceLoss <= 14) breakdown.timeline += 10;
        else if (input.daysSinceLoss <= 30) breakdown.timeline += 7;
        else if (input.daysSinceLoss <= 60) breakdown.timeline += 3;
    }

    if (input.insuranceOfferStatus === 'received_not_accepted') breakdown.timeline += 10;
    else if (input.insuranceOfferStatus === 'pending') breakdown.timeline += 7;
    else if (input.insuranceOfferStatus === 'no_offer') breakdown.timeline += 3;

    if (input.responseTimeMinutes !== undefined) {
        if (input.responseTimeMinutes <= 5) breakdown.timeline += 5;
        else if (input.responseTimeMinutes <= 60) breakdown.timeline += 3;
    }
    breakdown.timeline = Math.min(20, breakdown.timeline);

    // --- Dimension 4: Source Quality (Max 15) ---
    const sourcePoints: Record<string, number> = {
        'organic': 15,
        'referral': 15,
        'exclusive': 10,
        'ppc': 8,
        'shared': 5,
        'retargeting': 5
    };
    if (input.source && sourcePoints[input.source]) {
        breakdown.source += sourcePoints[input.source];
    }

    // Inbound tool bonuses (if not already covered by engagement or source)
    if (input.toolsUsed.includes('chat')) breakdown.source = Math.max(breakdown.source, 12);
    if (input.toolsUsed.includes('demand_letter')) breakdown.source = Math.max(breakdown.source, 13);

    breakdown.source = Math.min(15, breakdown.source);

    // --- Dimension 5: Geographic & Demographic Fit (Max 10) ---
    const highValueMetros = ['frisco', 'plano', 'southlake', 'highland park'];
    const majorMetros = ['dallas', 'houston', 'austin', 'fort worth'];

    if (input.city) {
        const city = input.city.toLowerCase();
        if (highValueMetros.includes(city)) breakdown.geoFit += 5;
        else if (majorMetros.includes(city)) breakdown.geoFit += 3;
    }

    if (input.language === 'es') breakdown.geoFit += 3;
    else if (input.language === 'en') breakdown.geoFit += 2;

    if (input.deviceType === 'mobile') breakdown.geoFit += 2;
    else if (input.deviceType === 'desktop') breakdown.geoFit += 1;

    breakdown.geoFit = Math.min(10, breakdown.geoFit);

    const totalScore = breakdown.caseValue + breakdown.engagement + breakdown.timeline + breakdown.source + breakdown.geoFit;

    let tier: ScoreResult['tier'] = 'Low Priority';
    if (totalScore >= 80) tier = 'Hot';
    else if (totalScore >= 60) tier = 'Warm';
    else if (totalScore >= 40) tier = 'Cold';

    return {
        totalScore,
        tier,
        breakdown
    };
}
