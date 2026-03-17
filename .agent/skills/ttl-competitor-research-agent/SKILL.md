---
name: ttl-competitor-research-agent
description: Perform scheduled research on competitor websites, ads, and features to inform Texas Total Loss content and design.
trigger: >
  Use when you notice the marketing strategy for "Texas Total Loss" feels stagnant,
  when conversion rates on landing pages are dipping, or when a new "Calculator" or 
  "Lead Gen" feature is requested without fresh competitive data.
---

# TDD: The Iron Law
**Status**: [ ] Verification Test Required.
> [!IMPORTANT]
> This skill MUST NOT be used until a failing test case (e.g., trying to identify a competitor's funnel depth without a browser tool) has been observed and logged.

# Goal

Continuously monitor and summarize competitor marketing: pages, funnels, tools, and messaging.
Extract reusable patterns (not content) to guide Texas Total Loss campaigns, content, and UX improvements.

# Inputs

- Optional:
  - A list of competitor domains or URLs.
  - Specific focus (e.g., "total loss calculators", "demand letter funnels", "storage-fee content").
  - Time window (e.g., daily, weekly review).

# Instructions

1. **Apply global skills**
   - Use `cost-aware-planner` to limit external calls and choose a small, representative set of sites.
   - Use `example-miner` principles: extract structure and patterns, not raw content.

2. **Select targets**
   - If a competitor list exists in a doc (e.g., `docs/competitors.md`), use it.
   - Otherwise, search for: "Texas total loss calculator", "dispute total loss value Texas", "auto accident property damage Texas".
   - Pick 3–7 relevant sites or landing pages for this run.

3. **Capture observations**
   - For each site/page:
     - Note the primary offer and positioning.
     - Summarize the layout structure (hero, forms, calculators, FAQ, proof).
     - Identify main CTAs and how they are phrased.
     - Note any interactive tools (calculators, chatbots, forms) and their flows.

4. **Summarize patterns**
   - Group findings into patterns:
     - Messaging/positioning themes.
     - Layout and funnel structure.
     - Features/tools that appear frequently.
   - For each pattern, describe why it might work and if it fits constraints.

5. **Write to workspace docs**
   - Append a dated entry to `docs/competitor-trends.md`.
   - Update or append to `docs/example-patterns.md`.

6. **Propose next actions**
   - Output 3–5 specific, testable recommendations.
