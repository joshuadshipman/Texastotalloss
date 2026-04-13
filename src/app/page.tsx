"use client";
import Link from "next/link";
import { useState } from "react";
import AngelChatWidget from "@/components/AngelChatWidget";

// Removed STATS and STEPS to keep root purely informational

// ── Help Categories ─────────────────────────────────────────────────────────
const HELP_CATEGORIES = [
  { label: "ACV Dispute", icon: "💰", href: "/total-loss/acv-dispute", hot: true },
  { label: "GAP Insurance", icon: "🛡️", href: "/total-loss/gap-insurance" },
  { label: "Salvage & Copart", icon: "🏗️", href: "/total-loss/salvage-process" },
  { label: "AI Valuation Quiz", icon: "🤖", href: "/quiz" },
];

// ── FAQ (AEO-optimized) ───────────────────────────────────────────────────────
const FAQS = [
  {
    q: "How long do I have to file a personal injury claim in Texas?",
    a: "Texas has a 2-year statute of limitations for personal injury claims (Tex. Civ. Prac. & Rem. Code § 16.003). This clock starts the day of the accident. Missing this deadline permanently bars your claim — don't wait.",
  },
  {
    q: "What is my car accident case worth in Texas?",
    a: "Case value depends on four factors: liability (who was at fault), medical damages (ER visits, ongoing treatment), lost wages, and insurance policy limits. Commercial vehicle cases typically yield significantly higher settlements than standard MVC claims.",
  },
  {
    q: "Do I need a police report to file a personal injury claim?",
    a: "Not always, but it dramatically strengthens your case. A police report establishes fault at the scene, records witness information, and documents vehicle damage. If you didn't get one, you can still request a crash report from TxDOT within 10 days.",
  },
  {
    q: "What does 'total loss' mean for my insurance claim?",
    a: "A vehicle is declared a total loss in Texas when repair costs exceed its Actual Cash Value (ACV). Insurers use this to pay out market value minus your deductible. Many policyholders receive lowball ACV offers — you have the right to dispute the valuation.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main>
      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">
            Texas<span>Total</span>Loss
          </Link>
          <ul className="nav-links hidden-mobile">
            <li><Link href="/total-loss">Total Loss Guides</Link></li>
            <li><Link href="#faq">FAQ</Link></li>
            <li><Link href="/portal">Attorney Portal</Link></li>
          </ul>
          <Link href="/quiz" className="btn btn-primary hidden-mobile">
            Free ACV Audit →
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container">
          <div className="hero-grid">
            <div className="animate-fade-in-up">
              <div className="hero-eyebrow">
                🚗 Texas Total Loss Support Network
              </div>
              <h1 className="hero-title">
                Totaled Your Car?<br />
                <span className="highlight">Don't Get Lowballed.</span>
              </h1>
              <p className="hero-subtitle">
                Is the insurance company offering less than your car is worth? Our AI-powered platform helps you determine your True Actual Cash Value, dispute low offers, and uncover hidden compensation for injuries — all completely free.
              </p>
              <div className="hero-cta-group">
                <Link href="/quiz" className="btn btn-primary btn-lg animate-pulse-glow">
                  Start Free ACV Audit →
                </Link>
                <Link href="sms:+19723099156" className="btn btn-secondary btn-lg">
                  💬 Text Angel for Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Removed Stats Section ── */}

      {/* ── Guidance Categories ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="text-3xl font-extrabold" style={{ marginBottom: "1rem" }}>
              Total Loss Resources
            </h2>
            <p className="text-secondary" style={{ maxWidth: "520px", margin: "0 auto" }}>
              Navigating a totaled vehicle claim in Texas is complicated. Start here.
            </p>
          </div>
          <div className="grid-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            {HELP_CATEGORIES.map((type, i) => (
              <Link key={i} href={type.href} className="card" style={{ textAlign: "center", position: "relative" }}>
                {type.hot && (
                  <span className="badge badge-platinum" style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.65rem" }}>
                    Popular
                  </span>
                )}
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{type.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{type.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Removed How It Works Section ── */}

      {/* ── FAQ (AEO-Optimized with Schema) ─────────────────────────────────── */}
      <section id="faq" className="section">
        <div className="container" style={{ maxWidth: "760px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 className="text-3xl font-extrabold">Common Texas Accident Questions</h2>
            <p className="text-secondary" style={{ marginTop: "1rem" }}>
              Real answers — not legal jargon.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="card"
                style={{ cursor: "pointer" }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontWeight: 600, fontSize: "1rem", flex: 1, paddingRight: "1rem" }}>
                    {faq.q}
                  </h3>
                  <span style={{ color: "var(--color-accent)", fontSize: "1.25rem", flexShrink: 0 }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </div>
                {openFaq === i && (
                  <p style={{ marginTop: "1rem", color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="text-3xl font-extrabold" style={{ marginBottom: "1rem" }}>
            Find Out What Your Car is Really Worth
          </h2>
          <p className="text-secondary" style={{ marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem" }}>
            Upload photos of your damage and run a free, AI-powered valuation audit against insurance offers.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/quiz" className="btn btn-primary btn-lg animate-pulse-glow">
              Start Free AI Valuation →
            </Link>
            <Link href="tel:+19723099156" className="btn btn-secondary btn-lg">
              📞 Call Angel Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── Floating Angel Widget ───────────────────────────────────────────── */}
      <AngelChatWidget />

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: "var(--surface-overlay)", borderTop: "1px solid var(--surface-border)", padding: "2rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div className="nav-logo">Texas<span style={{ color: "var(--color-accent)" }}>Total</span>Loss</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "500px" }}>
            Texas Total Loss is a lead generation platform. We are not a law firm. 
            Information provided is for general purposes only and does not constitute legal advice.
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/portal" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Attorney Portal</Link>
            <Link href="/quiz" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Free ACV Audit</Link>
          </div>
        </div>
      </footer>

      {/* ── FAQ JSON-LD Schema (AEO) ─────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
    </main>
  );
}
