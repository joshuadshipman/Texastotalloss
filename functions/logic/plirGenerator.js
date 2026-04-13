/**
 * plirGenerator.js — Pre-Litigation Intake Report Generator
 * Series B: Texas Total Loss | PI Lead Generation Platform
 *
 * PURPOSE: Transform a raw scored pi_lead document into a structured
 * Pre-Litigation Intake Report (PLIR) — the actual product sold to law firms.
 *
 * OUTPUT: Saves PLIR markdown to Firestore `plir_reports/{leadId}`
 * TRIGGER: Called by taskRunner.js on a schedule, or directly after intake scoring.
 */

const admin = require("firebase-admin");
const { modelRouter } = require("../modelRouter");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ── Tier Config for Report Header ────────────────────────────────────────────
const TIER_METADATA = {
  platinum: { label: "PLATINUM",  urgency: "IMMEDIATE REVIEW REQUIRED", price: 650 },
  gold:     { label: "GOLD",      urgency: "HIGH PRIORITY",              price: 350 },
  silver:   { label: "SILVER",    urgency: "STANDARD REVIEW",            price: 175 },
  bronze:   { label: "BRONZE",    urgency: "LOW PRIORITY",               price: 75  },
};

// ── Accident Type Labels ─────────────────────────────────────────────────────
const ACCIDENT_LABELS = {
  commercial:  "Commercial Vehicle / 18-Wheeler",
  rideshare:   "Rideshare Vehicle (Uber/Lyft)",
  mvc:         "Standard Motor Vehicle Collision",
  pedestrian:  "Pedestrian / Cyclist Struck",
  slip_fall:   "Premises Liability / Slip & Fall",
  total_loss:  "Vehicle Total Loss (Property Only)",
};

/**
 * generatePLIR
 * Generates a structured PLIR markdown report for a given lead ID.
 * @param {string} leadId - Firestore document ID in pi_leads
 * @returns {Promise<{success: boolean, reportId?: string, error?: string}>}
 */
