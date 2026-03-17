---
name: web-search
description: Searches the web for a given query using the Gemini 1.5 Flash Google Search grounding tool. Returns a structured summary with source links.
trigger: >
  Use this for research, competitor analysis, or finding the latest market
  trends without using paid search APIs (Tavily/Brave).
---

# Goal
Provide high-accuracy, grounded web research for lead generation and content topics.

# Instructions
1. **Gemini Grounding**: Always use the `google_search_grounding` tool.
2. **Summary**: Provide a bulleted summary of findings with source links.
3. **Accuracy**: Cross-reference facts if they seem inconsistent.
