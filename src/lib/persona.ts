/**
 * Strategy Persona Architecture - V3 (Autonomous Executive Suite)
 * 
 * Aligned with 'texas-total-loss-standards'.
 * Goal: 24/7 Autonomous improvement in Marketing, Traffic, and Profitability.
 */

export interface StrategyRole {
  name: string;
  focus: string;
  bias: string;
  skepticism: string;
}

export const STRATEGY_ROLES: Record<string, StrategyRole> = {
  CMO: {
    name: "Chief Marketing Strategist",
    focus: "Brand authority and 'Witness-Stand Quality' lead capture.",
    bias: "Dominating search (AEO/SEO) and social with trust-first content.",
    skepticism: "Is this message generic? Does it lose the competitive moat?"
  },
  DirectorOfSales: {
    name: "Director of Intake & Sales",
    focus: "Speed-to-contact and conversion proportionality.",
    bias: "Maximizing the value of every clear-liability lead.",
    skepticism: "Will this slow down the intake? Is the 'hook' strong enough?"
  },
  CXExpert: {
    name: "Customer Experience & Gamification Lead",
    focus: "Making the claim process feel effortless and rewarding.",
    bias: "Zero-friction data capture. Visual 'Quick Wins' for the customer.",
    skepticism: "Is this 'more work'? Where is the dopamine hit for the user?"
  },
  TrafficStrategist: {
    name: "Traffic & Ad-Ops Specialist",
    focus: "Lowest possible CPA (Cost Per Acquisition).",
    bias: "Exploiting gaps in competitor ad spend and SEO 'Striking Distance' keywords.",
    skepticism: "Are we wasting money on low-intent keywords? Is the ROI measurable?"
  },
  LeadDeveloper: {
    name: "Principal Full-Stack Architect",
    focus: "Autonomous self-repair and 24/7 system uptime.",
    bias: "Speed, scalability, and 'Golden Trio' Docker compliance.",
    skepticism: "Is this code bloated? Can it self-heal if the GSC API changes?"
  }
};

/**
 * Strategy Hub - Decision Logic
 * Assigns the best persona for a given research topic.
 */
export function assignPersonaForTopic(topic: string): keyof typeof STRATEGY_ROLES {
  const t = topic.toLowerCase();
  if (t.includes('code') || t.includes('api') || t.includes('docker') || t.includes('database')) return 'LeadDeveloper';
  if (t.includes('marketing') || t.includes('social') || t.includes('seo') || t.includes('brand')) return 'CMO';
  if (t.includes('cost') || t.includes('ads') || t.includes('traffic') || t.includes('cpa')) return 'TrafficStrategist';
  if (t.includes('conversion') || t.includes('sales') || t.includes('intake') || t.includes('referral')) return 'DirectorOfSales';
  if (t.includes('ui') || t.includes('ux') || t.includes('gamify') || t.includes('customer') || t.includes('easier')) return 'CXExpert';
  
  return 'CMO'; // Default
}

export function injectStrategyPersona(prompt: string, roleType: keyof typeof STRATEGY_ROLES, mode: 'Research' | 'Critic'): string {
  const persona = STRATEGY_ROLES[roleType];
  
  const globalStandards = "FOLLOW TEXAS-TOTAL-LOSS-STANDARDS: Barratry Shield (Reactive), Pro-Max UI (8px system), and Recursive Self-Repair.";

  if (mode === 'Research') {
    return `ACT AS: ${persona.name}. 
      Focus: ${persona.focus}. 
      Core Bias: ${persona.bias}. 
      ${globalStandards}
      
      TASK: ${prompt}`;
  } else {
    return `ACT AS: ADVERSARIAL CRITIC (from ${persona.name} perspective).
      ${globalStandards}
      Your job is to poke holes through the lens of: ${persona.skepticism}.
      Critical Question: Does this actually make the business more profitable/quicker or is it 'more work' for the customer?
      
      REPORT TO AUDIT:
      ${prompt}`;
  }
}
