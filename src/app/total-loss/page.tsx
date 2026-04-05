import Link from "next/link";
import type { Metadata } from "next";

// ── Total Loss Topic Hub ─────────────────────────────────────────────────────
// SEO landing page linking to all total loss topic pages.
// Each topic targets a specific high-intent query cluster.

export const metadata: Metadata = {
  title: "Texas Total Loss Guide — Everything You Need to Know | TexasTotalLoss.com",
  description:
    "Complete guide to the Texas total loss process: ACV disputes, GAP insurance, salvage, Copart, diminished value, settlement timelines, and more. Free resources from Texas Total Loss.",
  openGraph: {
    title: "Texas Total Loss Guide",
    description: "Everything you need to know about the total loss process in Texas.",
    url: "https://www.texastotalloss.com/total-loss",
  },
};

const TOPICS = [
  {
    slug: "acv-dispute",
    title: "ACV Valuation & How to Dispute It",
    description: "Learn how insurance companies calculate your vehicle's Actual Cash Value — and how to fight a lowball offer with real market data.",
    icon: "💰",
    targetQuery: "how to dispute total loss value Texas",
    highlight: true,
  },
  {
    slug: "gap-insurance",
    title: "GAP & Loan/Lease Coverage Explained",
    description: "Owe more than your car is worth? Understand how GAP insurance, loan payoff, and lease gap coverage work after a total loss.",
    icon: "🛡️",
    targetQuery: "gap insurance total loss Texas",
  },
  {
    slug: "salvage-process",
    title: "Salvage, Copart & What Happens to Your Car",
    description: "Your car was towed to Copart or a salvage yard. Here's exactly what happens next, your rights, and how to retain your vehicle.",
    icon: "🏗️",
    targetQuery: "what happens car Copart after total loss",
  },
  {
    slug: "replacement-options",
    title: "Replacement Options When You're Upside Down",
    description: "Your car was totaled and you owe more than it's worth. Here are your real options — from GAP claims to negotiation strategies.",
    icon: "🔄",
    targetQuery: "car totaled owe more than worth Texas",
  },
  {
    slug: "inspection",
    title: "The Total Loss Inspection Process",
    description: "What to expect during the adjuster inspection, how to prepare, and what documents to have ready to maximize your payout.",
    icon: "🔍",
    targetQuery: "total loss inspection what to expect",
  },
  {
    slug: "settlement-timeline",
    title: "Settlement Timeline — How Long Does It Take?",
    description: "From accident to check: the realistic timeline for a Texas total loss settlement, and how to speed it up.",
    icon: "⏱️",
    targetQuery: "how long does total loss settlement take Texas",
  },
  {
    slug: "diminished-value",
    title: "Diminished Value Claims in Texas",
    description: "If your car was repaired (not totaled), you may be owed diminished value. Learn how to file a claim in Texas.",
    icon: "📉",
    targetQuery: "diminished value claim Texas",
  },
  {
    slug: "rental-car-rights",
    title: "Your Rental Car Rights During a Total Loss",
    description: "How long does the insurance company have to pay for your rental? Know your rights under Texas law.",
    icon: "🚗",
    targetQuery: "rental car during total loss claim Texas",
  },
];

export default function TotalLossHub() {
  return (
    <main style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link href="/intake" className="btn btn-primary btn-sm">Free Case Evaluation →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ minHeight: "50vh" }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "5rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <div className="hero-eyebrow">📚 Complete Texas Guide</div>
            <h1 className="hero-title">
              Total Loss Resource Center
            </h1>
            <p className="hero-subtitle" style={{ margin: "0 auto 2rem" }}>
              Your vehicle was totaled — now what? We cover every step of the process, 
              from the initial inspection to final settlement. Free, no-obligation resources 
              written by claims specialists.
            </p>
          </div>
        </div>
      </section>

      {/* Topic Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/total-loss/${topic.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="card"
                  style={{
                    height: "100%",
                    transition: "all 0.25s ease",
                    border: topic.highlight ? "2px solid var(--color-accent)" : undefined,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{topic.icon}</div>
                  <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem", lineHeight: 1.3 }}>
                    {topic.title}
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                    {topic.description}
                  </p>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-accent)", fontWeight: 600 }}>
                    Read Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <div className="card" style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
              <h2 className="text-2xl font-extrabold" style={{ marginBottom: "1rem" }}>
                Were You Also Injured?
              </h2>
              <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
                If you were hurt in the same accident, you may have a personal injury case worth 
                significantly more than your vehicle claim. Get a free evaluation — no phone call required.
              </p>
              <Link href="/intake?path=injury" className="btn btn-primary btn-lg">
                Free Injury Case Evaluation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema for AEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is ACV and how do insurance companies calculate it?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ACV (Actual Cash Value) is what your vehicle was worth immediately before the accident. Insurance companies use comparable sales, condition adjustments, and mileage to calculate it. Texas Total Loss can help you verify their number with real market data.",
                },
              },
              {
                "@type": "Question",
                name: "How long does a total loss settlement take in Texas?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Texas, insurance companies must acknowledge your claim within 15 business days and make a decision within 15 more business days. Most total loss settlements take 2-6 weeks from the date of the accident, depending on title processing and lien payoff.",
                },
              },
              {
                "@type": "Question",
                name: "Can I keep my car after a total loss?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, in Texas you can retain your totaled vehicle. The insurance company will deduct the salvage value from your settlement. You'll receive a salvage title and must get a rebuilt title inspection before driving it again.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
