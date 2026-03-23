/* eslint-disable */
'use client';

import React from 'react';
import { accidentTypes } from '../data/accidentTypes'; // Keeps icons valid
import { useChat } from './ChatContext';
import dynamic from 'next/dynamic';

const SectionCard = dynamic(() => import('./SectionCard'));

interface AccidentGridProps {
    dict: any;
}

export default function AccidentGrid({ dict }: AccidentGridProps) {
    const { openChat } = useChat();
    // Fallbacks
    const title = dict?.accident_grid?.title || dict?.accident_types?.title || "Common Auto Accident Types";
    const sub = dict?.accident_grid?.subtitle || dict?.accident_types?.subtitle || "We have specialized strategies for every scenario to maximize your recovery.";

    // Get general CTA from dict (or fallback)
    const ctaTitle = dict?.accident_types?.cta_title || "Involved in this type of crash?";
    const ctaText = dict?.accident_types?.cta_text || "Get a free specialized case review now.";
    const ctaBtn = dict?.accident_types?.cta_btn || "Start Review";

    return (
        <section className="py-16 bg-slate-950 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16 px-4">
                    <span className="text-[11px] font-black text-gold-500 uppercase tracking-[0.4em] block mb-3 animate-in fade-in slide-in-from-bottom-2">STRATEGIC TRIAGE</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 tracking-tight leading-tight">
                        {title}
                    </h2>
                    <div className="h-1.5 w-20 bg-gold-500 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        {sub}
                    </p>
                </div>

                {/* Condensed Card Container */}
                <div className="bg-slate-900 rounded-2xl shadow-xl border border-white/10 overflow-hidden">
                    {/* Header inside card */}
                    <div className="bg-slate-800 p-4 border-b border-white/10 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">{title}</span>
                        <span className="text-xs text-slate-500">Scroll for more ↓</span>
                    </div>

                    {/* Scrollable Area */}
                    <div className="h-[320px] overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-900/50">
                        {accidentTypes.map((type) => {
                            const Icon = type.icon;
                            // Lookup localized data using ID
                            const localData = dict?.accident_types?.items?.[type.id] || {};

                            // Merge/Fallback
                            const displayTitle = localData.title || type.title;
                            const displayDesc = localData.desc || type.description;
                            const stats = localData.stats || {};

                            // Map stats securely
                            // Default to English object if stats are missing in dictionary
                            const defaultStats = type.stats;

                            return (
                                <SectionCard
                                    key={type.id}
                                    title={displayTitle}
                                    subtitle={ctaText}
                                    icon={<Icon size={24} />}
                                    colorClass={type.color}
                                >
                                    <div className="space-y-10 py-4">
                                        {/* Stats Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {(stats.l1 ? [
                                                { v: stats.v1, l: stats.l1, s: stats.s1 },
                                                { v: stats.v2, l: stats.l2, s: stats.s2 },
                                                { v: stats.v3, l: stats.l3, s: stats.s3 }
                                            ] : defaultStats.map(s => ({ v: s.value, l: s.label, s: s.sub }))).map((stat, idx) => (
                                                <div key={idx} className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 shadow-sm text-center transform hover:-translate-y-1 transition-transform">
                                                    <div className={`text-3xl font-black mb-1 ${type.color.replace('bg-', 'text-')}`}>{stat.v}</div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</div>
                                                    <div className="text-[10px] text-slate-300 font-bold uppercase">{stat.s}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-gold-500 rounded-full"></div>
                                                Legal Case Strategy
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                                {displayDesc}
                                            </p>
                                        </div>

                                        {/* CTA */}
                                        <div className="p-8 bg-primary rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-b-4 border-black/20 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full translate-x-10 -translate-y-10"></div>
                                            <div className="relative z-10 text-center md:text-left text-white">
                                                <p className="font-black text-xl md:text-2xl tracking-tight mb-1">{ctaTitle}</p>
                                                <p className="text-sm font-medium text-blue-200 uppercase tracking-widest opacity-80">{ctaText}</p>
                                            </div>
                                            <button
                                                onClick={() => openChat('standalone')}
                                                className="w-full md:w-auto bg-gold-500 hover:bg-gold-400 text-navy-900 font-black py-4 px-10 rounded-2xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest relative z-10 border-b-4 border-gold-700"
                                            >
                                                {ctaBtn}
                                            </button>
                                        </div>
                                    </div>
                                </SectionCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
