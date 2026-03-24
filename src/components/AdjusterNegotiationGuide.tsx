'use client';

import React, { useState } from 'react';
import { AlertTriangle, MessageSquare, ShieldAlert, Zap, ChevronRight, Info } from 'lucide-react';

const TIPS = [
  {
    id: 'never',
    title: 'The "Never" List',
    subtitle: 'Strategic Silence',
    icon: ShieldAlert,
    color: 'red',
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 leading-relaxed font-medium">
          Insurance adjusters are trained to minimize payouts. Never give them ammunition.
        </p>
        <ul className="space-y-3">
          {[
            'NEVER give a recorded statement without a lawyer present.',
            'NEVER say "I feel fine" or "I think I\'m okay" during initial calls.',
            'NEVER sign a medical release form (HIPAA) for your entire history.',
            'NEVER accept the first structural damage estimate without a second look.'
          ].map((item, i) => (
            <li key={i} className="flex gap-3 items-start bg-red-50/50 p-3 rounded-xl border border-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span className="text-sm text-red-900 font-bold">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  },
  {
    id: 'power-ask',
    title: 'The "Power" Ask',
    subtitle: 'Demand Justification',
    icon: Zap,
    color: 'amber',
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 leading-relaxed font-medium">
          Flip the script. Force the adjuster to defend their low-ball valuation with these specific questions:
        </p>
        <div className="space-y-3">
          {[
            '"Can you provide the specific Mitchell/CCC report used to determine my ACV?"',
            '"How did you account for the 6.25% Texas Sales Tax in this offer?"',
            '"Why were high-mileage comps used when my vehicle is low-mileage?"',
            '"Where in the Texas Insurance Code does it allow for this specific deduction?"'
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-white/10 group">
              <p className="text-sm font-black italic group-hover:text-amber-400 transition-colors tracking-tight">{item}</p>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'aftermarket',
    title: 'Aftermarket Value',
    subtitle: 'Non-Factory Assets',
    icon: Info,
    color: 'blue',
    content: (
      <div className="space-y-4">
        <p className="text-slate-700 leading-relaxed font-medium">
          Factory reports (Mitchell/CCC) often ignore thousands of dollars in upgrades.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <h5 className="font-black text-blue-900 text-xs mb-1 uppercase">Custom Tech</h5>
            <p className="text-[10px] text-blue-700">Audio, Nav, Lighting</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
            <h5 className="font-black text-blue-900 text-xs mb-1 uppercase">Performance</h5>
            <p className="text-[10px] text-blue-700">Wheels, Tints, Exhaust</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 italic font-medium">
          *Provide receipts immediately. Insurance must compensate for non-factory value.
        </p>
      </div>
    )
  }
];

export default function AdjusterNegotiationGuide() {
  const [activeTip, setActiveTip] = useState('never');

  return (
    <div className="relative w-full max-w-2xl mx-auto my-16 bg-white rounded-[3rem] shadow-[0_32px_120px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 group">
      {/* Premium Header */}
      <div className="p-10 pb-6 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <span className="bg-white/10 text-white text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-6 inline-block border border-white/10 backdrop-blur-md">
            Adjuster Negotiation Tactics
          </span>
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tighter mb-2">
            The Insurance <span className="text-primary">Playbook</span>
          </h2>
          <p className="text-slate-400 font-medium text-sm leading-relaxed">
            Professional strategies to ensure your Total Loss offer stays in the "Best Case" scenario.
          </p>
        </div>
      </div>

      {/* Glossmorphic Navigation */}
      <div className="flex p-2 bg-slate-50 border-b border-slate-100">
        {TIPS.map((tip) => (
          <button
            key={tip.id}
            onClick={() => setActiveTip(tip.id)}
            className={`flex-1 py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex flex-col items-center gap-2 ${
              activeTip === tip.id 
                ? 'bg-white text-primary shadow-xl scale-[1.05] z-10 border border-slate-100' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tip.icon className={`h-6 w-6 ${activeTip === tip.id ? 'text-primary' : 'text-slate-300'}`} />
            {tip.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="p-10 min-h-[340px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-2 h-10 rounded-full bg-primary/20" />
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {TIPS.find(t => t.id === activeTip)?.title}
            </h3>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 opacity-70">
              {TIPS.find(t => t.id === activeTip)?.subtitle}
            </p>
          </div>
        </div>
        {TIPS.find(t => t.id === activeTip)?.content}
      </div>

      {/* Footer CTA */}
      <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
        <button className="flex items-center justify-center gap-3 mx-auto text-primary font-black text-sm uppercase tracking-widest hover:gap-5 transition-all group">
          Speak to a Total Loss Analyst
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
