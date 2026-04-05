/**
 * firmDiscovery.js — PI Law Firm Discovery & Outreach Pipeline
 * Series B: Texas Total Loss | PI Lead Generation Platform
 *
 * PURPOSE: Replaces original Apify shopping scraper with a PI law firm
 * discovery pipeline. Scrapes legal directories (Avvo, Justia, FindLaw)
 * to build a database of Texas PI firms for outreach targeting.
 *
 * TARGETS: Small-to-medium Texas PI firms (1–20 attorney headcount)
 * that specialize in MVC, commercial vehicle, and personal injury.
 *
 * TRIGGER: taskRunner.js — runs weekly to grow the firm pipeline.
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { modelRouter } = require("./modelRouter");

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ── Target Cities (Texas PI Markets) ─────────────────────────────────────────
const TARGET_CITIES = [
  "Houston", "Dallas", "Austin", "San Antonio", "Fort Worth",
  "El Paso", "Lubbock", "Corpus Christi", "Waco", "Midland",
];

// ── Practice Area Keywords ────────────────────────────────────────────────────
const PI_KEYWORDS = [
  "personal injury",
  "motor vehicle accident",
  "truck accident",
  "car accident attorney",
  "auto accident lawyer",
  "18 wheeler accident",
  "rideshare accident",
];

/**
 * buildSearchUrls
 * Generates search URLs for legal directories to scrape.
 */
function buildSearchUrls(city, keyword) {
  const encoded = encodeURIComponent(`${keyword} attorney ${city} Texas`);
  return [
    `https://www.avvo.com/find-a-lawyer/personal-injury-attorney/${city.toLowerCase()}-tx`,
    `https://www.justia.com/lawyers/personal-injury/texas/${city.toLowerCase()}`,
    `https://attorneys.findlaw.com/profile/searchresults/search.html?city=${city}&state=TX&practiceArea=PI`,
  ];
}

/**
 * normalizeFirmRecord
 * Standardizes a scraped firm object for Firestore storage.
 */
function normalizeFirmRecord(rawFirm, source, city) {
  return {
    name: rawFirm.name || "Unknown Firm",
    city,
    state: "TX",
    phone: rawFirm.phone || null,
    email: rawFirm.email || null,
    website: rawFirm.website || null,
    address: rawFirm.address || null,
    headcount: rawFirm.headcount || null,
    practiceAreas: rawFirm.practiceAreas || ["Personal Injury"],
    avvoRating: rawFirm.rating || null,
    source,
    outreachStatus: "uncontacted",
    discoveredAt: admin.firestore.FieldValue.serverTimestamp(),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  };
}

/**
 * discoverFirmsWithAI
 * Uses modelRouter + Perplexity to research PI firms in a given city.
 * Returns a list of structured firm objects.
 */
async function discoverFirmsWithAI(city, limit = 10) {
  logger.info(`[Firm Discovery] AI researching PI firms in ${city}, TX...`);

  const prompt = `
Research the top ${limit} small-to-medium personal injury law firms in ${city}, Texas.
Focus on firms with 1-20 attorneys that handle:
- Motor vehicle accidents
- Commercial truck accidents  
- Rideshare accidents (Uber/Lyft)

For each firm, return a JSON array (no markdown) with this exact structure:
[
  {
    "name": "Firm Name PC",
    "city": "${city}",
    "phone": "555-555-5555 or null",
    "website": "https://... or null",
    "practiceAreas": ["Personal Injury", "Auto Accidents"],
    "approximateHeadcount": 5,
    "avvoRating": 9.5
  }
]

Return ONLY the JSON array. No explanation, no markdown code blocks.
`.trim();

  try {
    const result = await modelRouter({
      prompt,
      task: "firm_discovery",
      preferredModel: "perplexity", // Perplexity for real-time web data
    });

    let text = result.content || "[]";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const firms = JSON.parse(text);

    return Array.isArray(firms) ? firms : [];
  } catch (err) {
    logger.error(`[Firm Discovery] AI discovery failed for ${city}:`, err.message);
    return [];
  }
}

/**
 * saveFirmsBatch
 * Upserts discovered firms into the `target_firms` Firestore collection.
 * Uses firm name + city as a composite key to avoid duplicates.
 */
