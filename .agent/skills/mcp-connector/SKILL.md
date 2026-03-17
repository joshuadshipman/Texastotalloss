---
name: mcp-connector
description: Generic MCP (Model Context Protocol) bridge. Connects to external MCP servers like GitHub or CRM APIs.
trigger: >
  Use this to call tools from external MCP servers that are not natively
  integrated into this workspace.
---

# Goal
Expand the Hub's capabilities by bridging to the global MCP ecosystem.

# Instructions
1. **Secure Headers**: Retrieve auth tokens from Secret Manager or .env.
2. **Standard Routing**: Route tool calls via HTTPS POST.
