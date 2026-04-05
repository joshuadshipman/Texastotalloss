"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useState } from "react";
import { updatePILead } from "../../../lib/firebase";

function ConfirmationContent() {
  const params = useSearchParams();
  const leadId = params.get("id");
  
  const [scheduled, setScheduled] = useState(false);
  const [quoting, setQuoting] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState("");

  const handleSchedule = async () => {
    if (!appointmentTime || !leadId) return;
    await updatePILead(leadId, { scheduledCall: appointmentTime });
    setScheduled(true);
  };

  const handleQuote = async () => {
    if (!leadId) return;
    await updatePILead(leadId, { insuranceQuoteRequested: true });
    setQuoting(true);
  };

  return (
    <main style={{ minHeight: "100vh", padding: "4rem 1rem", background: "var(--background-base)" }}>
      <div className="container" style={{ maxWidth: "650px", margin: "0 auto" }}>
        
        {/* Core Confirmation */}
        <div className="card" style={{ textAlign: "center", padding: "3rem 2rem", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
          <h1 className="text-3xl font-extrabold" style={{ marginBottom: "1rem" }}>
            Case Under Review for Maximum Compensation
          </h1>
          <div style={{ background: "rgba(224,123,57,0.1)", borderLeft: "4px solid var(--color-warning)", padding: "1rem", textAlign: "left", marginBottom: "1.5rem", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>⚠️ Important Next Step: Prioritize Your Medical Treatment</p>
            <p className="text-secondary" style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
              While we review your property damage, the most critical factor in your recovery (and your settlement) is your health. 
              <strong> Insurance companies use gaps in medical treatment to deny bodily injury claims.</strong> 
              <br/><br/>
              A top-rated Texas personal injury attorney will reach out shortly to help you secure medical care with zero out-of-pocket costs, ensuring you get whole and maximize your settlement.
            </p>
          </div>
          {leadId && (
            <div style={{ background: "var(--surface-overlay)", padding: "0.5rem 1rem", borderRadius: "8px", display: "inline-block" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Ref ID:</span>{" "}
              <strong style={{ fontFamily: "monospace", letterSpacing: "1px" }}>{leadId.substring(0, 8)}</strong>
            </div>
          )}
        </div>

        {/* Priority Scheduling Cross-Sell */}
        <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "4px solid var(--color-accent)" }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: "0.5rem" }}>📅 Priority Intake Call</h2>
          <p className="text-secondary" style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Skip the line. Schedule exactly when you want the attorney's intake team to call you. 
            We'll send an SMS confirmation to the number you provided.
          </p>
          
          {scheduled ? (
            <div style={{ background: "rgba(34, 197, 94, 0.1)", color: "var(--color-success)", padding: "1rem", borderRadius: "8px", fontWeight: 600 }}>
              ✓ Appointment confirmed for {appointmentTime}. You will receive an SMS reminder.
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <select 
                className="form-input" 
                style={{ flex: 1 }}
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              >
                <option value="" disabled>Select a time window...</option>
                <option value="ASAP">Call Me ASAP (Within 30 mins)</option>
                <option value="1:00 PM">Today 1:00 PM - 3:00 PM</option>
                <option value="5:00 PM">Today 5:00 PM - 7:00 PM (After Work)</option>
                <option value="Tomorrow AM">Tomorrow Morning (9AM - 12PM)</option>
              </select>
              <button 
                className="btn btn-primary" 
                disabled={!appointmentTime}
                onClick={handleSchedule}
              >
                Confirm Time
              </button>
            </div>
          )}
        </div>

        {/* Insurance Quote Cross-Sell */}
        <div className="card" style={{ marginBottom: "2rem", borderLeft: "4px solid var(--color-info, #5B9BD5)" }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: "0.5rem" }}>🛡️ Need Replacement Insurance?</h2>
          <p className="text-secondary" style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Since your vehicle was totaled, you'll likely need a new policy for your replacement vehicle. 
            Get a free quote from our network of top-rated Texas auto insurers.
          </p>
          
          {quoting ? (
            <div style={{ background: "rgba(91, 155, 213, 0.1)", color: "var(--color-info, #5B9BD5)", padding: "1rem", borderRadius: "8px", fontWeight: 600 }}>
              ✓ Request submitted. An insurance specialist will text you with quote options.
            </div>
          ) : (
            <button className="btn btn-secondary" onClick={handleQuote} style={{ width: "100%" }}>
              Get Free Auto Insurance Quotes
            </button>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-secondary)" }}>Loading confirmation...</div>
      </main>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
