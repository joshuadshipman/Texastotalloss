"use client";
import { useState, useRef } from "react";
import Link from "next/link";

// ── Trust Panel Data ────────────────────────────────────────────────────────────
const STATS = [
  { value: "$2.8M+", label: "Recovered for Clients" },
  { value: "48hr", label: "Avg. Attorney Match" },
  { value: "100%", label: "Free Evaluation" },
];

const FUNNEL_STEPS = [
  { num: "01", title: "Upload Photos", desc: "No phone calls required." },
  { num: "02", title: "AI Damage Scan", desc: "Instantly analyze the severity." },
  { num: "03", title: "Case Valuation", desc: "See your total settlement potential." },
];

interface AnalysisResult {
  vehicle: { year: string; make: string; model: string; trim: string; confidence: string };
  damage: { severity: string; areas: string[]; estimatedRepairCost: { low: number; high: number }; isTotalLoss: boolean };
  acv: { low: number; mid: number; high: number; factors: string[] };
  recommendation: { shouldDispute: boolean; negotiationPoints: string[]; possibleInjuryCase: boolean; injuryIndicators: string[] };
}

export default function ACVQuizPage() {
  const [step, setStep] = useState<"info" | "upload" | "analyzing" | "results">("info");
  const [vehicleInfo, setVehicleInfo] = useState({ year: "", make: "", model: "", mileage: "", injured: false });
  const [photos, setPhotos] = useState<File[]>([]);
  const [policeReport, setPoliceReport] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 5 - photos.length);
    setPhotos((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setStep("analyzing");
    setError(null);

    const formData = new FormData();
    photos.forEach((photo) => formData.append("photos", photo));
    if (policeReport) formData.append("policeReport", policeReport);
    if (vehicleInfo.year) formData.append("year", vehicleInfo.year);
    if (vehicleInfo.make) formData.append("make", vehicleInfo.make);
    if (vehicleInfo.model) formData.append("model", vehicleInfo.model);
    if (vehicleInfo.mileage) formData.append("mileage", vehicleInfo.mileage);
    if (vehicleInfo.injured) formData.append("injured", "true");

    try {
      const res = await fetch("/api/acv/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.analysis);
      setStep("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("upload");
    }
  };

  const fmt = (n: number) => n ? `$${n.toLocaleString()}` : "N/A";

  return (
    <main style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <Link href="/total-loss" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none" }}>
            ← Total Loss Guides
          </Link>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: "1100px", paddingTop: "5rem", paddingBottom: "4rem" }}>
        
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          
          {/* ── LEFT: Trust & Education Panel ─────────────────────────────────── */}
          <div className="hidden-mobile" style={{ flex: "1", minWidth: "300px", position: "sticky", top: "6rem" }}>
            <div className="hero-eyebrow" style={{ marginBottom: "1rem" }}>🤖 Autonomous Valuation Audit</div>
            <h1 className="text-3xl font-extrabold" style={{ marginBottom: "1rem", lineHeight: "1.2" }}>
              ACV Reality Check
            </h1>
            <p className="text-secondary text-sm" style={{ marginBottom: "2rem" }}>
              Upload photos of your vehicle. Our AI analyzes damage severity, identifies your vehicle, and estimates the real market value — in under 60 seconds.
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

          {/* ── RIGHT: Interactive Panel ───────────────────────────────────────── */}
          <div style={{ flex: "1.5", minWidth: "350px", width: "100%" }}>
            
            {/* Mobile Header */}
            <div className="mobile-only" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div className="hero-eyebrow">🔍 Autonomous Valuation Audit</div>
              <h1 className="text-3xl font-extrabold" style={{ marginBottom: "0.75rem" }}>
                ACV Reality Check
              </h1>
              <p className="text-secondary text-sm">
                Upload photos of your vehicle. Our AI estimates the real market value in under 60 seconds.
              </p>
            </div>

        {/* Step 1: Vehicle Info */}
        {step === "info" && (
          <div className="card" style={{ padding: "2rem" }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: "1.5rem" }}>Vehicle Information (Optional)</h2>
            <p className="text-secondary text-sm" style={{ marginBottom: "1.5rem" }}>
              Adding details improves accuracy, but our AI can identify most vehicles from photos alone.
            </p>
            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Year</label>
                <input type="text" className="form-input" placeholder="e.g. 2021"
                  value={vehicleInfo.year} onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Make</label>
                <input type="text" className="form-input" placeholder="e.g. Toyota"
                  value={vehicleInfo.make} onChange={(e) => setVehicleInfo({ ...vehicleInfo, make: e.target.value })} />
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
              <div className="form-group">
                <label className="form-label">Model</label>
                <input type="text" className="form-input" placeholder="e.g. Camry"
                  value={vehicleInfo.model} onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Mileage</label>
                <input type="text" className="form-input" placeholder="e.g. 45000"
                  value={vehicleInfo.mileage} onChange={(e) => setVehicleInfo({ ...vehicleInfo, mileage: e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "1.5rem", padding: "1rem", background: "var(--surface-overlay)", borderRadius: "8px", border: "1px solid var(--surface-border)" }}>
               <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", margin: 0 }}>
                 <input type="checkbox" checked={vehicleInfo.injured} onChange={(e) => setVehicleInfo({ ...vehicleInfo, injured: e.target.checked })} style={{ width: "20px", height: "20px" }} />
                 <span>Were you or any passengers injured in the accident?</span>
               </label>
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setStep("upload")}>
              Next: Upload Photos →
            </button>
          </div>
        )}

        {/* Step 2: Photo Upload */}
        {step === "upload" && (
          <div className="card" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(200,169,81,0.1)", padding: "1rem", borderRadius: "8px", borderLeft: "4px solid var(--color-accent)", marginBottom: "1.5rem" }}>
              <p style={{ fontWeight: 600, color: "var(--color-accent)", marginBottom: "0.5rem" }}>Important: What We Need</p>
              <p className="text-secondary text-sm">
                In order to properly condition the vehicle and ensure any deductions taken by insurance are accurate, please upload photos of the <strong>exterior damage, interior condition, dashboard mileage, and the VIN plate.</strong>
              </p>
            </div>

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--surface-border)",
                borderRadius: "12px",
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "1.5rem",
                background: "var(--surface-overlay)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📸</div>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Click to upload photos</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>JPG, PNG — up to 5 photos</div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoAdd(e.target.files)}
                style={{ display: "none" }}
              />
            </div>

            {/* Photo Previews */}
            {previews.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "1" }}>
                    <img src={src} alt={`Vehicle photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => removePhoto(i)}
                      style={{
                        position: "absolute", top: "4px", right: "4px",
                        background: "rgba(0,0,0,0.7)", color: "white", border: "none",
                        borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer",
                        fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            <hr style={{ borderColor: "var(--surface-border)", margin: "1.5rem 0" }} />

            {/* Optional Police Report */}
            <h3 className="text-lg font-bold" style={{ marginBottom: "1rem" }}>Upload Police Report (Optional)</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: "1rem" }}>
              If you have the accident crash report, upload it here so we can include fault analysis.
            </p>
            <div
              onClick={() => reportInputRef.current?.click()}
              style={{
                border: "2px dashed var(--surface-border)",
                borderRadius: "12px",
                padding: "1.5rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "1.5rem",
                background: "var(--surface-overlay)",
                borderColor: policeReport ? "var(--color-accent)" : "var(--surface-border)"
              }}
            >
              {policeReport ? (
                <div style={{ color: "var(--color-accent)", fontWeight: 600 }}>📄 {policeReport.name} selected</div>
              ) : (
                <>
                  <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>📄 Upload Police Report</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>PDF, JPG, or PNG</div>
                </>
              )}
              <input
                ref={reportInputRef}
                type="file"
                accept="application/pdf, image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) setPoliceReport(e.target.files[0]);
                }}
                style={{ display: "none" }}
              />
            </div>

            {error && (
              <div style={{ padding: "0.75rem", background: "rgba(217,64,64,0.1)", borderRadius: "8px", color: "var(--color-danger)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep("info")}>← Back</button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, opacity: photos.length === 0 ? 0.5 : 1 }}
                disabled={photos.length === 0}
                onClick={handleAnalyze}
              >
                Analyze My Vehicle ({photos.length} photo{photos.length !== 1 ? "s" : ""}) →
              </button>
            </div>

            {/* The Marketing PI Hook (Bait & Switch) */}
            <div className="card" style={{ marginTop: "2.5rem", background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))", color: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--color-accent)" }}>
              <h3 className="text-lg font-bold" style={{ marginBottom: "0.5rem", color: "white" }}>Want a Better Option? ⚡</h3>
              <p style={{ fontSize: "0.95rem", marginBottom: "1.5rem", opacity: 0.9 }}>
                Our vehicle valuations are only estimates. The best way to actually argue your case and fight back against insurance companies is to <strong>let us value your full accident case</strong> (including bodily injury). 
                <br/><br/>
                Your entire case could be worth <strong>$10,000 or more</strong> when factoring in medical treatments and pain & suffering.
              </p>
              <Link href="/intake" className="btn btn-secondary" style={{ width: "100%", background: "white", color: "var(--color-primary)", fontWeight: 800 }}>
                Value My Full Case Instead →
              </Link>
            </div>
          </div>
        )}

        {/* Step 3: Analyzing */}
        {step === "analyzing" && (
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "pulse 1.5s infinite" }}>🔍</div>
            <h2 className="text-xl font-bold" style={{ marginBottom: "0.75rem" }}>Analyzing Your Vehicle...</h2>
            <p className="text-secondary">Our AI is reviewing your photos, identifying your vehicle, and calculating real market value.</p>
            <div style={{ marginTop: "1.5rem", height: "4px", background: "var(--surface-border)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: "60%", height: "100%", background: "var(--color-accent)", borderRadius: "2px", animation: "loading 2s ease-in-out infinite" }} />
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === "results" && result && (
          <div>
            {/* Vehicle ID */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div className="hero-eyebrow" style={{ marginBottom: "1rem" }}>Vehicle Identified</div>
              <h2 className="text-2xl font-extrabold">
                {result.vehicle.year} {result.vehicle.make} {result.vehicle.model} {result.vehicle.trim}
              </h2>
              <span className="badge" style={{ marginTop: "0.5rem" }}>Confidence: {result.vehicle.confidence}</span>
            </div>

            {/* Damage Assessment */}
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h3 className="text-lg font-bold" style={{ marginBottom: "1rem" }}>Damage Assessment</h3>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <span className={`badge ${result.damage.severity === "Total Loss" ? "badge-gold" : ""}`}>
                  {result.damage.severity}
                </span>
                {result.damage.isTotalLoss && <span className="badge badge-gold">⚠️ Likely Total Loss</span>}
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                <strong>Areas affected:</strong> {result.damage.areas?.join(", ") || "N/A"}
              </div>
              {result.damage.estimatedRepairCost && (
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                  <strong>Estimated repair:</strong> {fmt(result.damage.estimatedRepairCost.low)} — {fmt(result.damage.estimatedRepairCost.high)}
                </div>
              )}
            </div>

            {/* ACV Range */}
            <div className="card" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <h3 className="text-lg font-bold" style={{ marginBottom: "1rem" }}>Your Vehicle&apos;s Estimated Value</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "1rem" }}>
                <div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Low</div><div className="text-xl font-bold">{fmt(result.acv.low)}</div></div>
                <div><div style={{ fontSize: "0.75rem", color: "var(--color-accent)" }}>Mid (Fair Market)</div><div className="text-2xl font-extrabold" style={{ color: "var(--color-accent)" }}>{fmt(result.acv.mid)}</div></div>
                <div><div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>High</div><div className="text-xl font-bold">{fmt(result.acv.high)}</div></div>
              </div>
              {result.acv.factors && (
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Factors: {result.acv.factors.join(" • ")}
                </div>
              )}
            </div>

            {/* Injury Pivot (Removing Dispute Focus) */}
            <div className="card" style={{ marginBottom: "1.5rem", background: "rgba(224,123,57,0.1)", borderLeft: "4px solid var(--color-warning)" }}>
              <h3 className="text-lg font-bold" style={{ marginBottom: "0.5rem" }}>⚠️ Important: Prioritize Your Treatment</h3>
              <p className="text-secondary text-sm" style={{ marginBottom: "1rem" }}>
                While the property damage is extensive, the real value of your claim lies in your health and medical recovery. 
                Insurance companies use gaps in treatment to deny claims. **Do not delay seeing a doctor.**
              </p>
              {result.recommendation.possibleInjuryCase && (
                <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  <em>AI detected high-impact indicators: {result.recommendation.injuryIndicators?.join(", ")}.</em>
                </div>
              )}
              <Link href="/intake" className="btn btn-primary" style={{ width: "100%" }}>
                Secure Injury Representation & Treatment →
              </Link>
            </div>
          </div>
        )}
        {/* Trust Indicators Background */}
        <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", opacity: 0.7 }}>
          {["🔒 Secure Upload", "⚡ AI Vision Scan", "⚖️ 100% Free Audit"].map((t) => (
            <span key={t} style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>{t}</span>
          ))}
        </div>

        </div> {/* End Right Column */}
        </div> {/* End Flex Row */}
      </div>

      <style jsx>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes loading { 0% { width: 10%; } 50% { width: 80%; } 100% { width: 10%; } }
      `}</style>
    </main>
  );
}