async function generatePLIR(leadId) {
  try {
    console.log(`[PLIR] Generating report for lead: ${leadId}`);

    // 1. Fetch the lead
    const leadSnap = await db.collection("pi_leads").doc(leadId).get();
    if (!leadSnap.exists) {
      return { success: false, error: `Lead ${leadId} not found.` };
    }

    const lead = leadSnap.data();
    const tier = TIER_METADATA[lead.lvi_tier] || TIER_METADATA.bronze;
    const accidentLabel = ACCIDENT_LABELS[lead.accidentType] || lead.accidentType;
    const submittedDate = lead.submitted_at?.toDate?.()?.toLocaleDateString("en-US") || "Unknown";

    // 2. AI-Enhanced Injury Summary using modelRouter
    let aiNarrative = "Unable to generate AI narrative.";
    try {
      const prompt = `
You are a Texas PI case investigator preparing a concise, professional intake report for an attorney.

Based on the following raw intake data, write a 2-3 sentence professional injury narrative that:
- States the accident type and mechanism of injury
- Describes the treatment sought and injuries reported
- Notes any factors that strengthen or weaken the case

Intake Data:
- Accident Type: ${accidentLabel}
- At-Fault Party: ${lead.atFaultParty || "Unknown"}
- Police Report Filed: ${lead.policeReportFiled ? "Yes" : "No"}
- ER Visit within 72hrs: ${lead.hadErVisit ? "Yes" : "No"}
- Injury Description: "${lead.injuryDescription}"
- Estimated Damages: $${lead.estimatedDamages?.toLocaleString() || 0}
- Insurance Carrier: ${lead.insuranceCarrier || "Unknown"}

Write ONLY the professional narrative — no headers, no bullet points, no intro.
`.trim();

      const result = await modelRouter({ prompt, task: "plir_narrative" });
      aiNarrative = result.content || aiNarrative;
    } catch (aiErr) {
      console.warn("[PLIR] AI narrative failed, using fallback:", aiErr.message);
    }

    // 3. Build the PLIR Markdown Document
    const plirMarkdown = `
# PRE-LITIGATION INTAKE REPORT
## Texas Total Loss | Series B Lead Generation Platform

---

**CASE TIER:** ${tier.label} | **LVI SCORE:** ${lead.lvi_score} | **${tier.urgency}**
**Report Generated:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
**Case Reference:** \`${leadId}\`
**Listed Price:** $${tier.price}

---

## ⚖️ SECTION 1: CASE OVERVIEW

| Field | Details |
|---|---|
| **Accident Type** | ${accidentLabel} |
| **Incident Date** | Submitted: ${submittedDate} |
| **At-Fault Party** | ${lead.atFaultParty || "Under Investigation"} |
| **Police Report Filed** | ${lead.policeReportFiled ? "✅ Yes" : "❌ No"} |
| **Case Location** | Texas |

## 🏥 SECTION 2: MEDICAL SUMMARY

| Field | Details |
|---|---|
| **ER / Urgent Care (72hr)** | ${lead.hadErVisit ? "✅ Yes — Treatment Documented" : "⚠️ No — Gap in Treatment"} |
| **Insurance Carrier (AT-Fault)** | ${lead.insuranceCarrier || "Unknown"} |
| **UIM Coverage** | ${lead.hasUIM || "Not Specified"} |

**Injury Narrative (AI-Assisted):**
> ${aiNarrative}

**Raw Client Description:**
> "${lead.injuryDescription}"

${!lead.hadErVisit ? `
> ⚠️ **Attorney Note:** No documented ER visit within 72 hours. Defense will likely argue the gap in treatment indicates injuries were not severe. Advise client to seek medical evaluation immediately to preserve case value.
` : ""}

## 💰 SECTION 3: DAMAGES ASSESSMENT

| Field | Details |
|---|---|
| **Estimated Vehicle / Property Damages** | $${lead.estimatedDamages?.toLocaleString() || "Unknown"} |
| **Medical Expenses (Estimate)** | Pending medical records |
| **Lost Wages** | Not captured in intake |
| **Damage Photos** | ${lead.hasPhotos || "Not specified"} |

## 📊 SECTION 4: LVI SCORING BREAKDOWN

**Overall LVI Score: ${lead.lvi_score} / 150**

| Scoring Pillar | Factor | Impact |
|---|---|---|
| Accident Type | ${accidentLabel} | ${lead.accidentType === "commercial" ? "✅ Maximum" : lead.accidentType === "rideshare" ? "✅ High" : "Standard"} |
| Liability Clarity | ${lead.atFaultParty || "Unknown"} | ${["other_driver", "commercial_driver"].includes(lead.atFaultParty) ? "✅ Clear" : "⚠️ May be contested"} |
| Police Report | ${lead.policeReportFiled ? "Filed" : "None"} | ${lead.policeReportFiled ? "✅ Supports case" : "⚠️ Weakens liability"} |
| Medical Treatment | ${lead.hadErVisit ? "ER within 72hrs" : "No documented treatment"} | ${lead.hadErVisit ? "✅ Strong" : "⚠️ Significant gap"} |
| Estimated Damages | $${lead.estimatedDamages?.toLocaleString() || 0} | ${(lead.estimatedDamages || 0) >= 10000 ? "✅ Substantial" : "Standard"} |

## 🎯 SECTION 5: ATTORNEY RECOMMENDATION

${lead.lvi_tier === "platinum" ? `
**STRONG RECOMMENDATION TO PURSUE**

This case presents multiple indicators of high settlement potential:
- Commercial vehicle involvement (highest insurance policy limits)
- Documented ER treatment within 72 hours
- Police report on file
- Estimated damages exceed $${(lead.estimatedDamages || 0).toLocaleString()}

Recommended Next Step: **Immediate intake call to verify medical records and request crash report from TxDOT.**
` : lead.lvi_tier === "gold" ? `
**RECOMMENDED FOR INTAKE**

This case has strong fundamentals. Liability appears clear and medical treatment has been documented.
Review the injury narrative and request medical records before committing.

Recommended Next Step: **Initial intake call to assess full treatment timeline and gather insurance policy limits.**
` : `
**CONDITIONAL RECOMMENDATION**

This case has some positive factors but also gaps that need to be addressed before committing.
Review the attorney notes above before proceeding with intake.

Recommended Next Step: **Phone consultation to assess gaps and determine if additional documentation can be obtained.**
`}

---

## 📞 SECTION 6: CLIENT CONTACT

> ⚠️ **PII RELEASE**: Client contact information is released upon case purchase.
> After purchase, full name, phone, and email will be available in your purchased cases dashboard.

**Purchase this case at:** [Texas Total Loss Attorney Portal](https://www.texastotalloss.com/portal)

---

*This report was generated by the Texas Total Loss AI Platform. It does not constitute legal advice 
and is intended for attorney use only. Texas Total Loss is a lead generation platform, not a law firm.*

*Report generated: ${new Date().toISOString()}*
`.trim();

    // 4. Save PLIR to Firestore
    const reportRef = db.collection("plir_reports").doc(leadId);
    await reportRef.set({
      leadId,
      lvi_score: lead.lvi_score,
      lvi_tier: lead.lvi_tier,
      accidentType: lead.accidentType,
      reportMarkdown: plirMarkdown,
      aiNarrative,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "ready",
      listingPrice: tier.price,
    });

    // 5. Update the lead record to show PLIR is ready
    await db.collection("pi_leads").doc(leadId).update({
      plir_status: "ready",
      plir_generated_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 6. Update portal listing if it exists
    const listingRef = db.collection("portal_listings").doc(leadId);
    const listingSnap = await listingRef.get();
    if (listingSnap.exists) {
      await listingRef.update({ plir_status: "ready" });
    }

    console.log(`[PLIR] ✅ Report generated and saved for lead: ${leadId}`);
    return { success: true, reportId: leadId, tier: lead.lvi_tier, price: tier.price };

  } catch (err) {
    console.error(`[PLIR] ❌ Error generating report for ${leadId}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * runPLIRBatch
 * Processes all pi_leads that have been scored but don't yet have a PLIR.
 * Called by taskRunner.js on a schedule.
 * @param {number} batchSize - Max leads to process per run (default 10)
 */
async function runPLIRBatch(batchSize = 10) {
  console.log(`[PLIR Batch] Starting batch run — max ${batchSize} leads...`);

  try {
    const q = db.collection("pi_leads")
      .where("plir_status", "==", null)
      .where("lvi_score", ">=", 60) // Only Silver+ gets a PLIR
      .orderBy("lvi_score", "desc")
      .limit(batchSize);

    // Note: Firestore requires lvi_score field to exist for this query.
    // Use a composite index on (plir_status, lvi_score) in firestore.indexes.json
    const snap = await q.get();

    if (snap.empty) {
      // Try alternate query — leads with no plir_status field at all
      const q2 = db.collection("pi_leads")
        .where("status", "==", "pending_review")
        .where("lvi_score", ">=", 60)
        .orderBy("lvi_score", "desc")
        .limit(batchSize);

      const snap2 = await q2.get();
      if (snap2.empty) {
        console.log("[PLIR Batch] No pending leads found.");
        return { processed: 0 };
      }

      const results = [];
      for (const doc of snap2.docs) {
        const result = await generatePLIR(doc.id);
        results.push({ leadId: doc.id, ...result });
      }

      console.log(`[PLIR Batch] ✅ Processed ${results.length} leads.`);
      return { processed: results.length, results };
    }

    const results = [];
    for (const doc of snap.docs) {
      const result = await generatePLIR(doc.id);
      results.push({ leadId: doc.id, ...result });
    }

    console.log(`[PLIR Batch] ✅ Processed ${results.length} leads.`);
    return { processed: results.length, results };

  } catch (err) {
    console.error("[PLIR Batch] ❌ Batch failed:", err);
    return { processed: 0, error: err.message };
  }
}

module.exports = { generatePLIR, runPLIRBatch };
