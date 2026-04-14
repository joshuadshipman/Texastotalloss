"use client";
import Link from "next/link";

export default function JourneyPage() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Nav */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            The TTL Methodology
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: "1000px", paddingTop: "5rem" }}>
        
        <div style={{ textAlign: "center", marginBottom: "4rem", animation: "fade-in-up 0.5s ease-out" }}>
          <div className="hero-eyebrow" style={{ marginBottom: "1rem", display: "inline-block" }}>🗺️ System Architecture</div>
          <h1 className="text-4xl font-extrabold" style={{ marginBottom: "1rem", lineHeight: "1.2" }}>
            The Total Loss Dispute Journey
          </h1>
          <p className="text-secondary text-lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Insurance companies rely on confusion and fatigue to force you into accepting lowball settlement offers. Here is exactly how our platform systematically dismantles their strategy to recover the Actual Cash Value.
          </p>
        </div>

        {/* Infographic Container */}
        <div className="card" style={{ padding: "3rem", background: "var(--surface-overlay)", border: "1px solid var(--surface-border)", position: "relative" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem", position: "relative" }}>
            
            {/* Phase 1 */}
            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <div style={{ 
                width: "60px", height: "60px", borderRadius: "50%", background: "var(--color-accent)", 
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#000", flexShrink: 0,
                boxShadow: "0 0 20px rgba(200,169,81,0.4)", zIndex: 2
              }}>
                1
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", flex: 1 }}>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>The Act of God</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  An accident occurs, your vehicle is towed, and the insurance carrier formally declares it a "Total Loss." They use proprietary algorithms (like CCC One) to justify an offer typically 15-30% below market reality.
                </p>
              </div>
            </div>

            {/* Vertical Connecting Line */}
            <div style={{ position: "absolute", left: "29px", top: "40px", bottom: "40px", width: "2px", background: "linear-gradient(to bottom, var(--color-accent), rgba(200,169,81,0.1))", zIndex: 1 }} />

            {/* Phase 2 */}
            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
              <div style={{ 
                width: "60px", height: "60px", borderRadius: "50%", background: "var(--surface-overlay)", border: "2px solid var(--color-accent)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-accent)", flexShrink: 0
              }}>
                2
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", flex: 1 }}>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>The AI Baseline Audit</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1rem" }}>
                  Before you agree to anything, you enter our portal. The AI engine aggregates your vehicle's VIN, trim level, localized market anomalies (like truck shortages in DFW), and prior maintenance receipts.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px" }}>
                   <div style={{ borderLeft: "3px solid var(--color-warning)", paddingLeft: "1rem" }}>
                     <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)" }}>If Injured</div>
                     <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-primary)" }}>Full Protocol Active</div>
                     <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Direct legal prioritization to prevent statute clipping.</div>
                   </div>
                   <div style={{ borderLeft: "3px solid var(--color-success)", paddingLeft: "1rem" }}>
                     <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)" }}>If Property Only</div>
                     <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-primary)" }}>Streamlined Appraisal</div>
                     <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>We prune all medical questions to save you time.</div>
                   </div>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
               <div style={{ 
                width: "60px", height: "60px", borderRadius: "50%", background: "var(--surface-overlay)", border: "2px solid var(--color-accent)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-accent)", flexShrink: 0
              }}>
                3
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", flex: 1 }}>
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)", marginBottom: "0.5rem" }}>The Texas Appraisal Clause Execution</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                  By legally invoking the "Appraisal Clause" outlined in all Texas auto policies, you force the carrier to remove their internal adjuster and hire an independent third-party. Our independent appraisers counter their proprietary software with real-world comparables to bridge the settlement gap.
                </p>
              </div>
            </div>

            {/* Final CTA */}
            <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="text-2xl font-extrabold" style={{ marginBottom: "1.5rem" }}>Ready to execute this protocol?</h2>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Link href="/quiz" className="btn btn-primary btn-lg animate-pulse-glow">
                  Initialize Property Audit →
                </Link>
                <Link href="/intake" className="btn btn-secondary btn-lg">
                  Report Injury Claim
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
