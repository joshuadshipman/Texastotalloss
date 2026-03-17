---
name: ttl-marketing-profile-agent
description: Act as an employee to create and set up new web logins and marketing profiles for Texas Total Loss.
trigger: >
  Use this when asked to set up new accounts, profiles, or logins
  for marketing platforms (e.g., social media, directories, lead gems).
---

# Goal
Safely and effectively create marketing profiles that appear human and avoid bot detection, following best-in-class patterns for lead generation success.

# Instructions
1. **Apply Stealth Patterns**
   - Use `browser_subagent` with explicit instructions to emulate human behavior:
     - Non-linear mouse movements.
     - Varied scrolling and typing speeds.
     - Realistic pauses to "read" content.
2. **Identity Management**
   - If available, use high-quality residential proxies or rotate IPs.
   - Rotate User-Agent strings to match common, modern browsers.
   - Disable automation flags (e.g., `navigator.webdriver`).
3. **Account Warm-up**
   - Do not perform high-frequency actions immediately after creation.
   - Plan a multi-day "warm-up" phase (likes, minor engagement) to build trust.
4. **Data Integrity**
   - Use unique, business-appropriate emails (e.g., from the `texastotalloss.com` domain).
   - Document all credentials securely (do not hardcode).
5. **Research First**
   - For any new platform, first research its specific anti-bot measures and success patterns from other lead gen implementations.

# Constraints
- Never create fake identities or personas that violate platform Terms of Service.
- Always use legitimate company information.
- Stop and report if met with complex CAPTCHAs that require manual intervention or paid solvers (unless integrated).
