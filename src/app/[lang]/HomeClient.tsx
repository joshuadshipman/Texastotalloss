'use client';

import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import AccidentGrid from '@/components/AccidentGrid';
import InfoSections from '@/components/InfoSections';
import { useChat } from '@/components/ChatContext';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Dictionary } from '@/dictionaries/en'; // Type
import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, CarIcon, DollarSignIcon, SearchIcon, SparklesIcon } from 'lucide-react';

const CitySearch = dynamic(() => import('@/components/CitySearch'));

const ValuationCalculator = dynamic(() => import('@/components/ValuationCalculator'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const SectionCard = dynamic(() => import('@/components/SectionCard'));
import VideoGallery from '@/components/VideoGallery';
const LightboxImage = dynamic(() => import('@/components/ui/LightboxImage'));

import Footer from '@/components/Footer';

const CaseReviewModal = dynamic(() => import('@/components/CaseReviewModal'), { ssr: false });

import { ContentItem } from '@/lib/content';
import TrendingQuestions from '@/components/TrendingQuestions';

// ... imports

interface HomeClientProps {
    dict: Dictionary;
    lang: string;
    trendingContent?: ContentItem[];
}

export default function HomeClient({ dict, lang, trendingContent }: HomeClientProps) {
    const { openChat, openReview, openChatWithQuestion } = useChat();

    // JSON-LD is static based on language, can be here or in Server Comp.
    // Putting here is fine.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://texastotalloss.com/#org',
                name: 'Texas Total Loss Claim and Injury Help',
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
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '5.0',
                    reviewCount: '124',
                    bestRating: '5',
                    worstRating: '1'
                }
            },
            {
                '@type': 'FAQPage',
                speakable: {
                    '@type': 'SpeakableSpecification',
                    cssSelector: ['h3', 'p']
                },
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
        <main className="min-h-screen bg-neutral-900 text-white selection:bg-red-500/30">
            {/* Privacy Disclaimer Banner */}
            {/* Privacy Disclaimer Banner */}
            <div className="bg-slate-900/80 border-b border-white/10 text-center py-2 px-4 backdrop-blur-sm">
                <p className="text-xs md:text-sm text-slate-400 font-medium tracking-wide">
                    {dict.privacy_banner}
                </p>
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CaseReviewModal dict={dict} lang={lang} />

            {/* Hero Section (Premium Legal Authority - Navy & Gold) */}
            {/* Hero Section (Premium Legal Authority - Slate & Gold) */}
            <header className="relative bg-slate-950 text-white pt-12 md:pt-24 pb-32 md:pb-40 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/legal-bg-overlay.jpg')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-slate-950"></div>

                <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-gold-500/30 px-6 py-2 rounded-full shadow-2xl animate-fade-in-up">
                        <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse box-shadow-gold"></span>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-gold-500 font-sans">{dict.hero.badge}</span>
                    </div>

                    {/* Main Title (Serif Authority) */}
                    <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-tight drop-shadow-2xl">
                        <span className="block text-white mb-4">{dict.hero.title_main}</span>
                        <span className="block bg-gradient-to-r from-gold-500 via-yellow-200 to-gold-600 bg-clip-text text-transparent italic">
                            {dict.hero.title_sub}
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl md:text-2xl font-light text-slate-300/90 max-w-3xl mx-auto leading-relaxed font-sans">
                        <span className="block mb-2">{dict.hero.subtext_line1}</span>
                        {dict.hero.subtext_line2_pre} <span className="text-gold-500 font-bold decoration-gold-500/30 underline underline-offset-4 decoration-1">{dict.hero.subtext_highlight}</span> {dict.hero.subtext_line2_post}
                    </p>

                    {/* Primary Call to Action - Gold Power Button */}
                    <div className="py-10 relative group flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-gold-500/20 blur-[60px] opacity-40 rounded-full group-hover:opacity-60 transition duration-500"></div>
                        <button
                            onClick={openReview}
                            className="relative w-full max-w-lg h-24 bg-gradient-to-b from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-900 font-serif font-black rounded-sm shadow-[0_10px_40px_-10px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-5 text-2xl md:text-3xl transform hover:-translate-y-1 border-t border-white/20"
                        >
                            <SparklesIcon size={36} className="text-white fill-white/20 animate-pulse" />
                            <span className="tracking-wide">{dict.buttons.ai_review}</span>
                        </button>
                        <p className="mt-4 text-sm text-blue-200/60 font-medium uppercase tracking-widest font-sans">{dict.hero.help_text}</p>
                    </div>

                    {/* City Search Bar */}
                    <div className="max-w-xl mx-auto mb-12 text-left bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                        <label className="text-xs font-bold text-gold-500 uppercase tracking-wider ml-1 mb-2 block font-sans">{dict.hero.find_guide}</label>
                        <CitySearch lang={lang as 'en' | 'es'} />
                    </div>

                    {/* Secondary Actions - Elegant Grid (Ghost Style) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/5">
                        <button onClick={() => openChat('call')} className="group flex flex-col items-center justify-center p-4 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all duration-300 h-full w-full">
                            <span className="text-slate-200 font-bold text-sm group-hover:text-gold-400 font-sans tracking-wide uppercase transition-colors">{dict.buttons.call_now}</span>
                        </button>
                        <button onClick={() => openChat('schedule')} className="group flex flex-col items-center justify-center p-4 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all duration-300 h-full w-full">
                            <span className="text-slate-200 font-bold text-sm group-hover:text-gold-400 font-sans tracking-wide uppercase transition-colors">{dict.buttons.schedule}</span>
                        </button>
                        <button onClick={() => openChat('sms')} className="group flex flex-col items-center justify-center p-4 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all duration-300 h-full w-full">
                            <span className="text-slate-200 font-bold text-sm group-hover:text-gold-400 font-sans tracking-wide uppercase transition-colors">{dict.buttons.sms}</span>
                        </button>
                        <button onClick={() => openChat('live')} className="group flex flex-col items-center justify-center p-4 rounded-lg bg-transparent hover:bg-white/5 border border-white/10 hover:border-gold-500/50 transition-all duration-300 h-full w-full">
                            <span className="text-slate-200 font-bold text-sm group-hover:text-gold-400 font-sans tracking-wide uppercase transition-colors">{dict.buttons.live_chat}</span>
                        </button>
                    </div>
                </div>

                {/* TRUST BAR / RESULTS TICKER (New) */}
                <div className="absolute bottom-0 left-0 right-0 bg-slate-950 border-t border-white/5 py-3 md:py-6 overflow-hidden z-20">
                    <div className="flex gap-12 animate-scroll-text whitespace-nowrap text-gold-500 text-lg md:text-4xl font-serif font-black italic tracking-wider drop-shadow-md">
                        {(dict.trust_ticker || []).map((item: string, i: number) => (
                            <React.Fragment key={i}>
                                <span>{item}</span> {i < (dict.trust_ticker?.length || 0) - 1 && <span className="text-white/20">•</span>}
                            </React.Fragment>
                        ))}
                        {(!dict.trust_ticker || dict.trust_ticker.length === 0) && (
                            <><span>$5.2M Truck Accident Settlement</span> <span className="text-white/20">•</span> <span>$1.8M Company Vehicle Crash</span></>
                        )}
                    </div>
                </div>
            </header>

            {/* Trending Questions Section */}
            {trendingContent && trendingContent.length > 0 && (
                <TrendingQuestions items={trendingContent} />
            )}

            {/* Informational Sections (Why Hire, Liability, Urgency) - Moved Above Calculator */}
            <InfoSections dict={dict} />

            <div id="calculator">
                <ValuationCalculator dict={dict} />
            </div>

            {/* 2. Demand Letter Tool (Visual Update) */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-slate-900 text-white rounded-sm p-10 shadow-2xl relative overflow-hidden group border border-gold-500/20">
                        <div className="absolute right-0 top-0 opacity-5 transform translate-x-10 -translate-y-10">
                            <FileTextIcon size={250} />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h3 className="text-3xl font-serif font-bold mb-4 flex items-center gap-3 text-white">
                                    <FileTextIcon className="text-gold-500" /> {dict?.info_sections?.demand_letter?.title || "Challenge Low Offers"}
                                </h3>
                                <p className="text-slate-300 text-lg font-light leading-relaxed">{dict?.info_sections?.demand_letter?.desc || "Received a lowball offer? Don't argue on the phone. Send a formal legal demand letter experienced adjusters respect."}</p>
                            </div>
                            <a href="/tools/demand-letter" className="bg-gold-500 text-navy-900 font-black py-5 px-10 rounded-sm shadow-lg hover:scale-105 transition hover:bg-gold-400 whitespace-nowrap uppercase tracking-widest font-sans border border-white/10">
                                {dict?.info_sections?.demand_letter?.cta || "Generate Free Demand PDF"} &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recognized for Excellence - Trust Badges (Visual Update) */}
            <section className="bg-white py-16 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-block border-b-2 border-gold-500 mb-8 pb-2">
                        <h3 className="text-3xl font-serif font-bold text-navy-900 uppercase tracking-widest">{dict.sections.trust_badges.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {/* Badge 1 */}
                        <div className="flex flex-col items-center p-8 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-navy-900 text-gold-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <SparklesIcon size={32} />
                            </div>
                            <span className="font-serif font-bold text-xl text-navy-900">{dict.sections.trust_badges.badge1_title}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-sans font-bold">{dict.sections.trust_badges.badge1_sub}</span>
                        </div>
                        {/* Badge 2 */}
                        <div className="flex flex-col items-center p-8 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-navy-900 text-gold-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <ShieldCheckIcon size={32} />
                            </div>
                            <span className="font-serif font-bold text-xl text-navy-900">{dict.sections.trust_badges.badge2_title}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-sans font-bold">{dict.sections.trust_badges.badge2_sub}</span>
                        </div>
                        {/* Badge 3 */}
                        <div className="flex flex-col items-center p-8 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-navy-900 text-gold-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <DollarSignIcon size={32} />
                            </div>
                            <span className="font-serif font-bold text-xl text-navy-900">{dict.sections.trust_badges.badge3_title}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-sans font-bold">{dict.sections.trust_badges.badge3_sub}</span>
                        </div>
                        {/* Badge 4 */}
                        <div className="flex flex-col items-center p-8 bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                            <div className="w-16 h-16 bg-navy-900 text-gold-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <CarIcon size={32} />
                            </div>
                            <span className="font-serif font-bold text-xl text-navy-900">{dict.sections.trust_badges.badge4_title}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest mt-2 font-sans font-bold">{dict.sections.trust_badges.badge4_sub}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accident Types Grid */}
            <AccidentGrid dict={dict} />



            {/* Video Knowledge Library (Interactive) */}
            <VideoGallery dict={dict} />


            <section className="py-12 px-4 bg-white" id="resources">
                <div className="max-w-4xl mx-auto">
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
                                {/* 10. FAQ Section */}
                                <div className="space-y-6 text-left">
                                    <div
                                        onClick={() => openChatWithQuestion(dict.sections.faq.q1, dict.sections.faq.a1)}
                                        className="cursor-pointer group hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2 group-hover:text-blue-700">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q1}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a1}</p>
                                    </div>

                                    <div
                                        onClick={() => openChatWithQuestion(dict.sections.faq.q2, dict.sections.faq.a2)}
                                        className="cursor-pointer group hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2 group-hover:text-blue-700">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q2}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a2}</p>
                                    </div>
                                    <div
                                        onClick={() => openChatWithQuestion(dict.sections.faq.q3, dict.sections.faq.a3)}
                                        className="cursor-pointer group hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2 group-hover:text-blue-700">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q3}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a3}</p>
                                    </div>

                                    {/* Expanded FAQs */}
                                    <div
                                        onClick={() => openChatWithQuestion(dict.sections.faq.q4, dict.sections.faq.a4)}
                                        className="cursor-pointer group hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2 group-hover:text-blue-700">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q4}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a4}</p>
                                    </div>
                                    <div
                                        onClick={() => openChatWithQuestion(dict.sections.faq.q5, dict.sections.faq.a5)}
                                        className="cursor-pointer group hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2 group-hover:text-blue-700">
                                            <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs">?</span>
                                            {dict.sections.faq.q5}
                                        </h3>
                                        <p className="text-gray-600 ml-8 mt-1 border-l-2 border-blue-100 pl-4">{dict.sections.faq.a5}</p>
                                    </div>
                                    <div
                                        onClick={() => openChatWithQuestion(dict.sections.faq.q6, dict.sections.faq.a6)}
                                        className="cursor-pointer group hover:bg-blue-50 p-2 -ml-2 rounded-lg transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-blue-900 flex items-center gap-2 group-hover:text-blue-700">
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
            <MobileNav dict={dict} />
        </main >
    );
}
