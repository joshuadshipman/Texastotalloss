---
name: efficient-executor
description: Use when you need to optimize model usage, reduce token burn, or decide between Free, Flash, and Pro tiers.
trigger: >
  Use when tasks involve high token counts, complex research, or when
  explicit efficiency warnings are required to prevent primary account burn.
---

# Goal

Minimize token usage and costs by enforcing a tiered routing strategy and ensuring agents bring sufficient context to every task.

# Instructions
1. **Tiered Selection (Free-First)**:
   - ALWAYS prioritize the `free_sequence` in the `ModelRouter`.
   - **CMD_SHELL**: Use for all internal shell commands and routine agent directions. This tier is hard-coded to be **$0.00 cost** only.
   - **FREE**: Google Gemini Flash or Perplexity (Sonar Small).
   - **PAID**: Only use Claude or Grok for high-stakes `CODING` or `MARKETING` tasks where strict reasoning is required.
2. **Context First**:
   - NEVER use a model to "discover" information that can be found via `grep_search` or `view_file`.
   - Before calling an LLM, gather all relevant code snippets, logs, or documentation and pass them as a single, compressed context block.
3. **STRICT Reasoning**:
   - If a task is `complexity: 'high'`, use **STRICT MODE** in the `ModelRouter`. 
   - Never fallback to Flash for high-logic tasks to prevent "double burn" and poor results.
4. **Intelligence Audit (Dynamic Versioning)**:
   - Before starting a major high-complexity task, check the `model_registry.json`.
   - If the `last_audit` is > 7 days old or the user mentions a new version (e.g., Claude 4.6), perform a **Perplexity Search** for "latest release version and API model ID for [LLM Provider]".
   - Proactively update `model_registry.json` and `MODEL_METRICS.md` to ensure the system is hitting the state-of-the-art model without code refactors.
5. **Smart Context Reading**:
   - For files > 300 lines, NEVER use `view_file` without `StartLine` and `EndLine` unless a full refactor is approved.
   - ALWAYS use `grep_search` or `find_by_name` to locate the problem area before reading code.
   - If you must read a large file, read the first 50 lines for imports/context, then jump to the relevant range.
6. **Context Compaction**:
   - Before moving between major tasks, summarize the "Current State" in a dedicated `context_summary.md` artifact.
   - Use this artifact to "onboard" yourself in future turns, reducing the need to re-read source files.
7. **Advance Warning**:
   - If a prompt exceeds 5,000 tokens or requires the PRO tier, log a "Token Burn Alert" to the console.
8. **External Leverage (Qwen & CLI)**:
   - **Qwen Code Companion**: Use for all local "typing," boilerplate, and autocomplete. It handles the bulk of the character generation at $0 cloud cost.
   - **Gemini CLI**: Use for "Context Piping." Instead of sending full files, pipe targeted state (e.g., `grep "error" build.log | gemini chat`) to the hub to save 90%+ in token overhead.

# Iron Law: No Sprawl
- **NO DUPLICATION**: Every efficiency tactic MUST live in this skill. If a tactic is found in another MD file, it must be deleted from there and referenced here.
- **AUDIT FIRST**: Before suggesting a new "Guide" or "Roadmap," run `grep_search` for related keywords to find existing documentation.

# Constraints

- Avoid repetitive "summarize this" calls.
- Prefer a single large request with clear instructions over multiple small, chatty requests.
