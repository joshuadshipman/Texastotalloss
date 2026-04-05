import Link from "next/link";
import type { Metadata } from "next";

// ── Dynamic Total Loss Topic Pages ───────────────────────────────────────────
// Each page is a long-form SEO guide targeting specific total loss queries.
// Structured for AEO (FAQ schema) and Google featured snippets.

interface TopicData {
  title: string;
  metaDescription: string;
  heroSubtitle: string;
  sections: { heading: string; content: string }[];
  faq: { question: string; answer: string }[];
  cta: { title: string; description: string; link: string; label: string };
}

const TOPIC_CONTENT: Record<string, TopicData> = {
  "acv-dispute": {
    title: "How to Dispute Your Total Loss ACV in Texas",
    metaDescription: "Step-by-step guide to disputing your insurance company's Actual Cash Value (ACV) offer in Texas. Fight lowball total loss settlements with real market data.",
    heroSubtitle: "Insurance adjusters typically start $2,000–$4,000 below real market value. Here's how to fight back.",
    sections: [
      {
        heading: "What Is ACV (Actual Cash Value)?",
        content: "ACV is the fair market value of your vehicle immediately before the accident. It's NOT the trade-in value, and it's NOT what you owe on your loan. It's what a willing buyer would pay a willing seller for your exact vehicle — with your exact mileage, condition, and options.\n\nInsurance companies use third-party valuation tools (CCC ONE, Mitchell, Audatex) that often undervalue vehicles by using distant comparable sales, ignoring local market conditions, and applying excessive condition deductions."
      },
      {
        heading: "Step 1: Get Your Own Comparable Sales",
        content: "Search AutoTrader, Cars.com, CarGurus, and Facebook Marketplace for vehicles matching your exact year, make, model, trim, and similar mileage within 100 miles of your location. Save screenshots with URLs — you'll need at least 3-5 comparable listings.\n\nKey tip: Insurance companies use SOLD prices, but in Texas you're entitled to argue ASKING prices because that's the replacement cost you'd actually pay."
      },
      {
        heading: "Step 2: Document Your Vehicle's Condition",
        content: "Gather all maintenance records, recent repairs, and upgrades. New tires, recent brake job, aftermarket stereo, tint, lift kit — all of these ADD value that adjusters often ignore.\n\nIf your vehicle was in above-average condition, say so in writing and provide documentation."
      },
      {
        heading: "Step 3: Write a Formal Demand Letter",
        content: "Send a written response to the adjuster's offer that includes: your comparable sales data, documentation of vehicle condition, a clear statement of the value you believe is fair, and a deadline for response (10 business days is standard in Texas).\n\nTexas Insurance Code §542.056 requires insurers to affirm or deny your claim within 15 business days after receiving all documentation."
      },
      {
        heading: "Step 4: File a Complaint with TDI",
        content: "If the insurance company won't budge, file a formal complaint with the Texas Department of Insurance (TDI) online at tdi.texas.gov. TDI has authority to investigate unfair settlement practices and can put real pressure on adjusters."
      },
      {
        heading: "When to Hire an Attorney",
        content: "If the gap between your documented value and their offer is over $3,000, it's often worth consulting a personal injury attorney — especially if you were also injured in the accident. PI attorneys handle total loss disputes as part of the overall injury claim at no upfront cost."
      },
    ],
    faq: [
      { question: "How do I dispute a total loss value in Texas?", answer: "Gather 3-5 comparable vehicle listings from AutoTrader/Cars.com, document your vehicle's condition and upgrades, write a formal demand letter with your evidence, and send it to the adjuster. If they don't respond fairly within 15 business days, file a complaint with the Texas Department of Insurance (TDI)." },
      { question: "How much should I expect from a total loss settlement in Texas?", answer: "You should receive the fair market (replacement) value of your vehicle before the accident, minus any applicable deductible. Use comparable listings within 100 miles to determine fair value. On average, initial insurance offers are $2,000-$4,000 below actual market value." },
      { question: "Can I negotiate a total loss settlement in Texas?", answer: "Yes. Insurance companies expect you to negotiate. Gather comparable sales data, document your vehicle's condition, and submit a formal counter-offer. The vast majority of total loss disputes are resolved through negotiation without legal action." },
    ],
    cta: { title: "Were You Also Injured?", description: "If you were hurt in the accident, your injury claim could be worth 10x your vehicle. Get a free case evaluation.", link: "/intake", label: "Free Case Evaluation →" },
  },
  "gap-insurance": {
    title: "GAP Insurance & Total Loss in Texas — What You Need to Know",
    metaDescription: "Understanding GAP insurance, loan/lease coverage, and what happens when you owe more than your totaled car is worth in Texas.",
    heroSubtitle: "Owe more than your car is worth? GAP insurance may cover the difference — but there are catches.",
    sections: [
      { heading: "What Is GAP Insurance?", content: "GAP (Guaranteed Asset Protection) insurance covers the difference between what your vehicle is worth (ACV) and what you still owe on your loan or lease. Without it, you could be stuck paying thousands on a car you no longer have." },
      { heading: "How GAP Works After a Total Loss", content: "After the insurance company pays out your ACV, GAP coverage kicks in to pay the remaining balance on your loan. Example: Your car's ACV is $18,000, but you owe $24,000. GAP covers the $6,000 difference.\n\nImportant: GAP does NOT cover missed payments, late fees, or extended warranty balances rolled into your loan." },
      { heading: "What If I Don't Have GAP?", content: "If you don't have GAP and owe more than your car is worth, you're responsible for the difference. Options include: negotiating with your lender for a hardship reduction, rolling the negative equity into a new loan (not recommended), or consulting with a consumer protection attorney if the original loan terms were predatory." },
      { heading: "Loan/Lease Payoff vs. GAP", content: "Some policies offer 'Loan/Lease Payoff' instead of GAP. This typically covers up to 125% of ACV — which may not cover the full gap if you're significantly underwater. Check your policy declarations page for the exact coverage type." },
    ],
    faq: [
      { question: "Does GAP insurance cover my deductible?", answer: "Most GAP policies do NOT cover your comprehensive or collision deductible. You'll still be responsible for paying your deductible amount." },
      { question: "How do I file a GAP claim in Texas?", answer: "Contact your GAP provider (often your dealer or lender, not your auto insurer). You'll need: the total loss settlement letter from your insurer, your loan payoff statement, and proof of insurance payment. File within 60 days of settlement." },
    ],
    cta: { title: "Need Help With Your Claim?", description: "Our team can review your situation and connect you with the right resources.", link: "/intake?path=vehicle", label: "Get Free Help →" },
  },
  "salvage-process": {
    title: "What Happens to Your Car at Copart After a Total Loss in Texas",
    metaDescription: "Your totaled car was towed to Copart or a salvage yard. Learn what happens next, your rights to personal property, and how to retain your vehicle in Texas.",
    heroSubtitle: "Your car is sitting at Copart. Here's what the insurance company isn't telling you about your rights.",
    sections: [
      { heading: "Why Your Car Was Towed to Copart", content: "After an accident, if the insurance company determines your vehicle is a total loss, they'll have it towed to a salvage facility — most commonly Copart or IAA (Insurance Auto Auctions). This is where it will be stored while your claim is processed and eventually auctioned." },
      { heading: "Your Right to Personal Property", content: "You have the right to retrieve personal belongings from your vehicle at the salvage yard. In Texas, the yard must give you reasonable access. Bring a government-issued ID and be prepared to sign a release. Do this as soon as possible — storage environments can damage personal items." },
      { heading: "Can You Keep Your Totaled Car?", content: "Yes. In Texas, you can retain your totaled vehicle. The insurance company will deduct the estimated salvage value from your settlement. You'll receive a salvage title and must pass a rebuilt title inspection before registering the vehicle for road use again." },
      { heading: "The Auction Process", content: "If you don't retain the vehicle, the insurance company takes ownership and sells it through Copart or IAA auction. Salvage buyers, rebuilders, and parts recyclers bid on the vehicle. The insurance company recovers some of their payout through the auction proceeds." },
      { heading: "Storage Fees", content: "Be aware: salvage yards charge daily storage fees. While the insurance company typically pays during the claims process, if there's a delay or dispute, fees can accumulate. In Texas, the insurer is responsible for reasonable storage costs during the claim investigation period." },
    ],
    faq: [
      { question: "How long does my car stay at Copart after a total loss?", answer: "Typically 30-60 days. The insurance company processes your claim, you negotiate the settlement, and once paid, the vehicle title transfers. If you retain the vehicle, you'll need to pick it up within the timeframe specified by the yard (usually 7-14 days after settlement)." },
      { question: "Can I buy my own car back from Copart?", answer: "Yes, but it's usually cheaper to retain it through your insurance company rather than buying it back at auction. If you've already surrendered the title, you can bid on it at the Copart auction like any other buyer." },
    ],
    cta: { title: "Fighting an Unfair Settlement?", description: "If the insurance company is lowballing you, we can help you fight for fair value.", link: "/total-loss/acv-dispute", label: "Learn How to Dispute →" },
  },
  "settlement-timeline": {
    title: "How Long Does a Total Loss Settlement Take in Texas?",
    metaDescription: "Realistic timeline for a total loss settlement in Texas. From accident to check — what to expect at each stage and how to speed up the process.",
    heroSubtitle: "Most total loss claims settle in 2-6 weeks. Here's the exact timeline and how to avoid delays.",
    sections: [
      { heading: "Day 1-3: Accident Report & Claim Filed", content: "File your claim immediately. The insurance company has 15 business days to acknowledge receipt under Texas law (§542.055). Get the claim number and your adjuster's direct contact information." },
      { heading: "Day 3-10: Vehicle Inspection & Total Loss Declaration", content: "An adjuster inspects the vehicle (at the tow yard or repair shop) and determines if repair costs exceed the vehicle's value. In Texas, a vehicle is typically totaled when repair costs exceed 100% of ACV. You'll be notified of the total loss determination." },
      { heading: "Day 10-20: ACV Offer & Negotiation", content: "The insurance company sends a valuation report and settlement offer. This is where most delays happen — if you accept immediately, the process moves fast. If you dispute (and you often should), add 5-15 days for negotiation." },
      { heading: "Day 20-30: Title Processing & Payment", content: "Once you accept the offer, the insurance company processes the title transfer. If there's a lien, the check goes to your lender first. Payoff takes 5-10 business days. Your portion is mailed or direct deposited." },
      { heading: "How to Speed It Up", content: "1. File your claim the same day as the accident.\n2. Respond to adjuster calls/emails within 24 hours.\n3. Have your title, registration, and loan payoff information ready.\n4. If disputing the offer, submit your comparable sales evidence within 48 hours of their offer.\n5. Ask for direct deposit instead of a mailed check." },
    ],
    faq: [
      { question: "How long does an insurance company have to settle a total loss claim in Texas?", answer: "Under Texas Insurance Code §542, insurers must acknowledge your claim within 15 business days and must accept or reject it within 15 business days after receiving all required documentation. Payment must be made within 5 business days of acceptance." },
      { question: "What if the insurance company is taking too long?", answer: "If the insurer exceeds the statutory deadlines, they may owe you 18% annual interest on the settlement amount plus reasonable attorney's fees. File a complaint with the Texas Department of Insurance (TDI) to escalate." },
    ],
    cta: { title: "Also Injured in the Accident?", description: "Your injury claim is separate from the vehicle claim — and often worth much more.", link: "/intake", label: "Free Injury Evaluation →" },
  },
};

