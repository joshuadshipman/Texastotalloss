'use client';

import { useState } from 'react';
import { ShieldCheck, Scale, DollarSign, Calculator, FileText, ChevronRight } from 'lucide-react';

const SECTIONS = [
  {
    id: 'ch542',
    title: 'The 18% Penalty',
    subtitle: 'Section 542.060',
    icon: ShieldCheck,
    color: 'red',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Texas law is strict. If your insurance carrier misses the <strong>15/15/5</strong> day deadlines to acknowledge, accept, and pay your claim, they are liable for an additional <strong>18% annual interest</strong> penalty.
        </p>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
          <h4 className="font-bold text-red-900 text-sm mb-2 uppercase tracking-wide">The Statutory Clock</h4>
          <ul className="space-y-2 text-sm text-red-800">
            <li className="flex items-center gap-2">
              <span className="font-bold">15 Days:</span> To acknowledge & start investigating.
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">15 Days:</span> To accept or reject your claim.
            </li>
            <li className="flex items-center gap-2">
              <span className="font-bold">5 Days:</span> To issue your final payment.
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'formula',
    title: 'The 100% Formula',
    subtitle: 'Total Loss Logic',
    icon: Scale,
    color: 'blue',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Unlike other states, Texas uses a 100% threshold. A vehicle is only "Totaled" if:
        </p>
        <div className="bg-blue-600 text-white p-6 rounded-2xl text-center shadow-lg">
          <div className="text-xl font-black mb-2">Repair Costs + Salvage Value</div>
          <div className="text-3xl font-black">≥</div>
          <div className="text-xl font-black mt-2">Actual Cash Value (ACV)</div>
        </div>
        <p className="text-xs text-gray-400 italic">
          *Many carriers manipulate "comparable vehicles" to lower your ACV. This is where we detect the "Gap."
        </p>
      </div>
    )
  },
  {
    id: 'vsf_release',
    title: 'Your Right to Vehicle Release',
    subtitle: 'VSF Fee Caps & Release Rules',
    icon: Calculator, // Assuming Calculator icon for VSF
    color: 'purple', // Assuming a new color for VSF
    content: (
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-purple-800">The 1-Hour Release Rule</h3>
        <p className="text-gray-700 leading-relaxed">
          Per <strong>TX Occ. Code § 2303.156</strong>, if a VSF accepts vehicles 24/7, they MUST release them 24/7. During business hours, release must occur within <strong>one hour</strong> of your request.
        </p>
        <h3 className="font-bold text-lg text-purple-800">🚫 Illegal Demands</h3>
        <p className="text-gray-700 leading-relaxed">
          Many VSFs attempt to delay release with unauthorized requirements. Know your rights:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>NO Insurance Required</strong>: Releasing a vehicle is NOT contingent on providing proof of insurance.</li>
          <li><strong>NO Affidavits for Address Mismatch</strong>: If your ID address doesn't match your registration, they cannot demand a sworn affidavit.</li>
          <li><strong>The 12-Hour Rule</strong>: You cannot be charged a full day's storage if your vehicle was held for less than 12 hours.</li>
        </ul>
        <h3 className="font-bold text-lg text-purple-800">Statutory Fee Caps (Light-Duty)</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Light-Duty Tow</strong>: Max $272.00</li>
          <li><strong>Daily Storage (&lt;25ft)</strong>: Max $22.85/day</li>
          <li><strong>Impound Fee</strong>: Max $22.85</li>
          <li><strong>Notification Fee</strong>: Max $50.00</li>
        </ul>
      </div>
    )
  },
  {
    id: 'total_loss_parity',
    title: 'Market Parity vs. Carrier Offers',
    subtitle: 'Negotiation Tactics',
    icon: Scale, // Reusing Scale icon, or could add a new one
    color: 'orange', // Assuming a new color
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Insurance carriers often use proprietary valuation methods (like CCC One or Mitchell) that may undervalue your vehicle. You have the right to negotiate based on true market value.
        </p>
        <h3 className="font-bold text-lg text-orange-800">How to Fight a Low-Ball Offer:</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li><strong>Independent Appraisals</strong>: Get a third-party appraisal to establish fair market value.</li>
          <li><strong>Comparable Sales Data</strong>: Research recent sales of similar vehicles in your area.</li>
          <li><strong>Condition Adjustments</strong>: Ensure all pre-loss upgrades and excellent maintenance are factored in.</li>
          <li><strong>Depreciation</strong>: Challenge excessive depreciation applied by the carrier.</li>
        </ul>
        <p className="text-xs text-gray-400 italic">
          *Understanding the data used by carriers is key to identifying discrepancies and negotiating a fair settlement.
        </p>
      </div>
    )
  },
  {
    id: 'salestax',
    title: 'Tax & Title Recovery',
    subtitle: 'Hidden Benefits',
    icon: DollarSign,
    color: 'green',
    content: (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          When your car is a total loss, the insurance company owes you more than just the value of the car.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
            <div className="text-2xl mb-1">🏷️</div>
            <div className="font-bold text-green-900 text-sm">6.25% Sales Tax</div>
            <div className="text-xs text-green-700">Must be included</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="font-bold text-green-900 text-sm">Title Fees</div>
            <div className="text-xs text-green-700">Registration recovery</div>
          </div>
        </div>
      </div>
    )
  }
];

export default function RightsGuide() {
  const [activeTab, setActiveTab] = useState('ch542');

  return (
    <div className="w-full max-w-2xl mx-auto my-16 bg-white rounded-[3rem] shadow-[0_24px_80px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-100 group">
      <div className="p-10 pb-6 relative overflow-hidden">
        {/* Decorative Authority Seal Background */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
        
        <div className="relative z-10">
          <span className="bg-blue-50 text-blue-700 text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4 inline-block border border-blue-100">
            Texas Insurance Code Compliance
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tighter">
            Total Loss <span className="text-blue-600">Rights Guide</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Free statutory knowledge to protect your property & assets</p>
        </div>
      </div>

      {/* Glassmorphic Tabs */}
      <div className="flex p-2 bg-slate-50/80 backdrop-blur-md mx-10 rounded-[1.5rem] mb-8 border border-slate-200/50 shadow-inner">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveTab(section.id)}
            className={`flex-1 py-4 px-2 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${
              activeTab === section.id 
                ? 'bg-white text-blue-600 shadow-xl border border-blue-50 transform scale-[1.05] z-10' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
            }`}
          >
            <section.icon className={`h-6 w-6 transition-transform duration-500 ${activeTab === section.id ? 'text-blue-600 scale-110' : 'text-slate-300'}`} />
            {section.id.replace('ch542', 'Penalty').replace('formula', 'Formula').replace('salestax', 'Tax')}
          </button>
        ))}
      </div>

      {/* Content Area with Fade Animation */}
      <div className="px-10 pb-10 min-h-[320px] animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="bg-white rounded-[2rem] p-4">
          {SECTIONS.find(s => s.id === activeTab)?.content}
        </div>
      </div>

      {/* Premium Footer CTA */}
      <div className="p-8 bg-slate-900 text-white border-t border-slate-800 relative group/footer">
        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover/footer:opacity-5 transition-opacity duration-500" />
        <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 relative z-10 group/btn">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800 group-hover/btn:bg-white/20 group-hover/btn:text-white transition-colors">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-sm tracking-tight">DOWNLOAD 2026 LEGAL MANUAL</span>
          <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