async function saveFirmsBatch(firms, source, city) {
  let saved = 0;
  const batch = db.batch();

  for (const firm of firms.slice(0, 20)) {
    // Create a deterministic ID from name + city to enable upsert
    const firmKey = `${city}_${firm.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .substring(0, 60);

    const docRef = db.collection("target_firms").doc(firmKey);
    const existing = await docRef.get();

    if (!existing.exists) {
      batch.set(docRef, normalizeFirmRecord(firm, source, city));
      saved++;
    } else {
      batch.update(docRef, { lastUpdated: admin.firestore.FieldValue.serverTimestamp() });
    }
  }

  await batch.commit();
  logger.info(`[Firm Discovery] Saved ${saved} new firms from ${city}`);
  return saved;
}

/**
 * runFirmDiscovery
 * Main discovery runner — processes cities in batches.
 * Called by taskRunner.js weekly.
 * @param {number} citiesPerRun - How many cities to process per run
 */
async function runFirmDiscovery(citiesPerRun = 3) {
  logger.info(`[Firm Discovery] Starting run — processing ${citiesPerRun} cities...`);

  // Rotate through cities to spread discovery over time
  const statusDoc = await db.collection("system_config").doc("firm_discovery_state").get();
  const lastIndex = statusDoc.exists ? (statusDoc.data().lastCityIndex || 0) : 0;

  let totalSaved = 0;
  const results = [];

  for (let i = 0; i < citiesPerRun; i++) {
    const cityIndex = (lastIndex + i) % TARGET_CITIES.length;
    const city = TARGET_CITIES[cityIndex];

    const firms = await discoverFirmsWithAI(city, 8);
    const saved = await saveFirmsBatch(firms, "ai_discovery_perplexity", city);

    totalSaved += saved;
    results.push({ city, discovered: firms.length, saved });
  }

  // Update rotation state
  await db.collection("system_config").doc("firm_discovery_state").set({
    lastCityIndex: (lastIndex + citiesPerRun) % TARGET_CITIES.length,
    lastRunAt: admin.firestore.FieldValue.serverTimestamp(),
    totalFirmsDiscovered: admin.firestore.FieldValue.increment(totalSaved),
  }, { merge: true });

  logger.info(`[Firm Discovery] ✅ Run complete. Saved ${totalSaved} new firms.`);
  return { totalSaved, results };
}

/**
 * qualifyFirmForOutreach
 * Uses AI to determine if a discovered firm is a good outreach target
 * based on their website, practice areas, and size.
 * Sets outreachStatus to "qualified" or "not_a_fit".
 */
async function qualifyFirmForOutreach(firmId) {
  const firmSnap = await db.collection("target_firms").doc(firmId).get();
  if (!firmSnap.exists) return { qualified: false, reason: "Firm not found" };

  const firm = firmSnap.data();

  const prompt = `
You are a business development agent for a PI lead generation platform in Texas.
Evaluate if this law firm would be a good buyer of pre-qualified PI leads at $75–$650 per case.

Firm Details:
- Name: ${firm.name}
- City: ${firm.city}, TX
- Practice Areas: ${(firm.practiceAreas || []).join(", ")}
- Headcount: ~${firm.headcount || "Unknown"} attorneys
- Website: ${firm.website || "None listed"}

A good target firm:
✅ Focuses primarily on PI / auto accidents (NOT divorce, criminal, bankruptcy)
✅ Small-to-medium size (1-20 attorneys) — likely has budget constraints and wants consistent leads
✅ Located in Texas (preferably major metro or suburban)

Respond with ONLY valid JSON: {"qualified": true|false, "reason": "Brief explanation", "suggestedTier": "platinum|gold|silver|bronze"}
`.trim();

  try {
    const result = await modelRouter({ prompt, task: "firm_qualification" });
    let text = result.content || '{"qualified": false, "reason": "Could not assess"}';
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const assessment = JSON.parse(text);

    await db.collection("target_firms").doc(firmId).update({
      outreachStatus: assessment.qualified ? "qualified" : "not_a_fit",
      qualificationReason: assessment.reason,
      suggestedTier: assessment.suggestedTier || null,
      qualifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return assessment;
  } catch (err) {
    logger.error(`[Firm Discovery] Qualification failed for ${firmId}:`, err.message);
    return { qualified: false, reason: "Assessment failed" };
  }
}

// ── Cloud Function: Manual Trigger ────────────────────────────────────────────
exports.triggerFirmDiscovery = onCall(async (request) => {
  // Admin only
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be authenticated.");

  const result = await runFirmDiscovery(2);
  return result;
});

module.exports.runFirmDiscovery = runFirmDiscovery;
module.exports.qualifyFirmForOutreach = qualifyFirmForOutreach;
