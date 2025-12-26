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
                        {/* New Item: Determining Responsibility */}
                        <div className="space-y-2 col-span-1 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><ScaleIcon size={18} className="text-blue-600" /> {txt.responsibility_title}</h3>
                            <p className="text-sm text-gray-600">{txt.responsibility_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Trigger Bar: What NEVER to Say */}
            <section className="max-w-4xl mx-auto px-4 transform h-98">
                <div 
                    className="relative bg-gray-900 rounded-full shadow-2xl border-4 border-white/10 overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300"
                    onClick={() => document.getElementById('video-gallery')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="flex items-center justify-between p-1 pl-2 md:pl-4">
                        {/* Left: Icon/Thumbnail */}
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:animate-pulse relative z-10 border-2 border-white/20">
                                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-8 md:h-8 text-white relative z-20 ml-1">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex flex-col relative z-10 py-3">
                                <span className="text-red-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-0.5">Critical Warning</span>
                                <h3 className="text-white font-black text-sm md:text-xl tracking-tight leading-none group-hover:text-blue-100 transition-colors">
                                    Protect Your Claim: <span className="text-red-400">What NEVER to Say</span> to an Adjuster
                                </h3>
                            </div>
                        </div>

                        {/* Right: CTA Arrow (Hidden on small mobile) */}
                        <div className="mr-6 hidden md:flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                            <span className="text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">Watch Now</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Urgency / Prompt Action */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    {/* Left Column (Blue) */}
                    <div className="bg-blue-900 text-white p-8 md:w-1/3 flex flex-col justify-center relative overflow-hidden">
                        {/* Subtle background decoration */}
                        <ClockIcon size={120} className="absolute -bottom-10 -right-10 text-blue-800 opacity-20" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-black mb-4 uppercase leading-tight">{txt.urgency_title}</h2>
                            <p className="text-blue-200 mb-6 font-medium leading-relaxed">
                                {txt.urgency_desc}
                            </p>
                            <hr className="border-blue-700 w-12 mb-6" />
                            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase text-xs tracking-widest">
                                <ClockIcon size={16} />
                                <span>Time Sensitive</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (White Grid) */}
                    <div className="p-8 md:w-2/3 grid md:grid-cols-2 gap-x-8 gap-y-8 items-start">
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2">
                                <SearchIcon size={18} className="text-blue-600" /> {txt.urgency_cards.evidence.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{txt.urgency_cards.evidence.desc}</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2">
                                <ClockIcon size={18} className="text-blue-600" /> {txt.urgency_cards.statute.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{txt.urgency_cards.statute.desc}</p>
                        </div>

                        <div className="space-y-2 col-span-1 md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2">
                                <ScaleIcon size={18} className="text-blue-600" /> {txt.urgency_cards.leverage.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{txt.urgency_cards.leverage.desc}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
