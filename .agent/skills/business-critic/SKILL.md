# Business Strategy Critic Skill (Superpower)

Use when a business plan, strategic roadmap, or ROI model needs rigorous validation, "Steel Man" counter-arguments, or a self-improvement loop to achieve high-confidence deployment.

## Triggers (Symptoms)
- Plan feels "idealistic" or lacks rebuttal data.
- Revenue projections are based on assumptions, not market parity.
- Lead costs (CPL) and conversion rates are unverified.
- Strategy lacks a clear "rebuttal section" or risk mitigation.

## Objectives
1. **Steel Man Critique**: Generate 3-5 high-impact counter-arguments that could break the plan.
2. **Rebuttal Stats**: Use web search to find data that either supports or refutes those arguments.
3. **85% Confidence Loop**: Interactively update the plan until a confidence score of 85%+ is documented with evidence.

## Workflow

### 1. Ingestion & Initial Audit
- Read the target business plan (e.g., `business_strategy_v1.md`).
- Identify the core revenue drivers and assumptions.

### 2. The Rebuttal Phase
- Call `web_search` to find industry benchmarks (e.g., "Personal injury CPL Texas 2024").
- Generate the "Steel Man" list.
  - *Example*: "The 3-month profitability relies on a 25% attorney sign rate, but small firms typically convert at 12% without dedicated intake staff."

### 3. Proof of Logic
- Update the plan with a "Rebuttals & Remediation" section.
- Address each concern with a "Feature Fix" (e.g., "Implementing AI Intake Follow-up to boost small firm conversion from 12% to 25%").

### 4. Confidence Scoring
- Assign a confidence score (1-100%).
- Scoring criteria:
  - 10-40%: No benchmarks/data.
  - 40-70%: Benchmarks found, logic solid.
  - 85%+: Logic proven with specific feature-parity or market gaps.

## Iron Law (TDD for Strategy)
**NO PLAN PASSES WITHOUT A REBUTTAL.**
Every business-facing artifact must contain at least 3 "Potential Failure Points" and their corresponding "Structural Mitigations."
