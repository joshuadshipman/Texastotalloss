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
  const [step, setStep] = useState<"info" | "condition" | "upload" | "analyzing" | "results">("info");
  const [vehicleInfo, setVehicleInfo] = useState<{year:string;make:string;model:string;mileage:string;condition:string;injured:boolean|null}>({ year: "", make: "", model: "", mileage: "", condition: "normal", injured: null });
  const [photos, setPhotos] = useState<File[]>([]);
  const [policeReport, setPoliceReport] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 8 - photos.length);
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
    if (vehicleInfo.condition) formData.append("condition", vehicleInfo.condition);
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
            <div className="hero-eyebrow" style={{ marginBottom: "1rem" }}>⚖️ Expert-Led Valuation Audit</div>
            <h1 className="text-3xl font-extrabold" style={{ marginBottom: "1rem", lineHeight: "1.2" }}>
              ACV Reality Check
            </h1>
            <p className="text-secondary text-sm" style={{ marginBottom: "2rem" }}>
              Our specialists review your specific vehicle conditioning and accident facts against our network of validated market data. We reject lowball algorithms with real human-vetted evidence.
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
              <h3 className="text-sm font-bold" style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>Our Audit Process</h3>
              {[
                { num: "01", title: "Detail Verification", desc: "We track interior condition and mileage specifics." },
                { num: "02", title: "Fact-Based Audit", desc: "Your data is compared against local Texas retail shifts." },
                { num: "03", title: "Advocacy Plan", desc: "Matched with a specialist aligned to your specific recovery goals." },
              ].map((step, i) => (
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
              <div className="hero-eyebrow">📋 Expert-Led Valuation Audit</div>
              <h1 className="text-3xl font-extrabold" style={{ marginBottom: "0.75rem" }}>
                ACV Reality Check
              </h1>
              <p className="text-secondary text-sm">
                Share your vehicle specifics. Our specialists analyze conditioning and mileage against the insurance algorithm to find your missing settlement value.
              </p>
            </div>

        {/* Step 1: Basic Info */}
        {step === "info" && (
          <div className="card" style={{ padding: "2rem" }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: "1.5rem" }}>Vehicle Information</h2>
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
                <input type="number" className="form-input" placeholder="e.g. 45000" inputMode="numeric"
                  value={vehicleInfo.mileage} onChange={(e) => setVehicleInfo({ ...vehicleInfo, mileage: e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
               <label className="form-label">Were you or any passengers injured?</label>
               <div style={{ display: "flex", gap: "1rem" }}>
                 <button 
                   type="button"
                   style={{ 
                     flex: 1, padding: "1.25rem", borderRadius: "8px", fontWeight: 800, cursor: "pointer",
                     border: `2px solid ${vehicleInfo.injured ? "var(--color-warning)" : "var(--surface-border)"}`,
                     background: vehicleInfo.injured ? "rgba(224,123,57,0.15)" : "var(--surface-overlay)",
                     color: vehicleInfo.injured ? "var(--color-warning)" : "var(--text-secondary)",
                     transition: "all 0.2s"
                   }}
                   onClick={() => setVehicleInfo({ ...vehicleInfo, injured: true })}
                 >
                   YES, HURT
                 </button>
                 <button 
                   type="button"
                   style={{ 
                     flex: 1, padding: "1.25rem", borderRadius: "8px", fontWeight: 800, cursor: "pointer",
                     border: `2px solid ${vehicleInfo.injured === false ? "var(--color-accent)" : "var(--surface-border)"}`,
                     background: vehicleInfo.injured === false ? "rgba(200,169,81,0.15)" : "var(--surface-overlay)",
                     color: vehicleInfo.injured === false ? "var(--color-accent)" : "var(--text-secondary)",
                     transition: "all 0.2s"
                   }}
                   onClick={() => setVehicleInfo({ ...vehicleInfo, injured: false })}
                 >
                   JUST PROPERTY
                 </button>
               </div>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: "100%", height: "4rem", fontSize: "1.1rem" }} 
              disabled={vehicleInfo.injured === null || !vehicleInfo.year || !vehicleInfo.make}
              onClick={() => setStep("condition")}
            >
              Continue to Interior Audit →
            </button>
          </div>
        )}

        {/* Step 2: Interior Conditioning */}
        {step === "condition" && (
          <div className="card" style={{ padding: "2rem" }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: "1.5rem" }}>Interior Conditioning</h2>
            <p className="text-secondary text-sm" style={{ marginBottom: "1.5rem" }}>
              The interior condition has a massive impact on Fair Market Value. Be as accurate as possible.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { val: "pristine", label: "🏆 Pristine / Like New", desc: "No stains, no smells, perfectly clean." },
                { val: "normal", label: "🏠 Daily Driver / Normal Wear", desc: "Typical minor wear, no major damage." },
                { val: "significant", label: "⚠️ Significant Wear", desc: "Minor stains, small tears, or heavy use." },
                { val: "major", label: "🛠️ Major Condition Issues", desc: "Large stains, ripped seats, or structural issues." },
              ].map((opt) => (
                <button 
                  key={opt.val}
                  onClick={() => setVehicleInfo({ ...vehicleInfo, condition: opt.val })}
                  style={{ 
                    padding: "1.25rem", borderRadius: "12px", textAlign: "left", cursor: "pointer",
                    border: `2px solid ${vehicleInfo.condition === opt.val ? "var(--color-accent)" : "var(--surface-border)"}`,
                    background: vehicleInfo.condition === opt.val ? "rgba(200,169,81,0.05)" : "var(--surface-overlay)",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontWeight: 800, color: vehicleInfo.condition === opt.val ? "var(--text-primary)" : "var(--text-secondary)", marginBottom: "0.25rem" }}>{opt.label}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{opt.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep("info")}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep("upload")}>Continue to Photo Audit →</button>
            </div>
          </div>
        )}

        {/* Step 3: Photo Evidence */}
        {step === "upload" && (
          <div className="card" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(200,169,81,0.1)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(200,169,81,0.2)", marginBottom: "2rem" }}>
              <p style={{ fontWeight: 800, color: "var(--color-accent)", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Specialist Audit Required</p>
              <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>
                Our team reviews these photos manually against local Texas comps to disprove the insurer&apos;s low valuation. Focus on areas of high wear or upgrades.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Odometer", icon: "📊", desc: "Mileage Proof" },
                { label: "VIN Tag", icon: "🆔", desc: "Official ID" },
                { label: "Upholstery", icon: "💺", desc: "Condition Proof" },
                { label: "Damage", icon: "💥", desc: "Impact View" },
              ].map((item) => (
                <div key={item.label} style={{ background: "var(--surface-overlay)", border: "1px solid var(--surface-border)", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
                   <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                   <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{item.label}</div>
                   <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--color-accent)",
                borderRadius: "16px",
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "1.5rem",
                background: "rgba(200,169,81,0.05)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📸</div>
              <div style={{ fontWeight: 800, marginBottom: "0.25rem", color: "var(--color-accent)" }}>Take or Select Photos</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Min. 3 photos required for Audit</div>
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

            {error && (
              <div style={{ padding: "0.75rem", background: "rgba(217,64,64,0.1)", borderRadius: "8px", color: "var(--color-danger)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-secondary" onClick={() => setStep("condition")}>← Back</button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, opacity: photos.length < 3 ? 0.5 : 1 }}
                disabled={photos.length < 3}
                onClick={handleAnalyze}
              >
                Submit for Expert Audit →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Analyzing */}
        {step === "analyzing" && (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <div className="loader" style={{ width: "60px", height: "60px", margin: "0 auto 2rem", border: "4px solid var(--surface-border)", borderTopColor: "var(--color-accent)", borderRadius: "50%", animation: "loading 1.5s infinite linear" }}></div>
            <h2 className="text-2xl font-bold" style={{ marginBottom: "1rem" }}>Analyzing Claim Facts</h2>
            <div className="text-secondary text-sm" style={{ maxWidth: "300px", margin: "0 auto", animation: "pulse 2s infinite" }}>
               Our engine is reviewing your mileage, interior conditioning, and accident history against our local Texas specialist network...
            </div>
          </div>
        )}

        {/* Step 5: Results */}
        {step === "results" && result && (
          <div>
            {/* Header Persona Shift */}
            <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "4px solid var(--color-accent)" }}>
              <div className="hero-eyebrow" style={{ marginBottom: "0.5rem" }}>Audit Complete</div>
              <h2 className="text-2xl font-extrabold" style={{ marginBottom: "0.5rem" }}>
                {result.vehicle.year} {result.vehicle.make} {result.vehicle.model}
              </h2>
              <p className="text-secondary text-sm">
                Case Facts: {vehicleInfo.mileage.toLocaleString()} miles • {vehicleInfo.condition.toUpperCase()} Condition
              </p>
            </div>

            {/* ACV Reality Check */}
            <div className="card" style={{ marginBottom: "1.5rem", textAlign: "center", padding: "2.5rem" }}>
               <h3 className="text-lg font-bold" style={{ marginBottom: "1.5rem" }}>Our Experts Recommend a Settlement of:</h3>
               <div className="text-4xl font-extrabold" style={{ color: "var(--color-accent)", marginBottom: "1rem" }}>
                 {fmt(result.acv.mid)}
               </div>
               <p className="text-secondary text-sm" style={{ maxWidth: "400px", margin: "0 auto" }}>
                 Based on your **{vehicleInfo.condition}** interior status and mileage, our network suggests this as the minimum retail value required to make you whole.
               </p>
            </div>

            {/* Advocacy Path */}
            <div className="card" style={{ 
              background: "var(--surface-overlay)", 
              border: "1px solid var(--surface-border)",
              padding: "2rem" 
            }}>
               <h3 className="text-xl font-bold" style={{ marginBottom: "1rem" }}>The Advocacy Network Plan</h3>
               <p className="text-secondary text-sm" style={{ marginBottom: "1.5rem" }}>
                 We have reviewed your details against the facts. To avoid leaving money on the table, we recommend a focused path:
               </p>
               
               <div style={{ marginBottom: "2rem" }}>
                 {result.recommendation.negotiationPoints.map((point, i) => (
                   <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                     <div style={{ color: "var(--color-accent)" }}>⚡</div>
                     <div>{point}</div>
                   </div>
                 ))}
               </div>

               <Link 
                 href={vehicleInfo.injured ? "/intake" : "/intake?intent=ACV_DISPUTE"} 
                 className="btn btn-primary" 
                 style={{ width: "100%", height: "4rem", fontSize: "1.1rem" }}
               >
                 Connect with a Case Specialist →
               </Link>
               
               <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1rem" }}>
                 No generic bots. You will be matched with a specialized firm in our network that reviews these facts manually.
               </p>
            </div>
          </div>
        )}

        {/* Trust Indicators Background */}
        <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", opacity: 0.7 }}>
          {["⚖️ Human-Vetted Evidence", "⚡ Expert Case Review", "🔒 Private & Secure"].map((t) => (
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
