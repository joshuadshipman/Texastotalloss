# TTL Insurance Quiz Spec
### "Will Your Next Car Cost More to Insure?" — Texas Total Loss Edition
### Interactive Lead Magnet | Zero Cost | High Shareability

---

## Purpose

A 7-question interactive quiz that:

1. **Qualifies P&C leads** before they hit the Voice AI agent (saving voice AI cost on bad leads)
2. **Feels like a free resource** (not a funnel) — users share quizzes organically
3. **Captures contact info** at the result screen tied to a high-interest moment
4. **Pre-segments** leads into 3 tiers so the aggregator gets quality-matched contacts

---

## Quiz Title & Hook

**Title:** `"Will Your Next Car Cost More to Insure? (Texas Total Loss Edition)"`

**Subtitle:** `"Takes 60 seconds. Based on real Texas carrier data."`

**Share hook (for after results):** `"I just found out I qualify for preferred rates after my total loss — take the quiz"`

---

## The 7 Questions

### Q1: Who was at fault in the accident?

- 🟢 Not my fault (other driver at fault)
- 🟡 Shared fault / unclear
- 🔴 I was at fault

*Scoring: Not at fault = +3 pts | Shared = +1 pt | At fault = -2 pts*

---

### Q2: What type of coverage did you have before the total loss?

- Full coverage (comprehensive + collision)
- Liability only
- I'm not sure

*Logic: Full coverage = likely a better risk profile for insurers*

---

### Q3: What kind of vehicle do you plan to replace it with?

- Sedan / compact car
- SUV or crossover
- Truck / pickup
- Sports car or performance vehicle
- Not sure yet

*Scoring: Sedan/compact = +2 | SUV/crossover = +1 | Truck = 0 | Sports = -2*

---

### Q4: What Texas city or zip code do you live in?

*(Free text or zip code field — used for geographic pricing tier)*

*Logic: Rates vary significantly by zip (Houston 77002 vs. rural West TX)*

---

### Q5: Have you had any other accidents or claims in the last 3 years?

- No other incidents
- 1 other minor incident
- 2 or more incidents

*Scoring: None = +3 | 1 minor = +1 | 2+ = -3*

---

### Q6: Is your new vehicle being financed or leased?

- Yes — I'm financing or leasing (lender will require full coverage)
- No — I'm paying cash

*Logic: Financed = mandatory full coverage = known premium range*

---

### Q7: What's your rough credit tier? (Texas carriers factor this in)

- Excellent (720+)
- Good (660–719)
- Fair (600–659)
- I'd rather not say

*Scoring: Excellent = +3 | Good = +1 | Fair = -1 | Rather not say = 0*

---

## Result Buckets

### 🟢 Score 8–12: "Great News — You Likely Qualify for Preferred Rates"

> "Based on your answers, you're in a strong position. Not-at-fault drivers with clean records
> typically qualify for preferred auto insurance rates in Texas — often lower than what they
> were paying before the accident.
>
> **Next step:** Get matched with a Texas licensed agent who specializes in replacement
> coverage after total loss. Takes 90 seconds."

**CTA:** `[Get My Quotes Now →]` → Triggers insurance opt-in + Voice AI callback

---

### 🟡 Score 3–7: "Standard Market — Here's How to Improve Your Rate"

> "Your profile lands in the standard market, which means you have options — but
> comparing 3+ carriers is especially important. The difference between the highest and
> lowest quote in your profile can be $80–$150/month.
>
> **Next step:** Let us show you which Texas carriers have the best rates for your specific situation."

**CTA:** `[Compare My Options →]` → Email capture → Drip sequence → Quote opt-in

---

### 🔴 Score below 3: "High-Risk Profile — Here's Your Best Path"

> "Your profile may show as higher-risk to standard carriers, but you have options.
> Texas has non-standard carriers who specialize in drivers who've had incidents.
> The key is knowing which ones to contact.
>
> **Next step:** Talk to a specialist who handles non-standard Texas auto insurance."

**CTA:** `[Find Specialist Carriers →]` → Non-standard aggregator routing

---

## Technical Build Spec

**Option A (Fastest):** Google Forms → Google Sheets → Apps Script score calculator → redirect to result page  
**Option B (Best UX):** Embedded JS quiz widget in the TTL website (Typeform-free alternative: Tally.so or custom HTML/CSS)  
**Option C (Ideal long-term):** Firebase-native quiz component with Firestore score tracking + automatic lead creation on result

**Recommended:** Start with Option A (zero cost, 2 hours to build), migrate to Option C after first 100 leads confirm the model works.

---

## Contact Capture Screen (Between Quiz and Results)

> "We're calculating your results — enter your name and best callback number and
> we'll send them to you plus connect you with a licensed agent if you want."

**Fields:**
- First name (required)
- Phone number (required — used for Voice AI callback)  
- Email (optional)
- `[TCPA consent checkbox]` — required before submitting

**On submit:** Creates Firestore document in `insurance_leads/` with `source: 'quiz'` and `score_bucket: 'preferred'|'standard'|'nonstandard'`.
