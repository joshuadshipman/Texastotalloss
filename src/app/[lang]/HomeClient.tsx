'use client';

import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import AccidentGrid from '@/components/AccidentGrid';
import InfoSections from '@/components/InfoSections';
import { useChat } from '@/components/ChatContext';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Dictionary } from '@/dictionaries/en'; // Type
import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, CarIcon, DollarSignIcon, SearchIcon, SparklesIcon } from 'lucide-react';

const ValuationCalculator = dynamic(() => import('@/components/ValuationCalculator'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const SectionCard = dynamic(() => import('@/components/SectionCard'));
import VideoGallery from '@/components/VideoGallery';
const LightboxImage = dynamic(() => import('@/components/ui/LightboxImage'));

import Footer from '@/components/Footer';

const CaseReviewModal = dynamic(() => import('@/components/CaseReviewModal'), { ssr: false });

interface HomeClientProps {
    dict: Dictionary;
    lang: string;
}

export default function HomeClient({ dict, lang }: HomeClientProps) {
    const { openChat, openReview } = useChat();

    // JSON-LD is static based on language, can be here or in Server Comp.
    // Putting here is fine.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://texastotalloss.com/#org',
                name: 'Texas Total Loss Claim Help',
                url: 'https://texastotalloss.com',
                logo: 'https://texastotalloss.com/images/logo.png',
                sameAs: [
                    'https://facebook.com/texastotalloss',
                    'https://twitter.com/texastotalloss'
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: '+1-800-555-0199',
                    contactType: 'customer service',
                    areaServed: 'US',
                    availableLanguage: ['en', 'es']
                }
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://texastotalloss.com/#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What constitutes a total loss in Texas?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'In Texas, a car is a total loss if the repair costs equal or exceed 100% of the vehicle’s actual cash value (ACV).'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'Can I keep my totaled car in Texas?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes, this is called "owner retention." The insurance company will deduct the salvage value from your settlement. Typically hard to do if a lienholder exists on the vehicle.'
                        }
                    },
                    {
                        '@type': 'Question',
                        name: 'Does Texas Auto Policies have a "Right to Appraisal"?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Most standard Texas auto policies include an Appraisal Clause, allowing you to hire an independent appraiser to dispute the lowball offer. This option may only be available through your 1st party coverage.'
                        }
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-20 md:pb-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseReviewModal dict={dict} lang={lang} />

            {/* Hero Section (Premium Glass Redesign V2.1 - Safe Gradients) */}
            <header className="bg-gradient-to-b from-blue-950 via-slate-900 to-black text-white pt-20 pb-16 px-4 text-center relative overflow-hidden">

                {/* Abstract Background Noise - Removed for purity/speed */}

                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full shadow-xl animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-blue-100">{dict.hero.badge}</span>
                    </div>

                    {/* Main Title (Clean White & Gradient Gold) */}
                    <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none drop-shadow-2xl">
                        <span className="block text-white mb-2">{dict.hero.title_main}</span>
                        <span className="block bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                            {dict.hero.title_sub}
                        </span>
                    </h1>

                    {/* Subtext (Concise) */}
                    <p className="text-lg md:text-2xl font-medium text-blue-200/80 max-w-2xl mx-auto leading-relaxed">
                        Don't let insurance adjusters underpay you. Get your <span className="text-white font-bold decoration-blue-500 underline underline-offset-4 decoration-2">True Market Value</span> instantly.
                    </p>

                    {/* Primary Call to Action - Glass Container */}
                    <div className="py-8 relative group flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl opacity-30 rounded-full group-hover:opacity-50 transition duration-500"></div>
                        <button
                            onClick={openReview}
                            className="relative w-full max-w-md h-20 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-black rounded-2xl shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-4 text-xl md:text-2xl transform hover:scale-[1.02] border border-red-400/30"
                        >
                            <SparklesIcon size={32} className="text-yellow-200 animate-pulse" />
                            <span>{dict.buttons.ai_review}</span>
                        </button>
                        <p className="mt-3 text-xs text-blue-400/60 font-medium uppercase tracking-widest">{dict.hero.help_text}</p>
                    </div>

                    {/* Secondary Actions - Clean Glass Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-4 border-t border-white/20">
                        <button onClick={() => openChat('call')} className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm">
                            <span className="text-white font-bold text-sm group-hover:text-blue-200">{dict.buttons.call_now}</span>
                        </button>
                        <button onClick={() => openChat('schedule')} className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm">
                            <span className="text-white font-bold text-sm group-hover:text-blue-200">{dict.buttons.schedule}</span>
                        </button>
                        <button onClick={() => openChat('sms')} className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm">
                            <span className="text-white font-bold text-sm group-hover:text-blue-200">{dict.buttons.sms}</span>
                        </button>
                        <button onClick={() => openChat('live')} className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all backdrop-blur-sm">
                            <span className="text-white font-bold text-sm group-hover:text-blue-200">{dict.buttons.live_chat}</span>
                        </button>
                    </div>
                </div>
            </header>

            <div id="calculator">
                <ValuationCalculator dict={dict} />
            </div>

            {/* 2. Demand Letter Tool (Moved to Top) */}
            <section className="bg-white py-8 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                            <FileTextIcon size={200} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white"><FileTextIcon className="text-yellow-400" /> Challenge Low Offers</h3>
                                <p className="text-blue-100 text-lg">Received a lowball offer? Don't argue on the phone. Send a formal legal demand letter.</p>
                            </div>
                            <a href="/tools/demand-letter" className="bg-yellow-400 text-blue-900 font-black py-4 px-8 rounded-xl shadow-lg hover:scale-105 transition hover:bg-yellow-300 whitespace-nowrap">
                                Generate Free Demand PDF &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recognized for Excellence - Trust Badges */}
            <section className="bg-white py-12 border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-blue-900 mb-8 uppercase tracking-wide">{dict.sections.trust_badges.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {/* Badge 1 */}
                        <div className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                                <SparklesIcon size={24} />
                            </div>
                            <span className="font-extrabold text-gray-900">5.0 Rating</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Client Reviews</span>
                        </div>
                        {/* Badge 2 */}
                        <div className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                <ShieldCheckIcon size={24} />
                            </div>
                            <span className="font-extrabold text-gray-900">Verified</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Trusted Firm</span>
                        </div>
                        {/* Badge 3 */}
                        <div className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                <DollarSignIcon size={24} />
                            </div>
                            <span className="font-extrabold text-gray-900">No Win No Fee</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Guarantee</span>
                        </div>
                        {/* Badge 4 */}
                        <div className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                <CarIcon size={24} />
                            </div>
                            <span className="font-extrabold text-gray-900">Total Loss</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Specialists</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400 font-medium">{dict.sections.trust_badges.sub}</p>
                </div>
            </section>

            {/* Accident Types Grid */}
            <AccidentGrid dict={dict} />

            {/* Informational Sections (Why Hire, Liability, Urgency) */}
            <InfoSections />

            {/* Video Knowledge Library (Interactive) */}
            <VideoGallery />


            <section className="py-12 px-4 bg-white" id="resources">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{dict.sections.resources_title}</h2>
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{dict.sections.resources_title}</h2>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-blue-800 uppercase tracking-wider">{dict.sections.resources_title}</span>
                            <span className="text-xs text-blue-500">Scroll for more ↓</span>
                        </div>
                        <div className="h-[500px] overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50">
                            {/* 1. Accident Checklist */}
                            <SectionCard title={dict.sections.checklist.title} subtitle={dict.sections.checklist.subtitle} icon={<CarIcon size={24} />} colorClass="bg-red-600">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-red-600 mb-4 uppercase">{dict.sections.checklist.card_title}</h2></div>
                                {dict.sections.checklist.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.checklist.content}</p>}
                                {dict.sections.checklist.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.checklist.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-red-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 2. Mitigation */}
                            <SectionCard title={dict.sections.mitigate.title} subtitle={dict.sections.mitigate.subtitle} icon={<ShieldCheckIcon size={24} />} colorClass="bg-emerald-700">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.mitigate.main_title}</h2></div>
                                {dict.sections.mitigate.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.mitigate.content}</p>}
                                {dict.sections.mitigate.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.mitigate.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-emerald-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 3. Storage */}
                            <SectionCard title={dict.sections.storage.title} subtitle={dict.sections.storage.subtitle} icon={<DollarSignIcon size={24} />} colorClass="bg-orange-600">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.storage.main_title}</h2></div>
                                {dict.sections.storage.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.storage.content}</p>}
                                {dict.sections.storage.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.storage.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-orange-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 4. Adjuster */}
                            <SectionCard title={dict.sections.adjuster.title} subtitle={dict.sections.adjuster.subtitle} icon={<AlertTriangleIcon size={24} />} colorClass="bg-gray-700">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.adjuster.main_title}</h2></div>
                                {dict.sections.adjuster.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.adjuster.content}</p>}
                                {dict.sections.adjuster.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.adjuster.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-gray-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 5. Total Loss */}
                            <SectionCard title={dict.sections.total_loss.title} subtitle={dict.sections.total_loss.subtitle} icon={<CarIcon size={24} />} colorClass="bg-red-700">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.total_loss.main_title}</h2></div>
                                {dict.sections.total_loss.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.total_loss.content}</p>}
                                {dict.sections.total_loss.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.total_loss.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-red-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 6. Market Value */}
                            <SectionCard title={dict.sections.market.title} subtitle={dict.sections.market.subtitle} icon={<DollarSignIcon size={24} />} colorClass="bg-green-600">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.market.main_title}</h2></div>
                                {dict.sections.market.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.market.content}</p>}
                                {dict.sections.market.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.market.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-green-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 7. Fault */}
                            <SectionCard title={dict.sections.fault.title} subtitle={dict.sections.fault.subtitle} icon={<AlertTriangleIcon size={24} />} colorClass="bg-purple-700">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.fault.main_title}</h2></div>
                                {dict.sections.fault.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.fault.content}</p>}
                                {dict.sections.fault.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.fault.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-purple-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 8. Coverage */}
                            <SectionCard title={dict.sections.coverage.title} subtitle={dict.sections.coverage.subtitle} icon={<FileTextIcon size={24} />} colorClass="bg-blue-700">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.coverage.main_title}</h2></div>
                                {dict.sections.coverage.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.coverage.content}</p>}
                                {dict.sections.coverage.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.coverage.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-blue-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 9. UM Law */}
                            <SectionCard title={dict.sections.um_law.title} subtitle={dict.sections.um_law.subtitle} icon={<ShieldCheckIcon size={24} />} colorClass="bg-indigo-700">
                                <div className="text-center mb-6"><h2 className="text-3xl font-black text-gray-800 mb-4">{dict.sections.um_law.main_title}</h2></div>
                                {dict.sections.um_law.content && <p className="mb-6 text-gray-700 font-medium">{dict.sections.um_law.content}</p>}
                                {dict.sections.um_law.bullets && (
                                    <ul className="space-y-3">
                                        {dict.sections.um_law.bullets.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1 min-w-[6px] w-2 h-2 rounded-full bg-indigo-500"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </SectionCard>

                            {/* 10. FAQ Section */}
                            <SectionCard title={dict.sections.faq.title} subtitle={dict.sections.faq.subtitle} icon={<SearchIcon size={24} />} colorClass="bg-blue-600">
                                <div className="space-y-6 text-left">
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q1}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a1}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q2}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a2}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q3}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a3}</p>
                                    </div>

                                    {/* Expanded FAQs */}
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q4}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a4}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q5}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a5}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q6}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a6}</p>
                                    </div>
                                </div>
                            </SectionCard>

                        </div>
                    </div>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />

            <ChatWidget dict={dict} />
            <MobileNav />
        </main >
    );
}
