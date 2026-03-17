---
name: ttl-crm-management-agent
description: Ensure data captured via the questionnaire is structured and saved in formats compatible with Litify (Salesforce).
trigger: >
  Use this when asked to verify CRM compatibility, perform field mapping,
  or modify the lead submission data structure to support Litify.
---

# Goal
Safeguard data integrity and ensure seamless lead flow from the web application into Litify.

# Instructions
1. **Enforce Field Mapping**
   - Maintain a master mapping between Supabase schema and Litify fields.
   - For any new field added to the questionnaire, define its Litify equivalent (standard or custom `__c`).
2. **Standardize Data Formats**
   - Ensure dates use ISO 8601 for Supabase but are convertible to Salesforce `Date` format.
   - Ensure picklist values (e.g., source, role) match the predefined options in Litify.
   - Automatically split "Full Name" into `FirstName` and `LastName` during the CRM sync process logic.
3. **Validate Data Integrity**
   - Before submission, verify that required fields for Litify (e.g., Phone, Last Name) are present and correctly formatted.
4. **Audit and Reconcile**
   - Periodically audit saved leads to ensure no data loss occurs due to format mismatches.

# Constraints
- Do not modify the Supabase schema without first checking impact on any existing external syncs.
- Always prioritize data types: if Litify expects a Number, do not send a String.
