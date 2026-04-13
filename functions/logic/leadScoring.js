/**
 * Lead Scoring Engine - Dub Hajar Ventures LLC (Series A TTL)
 * Auto-generated based on .agent/skills/lead-scoring-engine/SKILL.md
 * Implements the Litigation Value Index (LVI)
 */

exports.calculateLVI = (leadData) => {
    // 1. Binary Knock-Outs
    if (leadData.has_attorney) return { status: 'KILL', reason: 'already_represented', score: 0 };
    
    // Check Date of loss > 2 years
    if (leadData.date_of_loss) {
        const dol = new Date(leadData.date_of_loss);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        if (dol < twoYearsAgo) return { status: 'KILL', reason: 'statute_expired', score: 0 };
    }

    if (leadData.is_not_at_fault === false) return { status: 'KILL', reason: 'at_fault_nurture', score: 0 };

    let score = 0;

    // Pillar 1: Liability & Insurance Potential
    if (leadData.is_commercial && leadData.is_not_at_fault) score += 50;
    if (leadData.is_not_at_fault && !leadData.is_commercial) score += 20;
    if (leadData.other_driver_cited) score += 15;
    if (leadData.police_report_filed) score += 10;

    // Pillar 3: Economic Damages
    if (leadData.missed_work === 'yes_ongoing') score += 20;
    if (leadData.missed_work === 'yes_returned') score += 10;
    if (leadData.airbags_deployed) score += 15;
    if (leadData.was_towed) score += 5;
    if (leadData.hit_type === 'heavy') score += 5;

    // Pillar 2: Medical Litigation Score Matrix
    let daysSinceAccident = 0;
    if (leadData.date_of_loss) {
        const dol = new Date(leadData.date_of_loss);
        const diffTime = Math.abs(new Date() - dol);
        daysSinceAccident = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    }

    // Commercial Exception
    if (leadData.is_commercial && leadData.medical_status === 'willing_to_treat') {
        if (daysSinceAccident > 7 && daysSinceAccident <= 90) daysSinceAccident = 15; // Lock it into the 8-21 day bracket
    }

    let medicalScore = 0;
    
    // Evaluate matrix (simplified extraction)
    if (leadData.medical_status === 'er_ambulance') {
        if (daysSinceAccident < 7) medicalScore += 40;
        else if (daysSinceAccident <= 21) medicalScore += 35;
        else if (daysSinceAccident <= 90) medicalScore += 25;
        else medicalScore += 15;
    } else if (leadData.medical_status === 'currently_treating') {
        if (daysSinceAccident < 7) medicalScore += 35;
        else if (daysSinceAccident <= 21) medicalScore += 30;
        else if (daysSinceAccident <= 90) medicalScore += 20;
        else medicalScore += 10;
    } else if (leadData.medical_status === 'willing_to_treat') {
        if (daysSinceAccident < 7) medicalScore += 30;
        else if (daysSinceAccident <= 21) medicalScore += 20;
        else if (daysSinceAccident <= 90) medicalScore += 10;
        else medicalScore += 3;
    } else if (leadData.medical_status === 'treated_stopped') {
        if (daysSinceAccident < 7) medicalScore += 20;
        else if (daysSinceAccident <= 21) medicalScore += 12;
        else if (daysSinceAccident <= 90) medicalScore += 5; // else 0
    } else if (leadData.medical_status === 'no_treatment') {
        if (daysSinceAccident < 7) medicalScore += 5;
        else if (daysSinceAccident <= 21) medicalScore += 0;
        else if (daysSinceAccident <= 90) medicalScore -= 10;
        else medicalScore -= 20;
    }
    
    score += medicalScore;

    // Routing Logic
    let tier = 'BRONZE';
    let action = 'Automated property evaluation resources. Low-touch nurture.';
    
    if (score > 120) {
        tier = 'PLATINUM';
        action = '60-second SMS lock-in to Board. Assign to senior intake specialist immediately.';
    } else if (score >= 80) {
        tier = 'GOLD';
        action = 'Alert intake team. Standard 5-minute response SLA.';
    } else if (score >= 50) {
        tier = 'SILVER';
        action = 'Enroll in "Find a Doctor / Recovery" drip sequence.';
    }

    return {
        status: 'ACTIVE',
        tier,
        score,
        action,
        reason: 'fully_scored'
    };
};
