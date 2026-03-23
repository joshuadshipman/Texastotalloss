'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Dictionary } from '../../dictionaries/en';
import { useChat } from '../../components/ChatContext';
import AccidentGrid from '../../components/AccidentGrid';
import ChatWidget from '../../components/ChatWidget';
import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, CarIcon, DollarSignIcon, SearchIcon, SparklesIcon, PhoneCall } from 'lucide-react';

import SectionCard from '../../components/SectionCard';
import VideoGallery from '../../components/VideoGallery';
import Footer from '../../components/Footer';

import { ContentItem } from '../../lib/content';
import TrendingQuestions from '../../components/TrendingQuestions';

const CitySearch = dynamic(() => import('../../components/CitySearch'));
const ValuationCalculator = dynamic(() => import('../../components/ValuationCalculator'), { ssr: false });
const MobileNav = dynamic(() => import('../../components/MobileNav'), { ssr: false });
const LightboxImage = dynamic(() => import('../../components/ui/LightboxImage'));
const ExitIntentPopup = dynamic(() => import('../../components/ExitIntentPopup'), { ssr: false });
const CaseReviewModal = dynamic(() => import('../../components/CaseReviewModal'), { ssr: false });

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
                '@type': 'LocalBusiness',
                '@id': 'https://texastotalloss.com/#localbusiness',
                name: 'Texas Total Loss Claim and Injury Help',
                image: 'https://texastotalloss.com/images/logo.png',
                url: 'https://texastotalloss.com',
                telephone: '+1-469-729-4423',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Principal Office',
                    addressLocality: 'Pearland',
                    addressRegion: 'TX',
                    postalCode: '77584',
                    addressCountry: 'US'
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 29.5636,
                    longitude: -95.2860
                },
                areaServed: {
                    '@type': 'State',
                    name: 'Texas'
                },
                openingHoursSpecification: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday'
                    ],
                    opens: '00:00',
                    closes: '23:59'
                }
            },
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
                    telephone: '+1-469-729-4423',
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
            {/* eslint-disable-next-line react/no-danger */}
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
                    <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight leading-[1.1] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <span className="block text-white mb-4">{dict.hero.title_main}</span>
                        <span className="block bg-gradient-to-r from-gold-400 via-yellow-100 to-gold-500 bg-clip-text text-transparent italic pb-2">
                            {dict.hero.title_sub}
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-xl md:text-2xl font-light text-slate-300/90 max-w-3xl mx-auto leading-relaxed font-sans">
                        <span className="block mb-2">{dict.hero.subtext_line1}</span>
                        {dict.hero.subtext_line2_pre} <span className="text-gold-500 font-bold decoration-gold-500/30 underline underline-offset-4 decoration-1">{dict.hero.subtext_highlight}</span> {dict.hero.subtext_line2_post}
                    </p>

                    {/* Primary Call to Action - Gold Power Button */}
                    <div className="py-12 relative group flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 delay-300">
                        <div className="absolute inset-0 bg-gold-500/30 blur-[80px] opacity-40 group-hover:opacity-70 transition duration-700 rounded-full scale-125"></div>
                        <button
                            onClick={openReview}
                            className="relative w-full max-w-xl h-24 bg-gradient-to-b from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-navy-900 font-serif font-black rounded-2xl shadow-[0_25px_60px_-15px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center gap-6 text-2xl md:text-4xl transform hover:-translate-y-2 active:scale-95 border-t-4 border-white/30 backdrop-blur-sm overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                            <SparklesIcon size={40} className="text-navy-900/60 animate-pulse" />
                            <span className="tracking-tighter">{dict.buttons.ai_review}</span>
                        </button>

                        {/* Click-to-Call Button */}
                        <a
                            href="tel:+14697294423"
                            className="mt-4 inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg"
                        >
                            <PhoneCall className="h-6 w-6 text-green-400 animate-pulse" />
                            <span>(469) 729-4423</span>
                            <span className="text-sm text-white/60">Tap to Call</span>
                        </a>

                        <p className="mt-4 text-sm text-blue-200/60 font-medium uppercase tracking-widest font-sans">{dict.hero.help_text}</p>
                    </div>

                    {/* City Search Bar */}
                    <div className="max-w-xl mx-auto mb-12 text-left bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
                        <label className="text-xs font-bold text-gold-500 uppercase tracking-wider ml-1 mb-2 block font-sans">{dict.hero.find_guide}</label>
                        <CitySearch lang={lang as 'en' | 'es'} />
                    </div>

                    {/* Secondary Actions - Elegant Grid (Ghost Style) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/5">
                        <button onClick={() => openChat('call')} className="group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 border-2 border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 w-full h-32 backdrop-blur-md transform hover:-translate-y-1">
                            <span className="text-gold-400 font-black text-lg group-hover:text-white font-sans tracking-widest uppercase transition-colors">{dict.buttons.call_now}</span>
                        </button>
                        <button onClick={() => openChat('schedule')} className="group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 border-2 border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 w-full h-32 backdrop-blur-md transform hover:-translate-y-1">
                            <span className="text-gold-400 font-black text-lg group-hover:text-white font-sans tracking-widest uppercase transition-colors">{dict.buttons.schedule}</span>
                        </button>
                        <button onClick={() => openChat('sms')} className="group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 border-2 border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 w-full h-32 backdrop-blur-md transform hover:-translate-y-1">
                            <span className="text-gold-400 font-black text-lg group-hover:text-white font-sans tracking-widest uppercase transition-colors">{dict.buttons.sms}</span>
                        </button>
                        <button onClick={() => openChat('live')} className="group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/80 hover:bg-slate-800 border-2 border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 w-full h-32 backdrop-blur-md transform hover:-translate-y-1">
                            <span className="text-gold-400 font-black text-lg group-hover:text-white font-sans tracking-widest uppercase transition-colors">{dict.buttons.live_chat}</span>
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
            <section className="bg-slate-50 py-24 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block mb-12">
                        <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] block mb-2">{dict.sections.trust_badges.sub || "VERIFIED LEGAL EXCELLENCE"}</span>
                        <h3 className="text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight">{dict.sections.trust_badges.title}</h3>
                        <div className="h-1.5 w-24 bg-gold-500 mx-auto mt-6 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: <SparklesIcon size={36} />, title: dict.sections.trust_badges.badge1_title, sub: dict.sections.trust_badges.badge1_sub },
                            { icon: <ShieldCheckIcon size={36} />, title: dict.sections.trust_badges.badge2_title, sub: dict.sections.trust_badges.badge2_sub },
                            { icon: <DollarSignIcon size={36} />, title: dict.sections.trust_badges.badge3_title, sub: dict.sections.trust_badges.badge3_sub },
                            { icon: <CarIcon size={36} />, title: dict.sections.trust_badges.badge4_title, sub: dict.sections.trust_badges.badge4_sub }
                        ].map((badge, idx) => (
                            <div key={idx} className="flex flex-col items-center p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <div className="w-20 h-20 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                    {badge.icon}
                                </div>
                                <span className="font-serif font-black text-2xl text-slate-900 leading-tight">{badge.title}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-4 font-black">{badge.sub}</span>
                            </div>
                        ))}
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
