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
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    <div className="bg-blue-900 text-white p-8 md:w-1/3 flex flex-col justify-center">
                        <h2 className="text-3xl font-black mb-4 uppercase leading-tight">{txt.partner_title}</h2>
                        <p className="text-blue-200 mb-6">{txt.partner_desc}</p>
                        <hr className="border-blue-700 w-12 mb-6" />
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="text-yellow-400" size={32} />
                            <span className="font-bold text-sm">{txt.partner_badge}</span>
                        </div>
                    </div>
                    <div className="p-8 md:w-2/3 grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><SearchIcon size={18} className="text-blue-600" /> {txt.investigation}</h3>
                            <p className="text-sm text-gray-600">{txt.investigation_desc}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><HeartHandshakeIcon size={18} className="text-blue-600" /> {txt.communication}</h3>
                            <p className="text-sm text-gray-600">{txt.communication_desc}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><ScaleIcon size={18} className="text-blue-600" /> {txt.valuation}</h3>
                            <p className="text-sm text-gray-600">{txt.valuation_desc}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><FileTextIcon size={18} className="text-blue-600" /> {txt.court}</h3>
                            <p className="text-sm text-gray-600">{txt.court_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Responsibility & Causes Unified Section */}
            {/* Responsibility & Causes Cards */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Responsibility Card */}
                    {/* Responsibility Card (Dark Blue Theme) */}
                    <div className="bg-blue-900 text-white rounded-2xl shadow-xl border border-blue-800 p-8 hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-800 text-yellow-400 rounded-lg group-hover:scale-110 transition-transform shadow-inner">
                                <ScaleIcon size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-white">{txt.responsibility_title}</h2>
                        </div>

                        <p className="text-blue-100 mb-6 font-medium leading-relaxed">
                            {txt.responsibility_desc}
                        </p>
                        <ul className="space-y-3">
                            {txt.responsibility_list.map((item: string, i: number) => (
                                <li key={i} className="flex items-center gap-3 text-white p-3 rounded-lg bg-blue-800/50 border border-blue-700 hover:bg-blue-800 transition-colors">
                                    <ShieldCheckIcon size={18} className="text-green-400 shrink-0" />
                                    <span className="font-semibold">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Common Causes Card */}
                    {/* Common Causes Card (Dark Blue Theme) */}
                    <div className="bg-blue-900 text-white rounded-2xl shadow-xl border border-blue-800 p-8 hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-800 text-red-400 rounded-lg group-hover:scale-110 transition-transform shadow-inner">
                                <AlertTriangleIcon size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-white">{txt.causes_title}</h2>
                        </div>

                        <p className="text-blue-100 mb-6 font-medium leading-relaxed">
                            {txt.causes_desc}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {txt.causes_list.map((cause: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-white bg-blue-800/50 p-3 rounded-lg border border-blue-700 hover:bg-blue-800 transition-colors">
                                    <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                                    <span className="font-bold">{cause}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Urgency / Prompt Action */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-blue-900 text-white rounded-2xl shadow-xl overflow-hidden p-10 md:p-16 text-center">
                    <ClockIcon size={48} className="text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight">{txt.urgency_title}</h2>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
                        {txt.urgency_desc}
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition-colors">
                            <h3 className="font-bold text-yellow-300 mb-2 text-lg">{txt.urgency_cards.evidence.title}</h3>
                            <p className="text-sm text-blue-100/90 leading-relaxed">{txt.urgency_cards.evidence.desc}</p>
                        </div>
                        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition-colors">
                            <h3 className="font-bold text-yellow-300 mb-2 text-lg">{txt.urgency_cards.statute.title}</h3>
                            <p className="text-sm text-blue-100/90 leading-relaxed">{txt.urgency_cards.statute.desc}</p>
                        </div>
                        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition-colors">
                            <h3 className="font-bold text-yellow-300 mb-2 text-lg">{txt.urgency_cards.leverage.title}</h3>
                            <p className="text-sm text-blue-100/90 leading-relaxed">{txt.urgency_cards.leverage.desc}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
