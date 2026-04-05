"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, getFirmProfile, loginWithGoogle } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { BusinessTree } from "../components/BusinessTree";
import { TestingHub } from "../components/TestingHub";
import { KaplanBoard } from "../components/KaplanBoard";

// ── Types ────────────────────────────────────────────────────────────────────
interface PortalListing {
  id: string;
  accidentType: string;
  injurySummary: string;
  hadErVisit: boolean;
  policeReportFiled: boolean;
  estimatedDamages: number;
  lvi_score: number;
  lvi_tier: "platinum" | "gold" | "silver" | "bronze";
  status: "available" | "sold" | "pending";
  city: string;
  created_at: { seconds: number };
  scheduledCall?: string;
  insuranceQuoteRequested?: boolean;
}

const TIER_CONFIG = {
  platinum: { label: "Platinum", badge: "badge-platinum", price: "$500" },
  gold:     { label: "Gold",     badge: "badge-gold",     price: "$300" },
  silver:   { label: "Silver",   badge: "badge-silver",   price: "$150" },
  bronze:   { label: "Bronze",   badge: "badge-bronze",   price: "$50"  },
};

const ACCIDENT_LABELS: Record<string, string> = {
  commercial:  "Commercial Truck",
  rideshare:   "Rideshare",
  mvc:         "Motor Vehicle",
  pedestrian:  "Pedestrian",
  slip_fall:   "Slip & Fall",
  total_loss:  "Vehicle Loss",
};

