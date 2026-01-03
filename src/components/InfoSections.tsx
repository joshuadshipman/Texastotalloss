'use client';

import React from 'react';
import {
    ShieldCheckIcon, ScaleIcon, ClockIcon,
    AlertTriangleIcon, SearchIcon, FileTextIcon,
    CheckCircleIcon, HeartHandshakeIcon
} from 'lucide-react';

// ... imports

export default function InfoSections({ dict }: { dict: any }) {
    if (!dict || !dict.info_sections) return null;
    const txt = dict.info_sections;

    return (
        <div className="space-y-16 py-16">

            {/* Why Hire Us */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
                    <div className="bg-slate-800 text-white p-8 md:w-1/3 flex flex-col justify-center border-r border-white/5">
                        <h2 className="text-3xl font-black mb-4 uppercase leading-tight">{txt.partner_title}</h2>
                        <p className="text-slate-300 mb-6">{txt.partner_desc}</p>
                        <hr className="border-gold-500 w-12 mb-6" />
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="text-gold-500" size={32} />
                            <span className="font-bold text-sm">{txt.partner_badge}</span>
                        </div>
                    </div>
                    <div className="p-8 md:w-2/3 grid md:grid-cols-2 gap-6 bg-slate-900">
                        <div className="space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><SearchIcon size={18} className="text-gold-500" /> {txt.investigation}</h3>
                            <p className="text-sm text-slate-400">{txt.investigation_desc}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><HeartHandshakeIcon size={18} className="text-gold-500" /> {txt.communication}</h3>
                            <p className="text-sm text-slate-400">{txt.communication_desc}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><ScaleIcon size={18} className="text-gold-500" /> {txt.valuation}</h3>
                            <p className="text-sm text-slate-400">{txt.valuation_desc}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><FileTextIcon size={18} className="text-gold-500" /> {txt.court}</h3>
                            <p className="text-sm text-slate-400">{txt.court_desc}</p>
                        </div>
                        {/* New Item: Determining Responsibility */}
                        <div className="space-y-2 col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><ScaleIcon size={18} className="text-gold-500" /> {txt.responsibility_title}</h3>
                            <p className="text-sm text-slate-400">{txt.responsibility_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Trigger Bar: What NEVER to Say */}


            {/* Urgency / Prompt Action */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-white/10 flex flex-col md:flex-row">
                    {/* Left Column (Slate) */}
                    <div className="bg-slate-800 text-white p-8 md:w-1/3 flex flex-col justify-center relative overflow-hidden border-r border-white/5">
                        {/* Subtle background decoration */}
                        <ClockIcon size={120} className="absolute -bottom-10 -right-10 text-white opacity-5" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4 uppercase leading-tight">{txt.urgency_title}</h2>
                            <p className="text-slate-300 mb-6 font-medium leading-relaxed">
                                {txt.urgency_desc}
                            </p>
                            <hr className="border-gold-500 w-12 mb-6" />
                            <div className="flex items-center gap-2 text-gold-500 font-bold uppercase text-xs tracking-widest">
                                <ClockIcon size={16} />
                                <span>Time Sensitive</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Dark Grid) */}
                    <div className="p-8 md:w-2/3 grid md:grid-cols-2 gap-x-8 gap-y-8 items-start bg-slate-900">
                        <div className="space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <SearchIcon size={18} className="text-gold-500" /> {txt.urgency_cards.evidence.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{txt.urgency_cards.evidence.desc}</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <ClockIcon size={18} className="text-gold-500" /> {txt.urgency_cards.statute.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{txt.urgency_cards.statute.desc}</p>
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2 border-t border-white/10 pt-4 mt-2">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <ScaleIcon size={18} className="text-gold-500" /> {txt.urgency_cards.leverage.title}
                            </h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{txt.urgency_cards.leverage.desc}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
