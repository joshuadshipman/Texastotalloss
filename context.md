# Texas Total Loss: Self-Learning Automation Strategy

This document outlines the high-level strategy for continuous Improvement and automation across marketing, design, and content.

## Global Optimization Loop

The goal of this loop is to learn from usage and competitor research to automate as many tasks as possible "for free" before paying for external APIs.

### 1. Data Collection & Research
- **Competitor Snapshots**: `ttl-competitor-research-agent` scans competitor sites daily/weekly to extract layout patterns and messaging themes.
- **Performance Metrics**: Export metrics from GA4/Search Console into `data/analytics/` for the `ttl-daily-marketing-review-agent` to process.
- **Content Engagement**: Monitor which blog posts and FAQs lead to the most calculator completions.

### 2. Analysis & Insight
- **Daily Review**: Every day, the `ttl-daily-marketing-review-agent` summarizes activity, performance, and competitor trends.
- **Pattern Identification**: Identify what worked (high performing variants) and what competitors are doing differently.
- **Reporting**: Insights are written to `docs/marketing-insights.md` and actionable items are moved to `plan.md`.

### 3. Strategy & Execution
- **Campaign Generation**: `ttl-campaign-generator-agent` turns insights into multi-channel campaigns.
- **Content Creation**: `texas-total-loss-content-agent` creates articles and FAQs based on trending topics and identified gaps.
- **Design Updates**: `ttl-design-updater-agent` proposes layout or component changes based on modern aesthetic standards and successful patterns.

### 4. Implementation & Testing
- **A/B Testing**: Implement small, testable changes (Headlines, CTAs) and track performance until a clear winner emerges.
- **Feedback Loop**: Successful tests become the new baseline, and the loop repeats.

## Autonomy and Decision-Making

To minimize user fatigue while maintaining control, the system follows a "Decision Tier" framework when faced with unknown or ambiguous paths:

### Tier 1: Auto-Determine (High Confidence)
- **Criteria**: Clear precedent exists in `docs/example-patterns.md`, successful past experiments, or established brand guidelines.
- **Action**: Execute the choice and report the rationale in the next scan/review.

### Tier 2: Propose Narrowed List (Medium Confidence)
- **Criteria**: Multiple viable options exist with different trade-offs (e.g., "more aggressive SEO" vs "safer brand tone").
- **Action**: Present the user with a "Top 3" narrowed list of recommendations, explaining the pros/cons of each.

### Tier 3: Request Clarification (Low Confidence)
- **Criteria**: No context exists, or the action involves high risk/cost.
- **Action**: Stop and ask one specific, clarifying question.

## Behavioral Guardrails
- **Minimizing Cost**: Use `cost-aware-planner` to prioritize cheap experiments.
- **Legal Compliance**: AI-generated content must be framed as informational, never as specific legal advice.
- **Premium Aesthetics**: All design updates must follow modern, high-end design standards (e.g., vibrant colors, glassmorphism, dynamic animations).
