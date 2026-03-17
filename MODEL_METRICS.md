# LLM Model Metrics & Routing Guide

This table serves as the intelligence core for the `ModelRouter`. It allows the system to balance cost, speed, and reasoning capability dynamically. Specific API model IDs are managed via `src/lib/models/model_registry.json` for seamless version updates.

## Decision Table: Language Models

| Model ID | Provider | Tier | Cost (1M Tokens) | Strength | Primary Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **claude-sonnet-4-6** | Anthropic | PRO | $3.00 / $15.00 | Precision | UI Design & Architecture |
| **deepseek-chat** | DeepSeek | FREE* | $0.02 / $0.28 | Efficiency | Coding & General Logic ($0.28 cache miss) |
| **deepseek-reasoner** | DeepSeek | PRO | $0.14 / $0.42 | Thinking | Complex Reasoning (Thinking Mode) |
| **grok-beta** | x.ai | PRO | $2.00 / $6.00 | Creativity | Marketing & Real-time Web |
| **gemini-1.5-pro** | Google | PRO | $3.50 / $10.50 | Massive Context | Multi-file Analysis |
| **gemini-1.5-flash** | Google | FREE | $0.07 / $0.30 | Value | Routine Processing & Bot Shell |
| **sonar-large** | Perplexity | RESEARCH | ~$5.00 | Grounding | Live Web Research & Citations |
| **google-maps** | Google | ASSET | Usage-based | Mapping | Local SEO & Directory Visuals |

*\*Note: DeepSeek is technically paid, but at <$0.30/1M tokens, it is treated as "Free-Tier" efficiency.*

## Task-Specific Priority Cascades (Free-First)

1. **CODING**: DeepSeek Chat -> Sonar Small -> Gemini Flash | **PAID**: Claude 4.6 -> DeepSeek Reasoner -> Grok -> Gemini Pro
2. **MARKETING**: Gemini Flash -> DeepSeek Chat | **PAID**: Grok -> Claude 4.6 -> Gemini Pro
3. **RESEARCH**: Sonar Small -> DeepSeek Chat | **PAID**: Sonar Large -> DeepSeek Reasoner -> Gemini Pro
4. **CMD_SHELL**: Gemini Flash -> DeepSeek Chat | **PAID**: NONE (Always Free)

## Global Rules
1. **REASONING_REQUIRED**: If task involves complex logic, use `deepseek-reasoner` or `claude-sonnet-4-6`.
2. **STRICT_MODE**: If `strict: true`, the system will ERROR rather than falling back to a lower-tier model if the preferred ones are missing.
3. **COST_GUARD**: Routine agent directions (Clawbot shell) are LOCKED to the free-tier models only.