// ── Landing (Not Logged In) ───────────────────────────────────────────────────
function PortalLanding({ onLogin }: { onLogin: () => void }) {
  // Show a teaser of SOLD inventory to drive conversions (Inventory-First strategy)
  const DEMO_CASES: Omit<PortalListing, "created_at">[] = [
    { id: "demo1", accidentType: "commercial", injurySummary: "Client rear-ended by 18-wheeler on I-35. Airbag deployment, ER visit, fractures...", hadErVisit: true, policeReportFiled: true, estimatedDamages: 45000, lvi_score: 138, lvi_tier: "platinum", status: "sold", city: "Austin, TX", scheduledCall: "1:00 PM" },
    { id: "demo2", accidentType: "rideshare",  injurySummary: "Uber driver ran red light, T-bone collision. MRI showed disc herniation, 3mo treatment...", hadErVisit: true, policeReportFiled: true, estimatedDamages: 22000, lvi_score: 112, lvi_tier: "gold", status: "sold", city: "Houston, TX" },
    { id: "demo3", accidentType: "mvc",        injurySummary: "At-fault driver admitted fault at scene. Whiplash, soft tissue, 6 weeks chiro...", hadErVisit: true, policeReportFiled: true, estimatedDamages: 12000, lvi_score: 87, lvi_tier: "gold", status: "available", city: "Dallas, TX", insuranceQuoteRequested: true },
    { id: "demo4", accidentType: "commercial", injurySummary: "Semi truck sideswiped client on highway. Multiple witnesses, CDL driver at fault...", hadErVisit: true, policeReportFiled: true, estimatedDamages: 67000, lvi_score: 145, lvi_tier: "platinum", status: "sold", city: "San Antonio, TX" },
    { id: "demo5", accidentType: "pedestrian", injurySummary: "Client struck in crosswalk. Walk signal was active. Leg fracture, surgery planned...", hadErVisit: true, policeReportFiled: true, estimatedDamages: 35000, lvi_score: 121, lvi_tier: "platinum", status: "sold", city: "Fort Worth, TX" },
    { id: "demo6", accidentType: "mvc",        injurySummary: "2-car collision, client not at fault. Neck pain, began PT. Police report confirms fault.", hadErVisit: false, policeReportFiled: true, estimatedDamages: 8500, lvi_score: 72, lvi_tier: "silver", status: "available", city: "Austin, TX" },
  ];

  return (
    <main style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div>
            <button onClick={onLogin} className="btn btn-primary">
              Attorney Login / Apply →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" style={{ minHeight: "60vh" }}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "5rem" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <div className="hero-eyebrow">⚖️ Texas PI Attorney Portal</div>
            <h1 className="hero-title">
              Pre-Qualified Texas PI Cases.<br />
              <span className="highlight">Ready to Sign.</span>
            </h1>
            <p className="hero-subtitle" style={{ margin: "0 auto 2.5rem" }}>
              We deliver Pre-Litigation Intake Reports — not raw leads. Every case includes 
              LVI scoring, injury summary, liability analysis, and insurance carrier data.
              Cases start at <strong style={{ color: "var(--color-accent)" }}>$150</strong>.
            </p>
            <button onClick={onLogin} className="btn btn-primary btn-lg animate-pulse-glow">
              View Available Cases →
            </button>
          </div>
        </div>
      </section>

      {/* Inventory Preview (Sold + Available) */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 className="text-2xl font-extrabold">Recent Case Inventory</h2>
              <p className="text-secondary text-sm" style={{ marginTop: "0.25rem" }}>
                Showing recent activity. Sold cases demonstrate platform volume and case quality.
              </p>
            </div>
            <button onClick={onLogin} className="btn btn-primary">
              Access Full Inventory →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {DEMO_CASES.map((c) => (
              <CaseCard key={c.id} case={c} locked={true} onUnlock={onLogin} />
            ))}
          </div>

          {/* Tier Pricing */}
          <div style={{ marginTop: "4rem", textAlign: "center" }}>
            <h2 className="text-2xl font-extrabold" style={{ marginBottom: "2rem" }}>Pricing by Case Tier</h2>
            <div className="grid-4">
              {Object.entries(TIER_CONFIG).map(([tier, config]) => (
                <div key={tier} className="card" style={{ textAlign: "center" }}>
                  <span className={`badge ${config.badge}`} style={{ marginBottom: "1rem", display: "inline-block" }}>
                    {config.label}
                  </span>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)", margin: "0.5rem 0" }}>
                    {config.price}
                  </div>
                  <div className="text-secondary text-sm">per case</div>
                  {tier === "platinum" && (
                    <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--color-success)" }}>
                      Highest conversion rate
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-muted text-sm" style={{ marginTop: "1.5rem" }}>
              Volume discounts available. Contact us for monthly subscription pricing.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Case Card Component ────────────────────────────────────────────────────── 
function CaseCard({
  case: c,
  locked,
  onUnlock,
}: {
  case: Omit<PortalListing, "created_at">;
  locked: boolean;
  onUnlock?: () => void;
}) {
  const tier = TIER_CONFIG[c.lvi_tier];

  return (
    <div className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1.5rem", alignItems: "center" }}>
      {/* LVI Score */}
      <div className={`lvi-score ${c.lvi_tier}`}>
        <span>{c.lvi_score}</span>
        <span style={{ fontSize: "0.55rem", fontWeight: 600, marginTop: "-4px" }}>LVI</span>
      </div>

      {/* Case Info */}
      <div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          <span className={`badge ${tier.badge}`}>{tier.label}</span>
          <span className={`badge badge-${c.status === "available" ? "available" : "sold"}`}>
            {c.status === "available" ? "✅ Available" : "🔴 Sold"}
          </span>
          {c.insuranceQuoteRequested && (
            <span className="badge" style={{ background: "rgba(91,155,213,0.1)", color: "var(--color-info, #5B9BD5)", border: "1px solid var(--color-info, #5B9BD5)" }}>
              🛡️ Insurance Quote Required
            </span>
          )}
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            {ACCIDENT_LABELS[c.accidentType]} • {c.city}
          </span>
        </div>
        
        {c.scheduledCall && (
            <div style={{
              background: "rgba(217, 64, 64, 0.15)",
              border: "1px solid var(--color-danger, #D94040)",
              color: "var(--color-danger, #D94040)",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontWeight: 800,
              fontSize: "0.9rem",
              marginBottom: "0.75rem",
              animation: c.status === "available" ? "pulse 2s infinite" : "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              🚨 Appt Call Scheduled for {c.scheduledCall} TODAY - ACT NOW! :)
            </div>
        )}

        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {locked ? c.injurySummary : c.injurySummary}
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
          {c.hadErVisit && <span style={{ fontSize: "0.75rem", color: "var(--color-success)" }}>✓ ER Visit</span>}
          {c.policeReportFiled && <span style={{ fontSize: "0.75rem", color: "var(--color-success)" }}>✓ Police Report</span>}
          {c.estimatedDamages > 0 && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              ~${c.estimatedDamages.toLocaleString()} damages
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, color: "var(--color-accent)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
          {tier.price}
        </div>
        {c.status === "available" ? (
          <button onClick={onUnlock} className="btn btn-primary btn-sm">
            {locked ? "Login to Purchase" : "Purchase Case"}
          </button>
        ) : (
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Case Sold</span>
        )}
      </div>
    </div>
  );
}

// ── Authenticated Portal View ─────────────────────────────────────────────────
function AuthenticatedPortal({ user }: { user: User }) {
  const [cases, setCases] = useState<PortalListing[]>([]);
  const [firmProfile, setFirmProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"marketplace" | "kaplan" | "business" | "uat">("marketplace");

  useEffect(() => {
    const load = async () => {
      const profile = await getFirmProfile(user.uid);
      setFirmProfile(profile);

      if (profile?.isApproved) {
        const db = getFirestore();
        const q = query(collection(db, "portal_listings"), orderBy("created_at", "desc"), limit(50));
        const snap = await getDocs(q);
        setCases(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PortalListing)));
      }
      setLoading(false);
    };
    load();
  }, [user.uid]);

  const filtered = cases.filter((c) => filter === "all" || c.lvi_tier === filter || c.status === filter);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚡</div>
          Loading your portal...
        </div>
      </div>
    );
  }

  if (!firmProfile?.isApproved) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="card" style={{ maxWidth: "480px", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <h2 className="text-xl font-bold" style={{ marginBottom: "1rem" }}>Application Under Review</h2>
          <p className="text-secondary" style={{ marginBottom: "1.5rem" }}>
            Your firm account is pending approval. We verify all law firm accounts before granting portal access.
            You&#39;ll receive an email at <strong>{user.email}</strong> within 24 hours.
          </p>
          <Link href="/" className="btn btn-secondary">← Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100vh", paddingTop: "5rem" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="nav-logo">Texas<span>Total</span>Loss</Link>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {firmProfile.firmName as string}
            </span>
            <button onClick={() => auth.signOut()} className="btn btn-secondary btn-sm">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: "2rem" }}>
        
        {/* Dashboard Navigation Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem", overflowX: "auto" }}>
          {[
            { id: "marketplace", label: "Lead Marketplace" },
            { id: "kaplan", label: "Kaplan Board" },
            { id: "business", label: "Business Tree" },
            { id: "uat", label: "Testing Hub" }
          ].map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                   padding: "0.5rem 1rem",
                   background: "none",
                   border: "none",
                   color: activeTab === tab.id ? "var(--color-primary)" : "var(--text-secondary)",
                   fontWeight: activeTab === tab.id ? "bold" : "normal",
                   cursor: "pointer",
                   borderBottom: activeTab === tab.id ? "2px solid var(--color-primary)" : "none",
                   whiteSpace: "nowrap"
                }}
             >
                {tab.label}
             </button>
          ))}
        </div>

        {activeTab === "marketplace" && (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 className="text-2xl font-extrabold">Case Marketplace</h1>
                <p className="text-secondary text-sm">
                  {cases.filter((c) => c.status === "available").length} cases available •{" "}
                  {cases.filter((c) => c.status === "sold").length} sold this month
                </p>
              </div>
              {/* Filters */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["all", "platinum", "gold", "silver", "available"].map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
                    style={{ textTransform: "capitalize" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: "2rem" }}>
              {[
                { label: "Available Cases", value: cases.filter((c) => c.status === "available").length },
                { label: "Platinum Cases", value: cases.filter((c) => c.lvi_tier === "platinum" && c.status === "available").length },
                { label: "Avg LVI Score", value: cases.length ? Math.round(cases.reduce((a, c) => a + c.lvi_score, 0) / cases.length) : 0 },
                { label: "Sold This Month", value: cases.filter((c) => c.status === "sold").length },
              ].map((stat) => (
                <div key={stat.label} className="card" style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-accent)" }}>{stat.value}</div>
                  <div className="text-secondary text-sm" style={{ marginTop: "0.25rem" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Case List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filtered.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📋</div>
                  <p className="text-secondary">No cases match this filter right now. Check back soon.</p>
                </div>
              ) : (
                filtered.map((c) => <CaseCard key={c.id} case={c} locked={false} />)
              )}
            </div>
          </>
        )}

        {activeTab === "kaplan" && <KaplanBoard />}
        {activeTab === "business" && <BusinessTree />}
        {activeTab === "uat" && <TestingHub />}

      </div>
    </main>
  );
}

// ── Page Root ─────────────────────────────────────────────────────────────────
export default function PortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = async () => {
    try { await loginWithGoogle(); }
    catch (err) { console.error("Login failed:", err); }
  };

  if (authLoading) return null;
  if (!user) return <PortalLanding onLogin={handleLogin} />;
  return <AuthenticatedPortal user={user} />;
}
