"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { submitPILead, type PILeadPayload } from "../../lib/firebase";
// ── Trust Panel Data ────────────────────────────────────────────────────────────
const STATS = [
  { value: "$2.8M+", label: "Recovered for Clients" },
  { value: "48hr", label: "Avg. Attorney Match" },
  { value: "100%", label: "Free Evaluation" },
];

const FUNNEL_STEPS = [
  { num: "01", title: "Tell Us What Happened", desc: "No phone calls required." },
  { num: "02", title: "We Score Your Case", desc: "AI analyzes liability and damages." },
  { num: "03", title: "Attorney Match", desc: "Qualified PI firms reach out." },
];

// ── Step Definitions ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Damages" },
  { id: 2, label: "Accident Details" },
  { id: 3, label: "Injuries" },
  { id: 4, label: "Insurance" },
  { id: 5, label: "Contact" },
];

const INITIAL_FORM: Record<string, unknown> = {
  vehicleStatus: "",     // total_loss, major_damage, minor
  estimatedDamages: 0,
  hasPhotos: "",
  accidentType: "",      // mvc, commercial, rideshare
  atFaultParty: "",      // other, shared, unknown
  policeReportFiled: "",
  isInjured: "",         // yes, no
  hadErVisit: false,
  injuryDescription: "",
  insuranceCarrier: "",
  hasUIM: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  tcpaConsent: false,
};

function IntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from URL param if needed
  useEffect(() => {
    const type = searchParams.get("type");
    if (type) setForm((f) => ({ ...f, accidentType: type }));
  }, [searchParams]);

  const update = (key: string, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return !!form.vehicleStatus && (form.estimatedDamages as number) >= 0;
      case 2: return !!form.accidentType && !!form.atFaultParty;
      case 3: return !!form.isInjured && (form.isInjured === "no" || !!form.injuryDescription);
      case 4: return !!form.insuranceCarrier;
      case 5: return !!form.firstName && !!form.phone && !!form.email && !!form.tcpaConsent;
      default: return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        voice_eligible: !!(form.tcpaConsent && form.phone),
        policeReportFiled: form.policeReportFiled === "yes",
        policeReportStatus: form.policeReportFiled === "yes" ? "filed" : form.policeReportFiled === "not_ready" ? "pending" : "none",
      } as PILeadPayload;
      const leadId = await submitPILead(payload);
      router.push(`/intake/confirmation?id=${leadId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Nav */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Free Claim Evaluation
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: "1100px", paddingTop: "5rem" }}>
        
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* ── LEFT: Trust & Education Panel ─────────────────────────────────── */}
          <div className="hidden-mobile" style={{ flex: "1", minWidth: "300px", position: "sticky", top: "6rem" }}>
            <div className="hero-eyebrow" style={{ marginBottom: "1rem" }}>🔒 100% Confidential</div>
            <h1 className="text-3xl font-extrabold" style={{ marginBottom: "1rem", lineHeight: "1.2" }}>
              Maximize Your Case Value
            </h1>
            <p className="text-secondary text-sm" style={{ marginBottom: "2rem" }}>
              Insurance companies use algorithms to minimize your payout. Our evaluation helps you find hidden injuries and property damage value.
            </p>

            <div className="card" style={{ marginBottom: "1.5rem", padding: "1.5rem", background: "var(--surface-overlay)", border: "1px solid var(--surface-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-accent)" }}>{s.value}</div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: "1.5rem", background: "var(--surface-overlay)", border: "1px solid var(--surface-border)" }}>
              <h3 className="text-sm font-bold" style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>How It Works</h3>
              {FUNNEL_STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: i < 2 ? "1rem" : "0" }}>
                  <div style={{ color: "var(--color-accent)", fontWeight: 800, fontSize: "0.8rem", marginTop: "2px" }}>{step.num}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{step.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Interactive Form ───────────────────────────────────────── */}
          <div style={{ flex: "1.5", minWidth: "350px", width: "100%" }}>
            
            {/* Mobile Header */}
            <div className="mobile-only" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h1 className="text-2xl font-extrabold" style={{ marginBottom: "0.5rem" }}>Total Loss & Claim Review</h1>
              <p className="text-secondary text-sm">Step {step} of {STEPS.length} — evaluate your property damage and see what your case is worth.</p>
            </div>

            {/* Step Indicator */}
            <div className="step-indicator" style={{ marginBottom: "2.5rem" }}>
              {STEPS.map((s, i) => (
                <div key={s.id} className="step" style={{ flex: i < STEPS.length - 1 ? "1" : "0" }}>
                  <div className={`step-circle ${step === s.id ? "active" : step > s.id ? "completed" : ""}`}
                    style={{ border: step === s.id ? "2px solid var(--color-accent)" : step > s.id ? "2px solid var(--color-success)" : "2px solid var(--surface-border)", transform: step === s.id ? "scale(1.1)" : "scale(1)" }}>
                    {step > s.id ? "✓" : s.id}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`step-line ${step > s.id ? "completed" : ""}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form Card */}
            <div className="card" style={{ padding: "2.5rem", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", border: "1px solid var(--surface-border)" }}>

          {/* ── Step 1: Damages ──────────────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold" style={{ marginBottom: "1.5rem" }}>What happened to your vehicle?</h2>
              
              <div className="form-group">
                <label className="form-label">Current Vehicle Status</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { val: "total_loss", label: "💥 It's a Total Loss", desc: "Insurance confirmed or it's obvious." },
                    { val: "major_damage", label: "⚠️ Major Damage", desc: "Not drivable, needs heavy repair." },
                    { val: "minor_damage", label: "🚗 Minor Damage", desc: "Drivable, mostly cosmetic." },
                  ].map((opt) => (
                    <button key={opt.val} onClick={() => update("vehicleStatus", opt.val)}
                      style={{
                        padding: "1rem", borderRadius: "8px", fontFamily: "inherit", textAlign: "left",
                        border: `2px solid ${form.vehicleStatus === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.vehicleStatus === opt.val ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem"
                      }}>
                      <div style={{ fontWeight: 700, minWidth: "160px" }}>{opt.label}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Estimated Vehicle Value or Repair Cost</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }}>$</span>
                  <input type="number" className="form-input" min={0} style={{ paddingLeft: "2rem" }}
                    value={form.estimatedDamages as number || ""}
                    onChange={(e) => update("estimatedDamages", parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 15000" />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Do you have photos of the damage?</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {["Yes", "No"].map((opt) => (
                    <button key={opt} onClick={() => update("hasPhotos", opt)}
                      style={{
                        flex: 1, padding: "0.75rem", borderRadius: "8px", fontFamily: "inherit",
                        border: `2px solid ${form.hasPhotos === opt ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.hasPhotos === opt ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Accident Details ──────────────────────────────────── */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold" style={{ marginBottom: "1.5rem" }}>How did the accident happen?</h2>
              
              <div className="form-group">
                <label className="form-label">What type of vehicle hit you?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { val: "commercial", label: "🚛 Commercial / 18-Wheeler", boost: true },
                    { val: "rideshare", label: "📱 Rideshare (Uber/Lyft)" },
                    { val: "mvc", label: "🚗 Standard Passenger Car" },
                  ].map((opt) => (
                    <button key={opt.val} onClick={() => update("accidentType", opt.val)}
                      style={{
                        padding: "1rem", borderRadius: "8px", fontFamily: "inherit", textAlign: "left",
                        border: `2px solid ${form.accidentType === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.accidentType === opt.val ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", position: "relative"
                      }}>
                      <div style={{ fontWeight: 600 }}>{opt.label}</div>
                      {opt.boost && <span className="badge badge-gold" style={{ position: "absolute", top: "0.8rem", right: "1rem", fontSize: "0.6rem" }}>High Policy Limits</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Who was at fault?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                  {[
                    { val: "other_driver", label: "100% The Other Driver" },
                    { val: "shared", label: "Shared Fault / Unsure" },
                    { val: "me", label: "I Was Found At Fault" },
                  ].map((opt) => (
                    <button key={opt.val} onClick={() => update("atFaultParty", opt.val)}
                      style={{
                        flex: 1, minWidth: "160px", padding: "0.75rem", borderRadius: "8px", fontFamily: "inherit",
                        border: `2px solid ${form.atFaultParty === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.atFaultParty === opt.val ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Were the Police called to the scene?</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {[
                    { val: "yes", label: "Yes - Report Filed" },
                    { val: "not_ready", label: "Yes - But Not Ready" },
                    { val: "no", label: "No / Private Info Exchange" },
                  ].map((opt) => (
                    <button key={opt.val} onClick={() => update("policeReportFiled", opt.val)}
                      style={{
                        flex: 1, padding: "0.75rem", borderRadius: "8px", fontFamily: "inherit",
                        border: `2px solid ${form.policeReportFiled === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.policeReportFiled === opt.val ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", textAlign: "center"
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Injuries ──────────────────────────────────────────── */}
          {step === 3 && (
            <div>
               <div style={{ textAlign: "center", marginBottom: "2rem", padding: "1.5rem", background: "rgba(200,169,81,0.1)", border: "1px solid var(--color-accent)", borderRadius: "12px" }}>
                 <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🤕</div>
                 <h2 className="text-xl font-bold">Did you suffer any injuries?</h2>
                 <p className="text-secondary text-sm" style={{ marginTop: "0.5rem" }}>
                   Property damage is only half the story. If you or your passengers were hurt, your case value could increase significantly.
                 </p>
               </div>

               <div className="form-group" style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                  {[
                    { val: "yes", label: "Yes, I was injured" },
                    { val: "no", label: "No, just shaken up" },
                  ].map((opt) => (
                    <button key={opt.val} onClick={() => update("isInjured", opt.val)}
                      style={{
                        flex: 1, padding: "1rem", borderRadius: "8px", fontFamily: "inherit",
                        border: `2px solid ${form.isInjured === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.isInjured === opt.val ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, fontSize: "1rem",
                      }}>
                      {opt.label}
                    </button>
                  ))}
               </div>

               {form.isInjured === "yes" && (
                 <div className="animate-fade-in-up">
                    <div className="form-group">
                      <label className="form-label">Have you sought medical treatment yet?</label>
                      <div style={{ display: "flex", gap: "1rem" }}>
                        {[{ val: true, label: "Yes (ER/Urgent Care)" }, { val: false, label: "No / Doing it later" }].map((opt) => (
                          <button key={String(opt.val)} onClick={() => update("hadErVisit", opt.val)}
                            style={{
                              flex: 1, padding: "0.75rem", borderRadius: "8px", fontFamily: "inherit",
                              border: `2px solid ${form.hadErVisit === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                              background: form.hadErVisit === opt.val ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                              color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
                            }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {form.hadErVisit === false && (
                        <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--color-warning)", padding: "0.75rem", background: "rgba(224,123,57,0.1)", borderRadius: "6px" }}>
                          ⚠️ Tip: Insurance companies use gaps in medical treatment to deny injury claims. See a doctor as soon as possible.
                        </p>
                      )}
                    </div>
                    
                    <div className="form-group" style={{ marginTop: "1.5rem" }}>
                      <label className="form-label">Briefly describe what hurts:</label>
                      <textarea className="form-input" rows={3} value={form.injuryDescription as string}
                        onChange={(e) => update("injuryDescription", e.target.value)}
                        placeholder="e.g. Neck stiffness, back pain, headaches..."
                        style={{ resize: "vertical" }} />
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* ── Step 4: Insurance ─────────────────────────────────────────── */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold" style={{ marginBottom: "1.5rem" }}>Insurance Details</h2>
              <div className="form-group">
                <label className="form-label">The At-Fault Party's Insurance Carrier</label>
                <input type="text" className="form-input"
                  value={form.insuranceCarrier as string}
                  onChange={(e) => update("insuranceCarrier", e.target.value)}
                  placeholder="e.g. State Farm, GEICO, Progressive..." />
              </div>
              <div className="form-group" style={{ marginTop: "1.5rem" }}>
                <label className="form-label">Do you hold Uninsured/Underinsured (UM/UIM) coverage on your own policy?</label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  {["Yes", "No", "Not Sure"].map((opt) => (
                    <button key={opt} onClick={() => update("hasUIM", opt)}
                      style={{
                        flex: 1, padding: "0.75rem", borderRadius: "8px", fontFamily: "inherit",
                        border: `2px solid ${form.hasUIM === opt ? "var(--color-accent)" : "var(--surface-border)"}`,
                        background: form.hasUIM === opt ? "rgba(200,169,81,0.1)" : "var(--surface-overlay)",
                        color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Contact ───────────────────────────────────────────── */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold" style={{ marginBottom: "0.5rem" }}>Your contact information</h2>
              <p className="text-secondary text-sm" style={{ marginBottom: "1.5rem" }}>
                Your information is confidential and shared only with attorneys you match with.
              </p>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" value={form.firstName as string}
                    onChange={(e) => update("firstName", e.target.value)} placeholder="Jane" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" value={form.lastName as string}
                    onChange={(e) => update("lastName", e.target.value)} placeholder="Smith" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={form.phone as string}
                  onChange={(e) => update("phone", e.target.value)} placeholder="(512) 555-0100" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={form.email as string}
                  onChange={(e) => update("email", e.target.value)} placeholder="jane@email.com" />
              </div>

              {/* TCPA Consent */}
              <div style={{ background: "var(--surface-overlay)", borderRadius: "8px", padding: "1rem", marginTop: "0.5rem" }}>
                <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" checked={!!form.tcpaConsent}
                    onChange={(e) => update("tcpaConsent", e.target.checked)}
                    style={{ marginTop: "3px", width: "16px", height: "16px", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    By submitting, I consent to be contacted at the phone number provided, including by automated 
                    dialing, text messages, and/or pre-recorded messages, regarding my case evaluation. Standard 
                    message and data rates may apply. I understand this is not a condition of any purchase.
                  </span>
                </label>
              </div>
              {error && (
                <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(217,64,64,0.1)", borderRadius: "8px", color: "var(--color-danger)", fontSize: "0.875rem" }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: "1rem" }}>
            {step > 1 ? (
              <button className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
                ← Back
              </button>
            ) : <div />}

            {step < STEPS.length ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  canProceed() && setStep((s) => s + 1);
                }}
                disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.5 }}>
                Continue →
              </button>
            ) : (
              <button
                className="btn btn-primary animate-pulse-glow"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                style={{ opacity: loading || !canProceed() ? 0.7 : 1 }}>
                {loading ? "Submitting..." : "Submit My Case →"}
              </button>
            )}
          </div>
        </div>

        {/* Trust Indicators Background */}
        <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", opacity: 0.7 }}>
          {["🔒 Secure & Encrypted", "⚡ Real-Time Auto Match", "⚖️ 100% Free Service"].map((t) => (
            <span key={t} style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{t}</span>
          ))}
        </div>

        </div> {/* End Right Column */}
        </div> {/* End Flex Row */}
      </div>
    </main>
  );
}

export default function IntakePage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-secondary)" }}>Loading intake form...</div>
      </main>
    }>
      <IntakeContent />
    </Suspense>
  );
}