// Fallback for topics not yet fully written
const FALLBACK: TopicData = {
  title: "Total Loss Guide",
  metaDescription: "Texas total loss information and resources from TexasTotalLoss.com",
  heroSubtitle: "Expert guidance for your total loss situation.",
  sections: [{ heading: "Coming Soon", content: "This guide is being written by our claims specialists. Check back soon for comprehensive coverage of this topic." }],
  faq: [],
  cta: { title: "Need Help Now?", description: "Get connected with the right resources for your situation.", link: "/intake", label: "Get Free Help →" },
};

export async function generateStaticParams() {
  return Object.keys(TOPIC_CONTENT).map((slug) => ({ topic: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const data = TOPIC_CONTENT[topic] || FALLBACK;
  return {
    title: `${data.title} | TexasTotalLoss.com`,
    description: data.metaDescription,
    openGraph: { title: data.title, description: data.metaDescription, url: `https://www.texastotalloss.com/total-loss/${topic}` },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const data = TOPIC_CONTENT[topic] || FALLBACK;

  return (
    <main style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/total-loss" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", textDecoration: "none" }}>
              ← All Guides
            </Link>
            <Link href="/intake" className="btn btn-primary btn-sm">Free Evaluation →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ minHeight: "40vh" }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "5rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <div className="hero-eyebrow">📖 Texas Total Loss Guide</div>
            <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              {data.title}
            </h1>
            <p className="hero-subtitle" style={{ margin: "0 auto" }}>
              {data.heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: "780px" }}>
          {data.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: "3rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1rem", color: "var(--text-primary)" }}>
                {section.heading}
              </h2>
              {section.content.split("\n\n").map((paragraph, j) => (
                <p key={j} style={{ fontSize: "1rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {/* FAQ Section */}
          {data.faq.length > 0 && (
            <div style={{ marginTop: "3rem", borderTop: "1px solid var(--surface-border)", paddingTop: "2rem" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>
              {data.faq.map((item, i) => (
                <div key={i} className="card" style={{ marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                    {item.question}
                  </h3>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="card" style={{ textAlign: "center", marginTop: "3rem", padding: "2.5rem" }}>
            <h2 className="text-xl font-bold" style={{ marginBottom: "0.75rem" }}>{data.cta.title}</h2>
            <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>{data.cta.description}</p>
            <Link href={data.cta.link} className="btn btn-primary">{data.cta.label}</Link>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      {data.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: data.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      )}
    </main>
  );
}
