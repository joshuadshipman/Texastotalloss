'use client';

import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { useChat } from '@/components/ChatContext';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Dictionary } from '@/dictionaries/en'; // Type
import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, CarIcon, DollarSignIcon, SearchIcon, SparklesIcon } from 'lucide-react';

const ValuationCalculator = dynamic(() => import('@/components/ValuationCalculator'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const SectionCard = dynamic(() => import('@/components/SectionCard'));
import VideoPromo from '@/components/VideoPromo';
const LightboxImage = dynamic(() => import('@/components/ui/LightboxImage'));

const CaseReviewModal = dynamic(() => import('@/components/CaseReviewModal'), { ssr: false });

type HomeClientProps = {
    dict: Dictionary;
    lang: 'en' | 'es';
};

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
                        name: 'Does Texas have a "Right to Appraisal"?',
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
            <CaseReviewModal dict={dict} />

            {/* Hero Section */}
            <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="/images/worried_customer.png" alt="Worried driver" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-900/50"></div>
                </div>
                <div className="max-w-4xl mx-auto space-y-4 relative z-10">
                    <div className="inline-block bg-blue-700/50 backdrop-blur-sm border border-blue-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                        {dict.hero.badge}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                        <span className="block text-white mb-2 text-red-500 font-bold">{dict.hero.title_main}</span>
                        <span className="block text-blue-300">{dict.hero.title_sub}</span>
                    </h1>
                    <div className="text-lg md:text-xl font-medium text-blue-100 space-y-4 max-w-3xl mx-auto bg-blue-800/50 p-6 rounded-xl border border-blue-400/30">
                        <p className="text-2xl md:text-3xl font-extrabold text-amber-300 italic leading-snug drop-shadow-sm">
                            "{dict.hero.quote_main}"
                        </p>
                        <p className="font-bold text-white text-lg">
                            {dict.hero.quote_sub}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:flex-row gap-4 pt-6 max-w-4xl mx-auto w-full">
                        <button onClick={openReview} className="flex-1 h-16 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black rounded-xl shadow-xl transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2 animate-pulse border-2 border-white/20">
                            <SparklesIcon size={20} className="text-yellow-300" />
                            <span>{dict.buttons.ai_review}</span>
                        </button>
                        <button onClick={() => openChat('call')} className="flex-1 h-16 bg-white text-blue-900 hover:bg-gray-100 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2">
                            <span>{dict.buttons.call_now}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 max-w-4xl mx-auto w-full pt-2">
                        <button onClick={() => openChat('sms')} className="bg-blue-800/60 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm backdrop-blur-sm border border-blue-500/30">
                            {dict.buttons.sms}
                        </button>
                        <button onClick={() => openChat('live')} className="bg-blue-800/60 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm backdrop-blur-sm border border-blue-500/30">
                            {dict.buttons.live_chat}
                        </button>
                        <button onClick={() => openChat('schedule')} className="bg-blue-800/60 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-sm backdrop-blur-sm border border-blue-500/30">
                            {dict.buttons.schedule}
                        </button>
                    </div>
                    <p className="text-xs text-blue-300 mt-4">{dict.hero.help_text}</p>
                </div>
            </header>

            <div id="calculator">
                <ValuationCalculator />
            </div>

            {/* Recognized for Excellence - Trust Badges */}
            <section className="bg-white py-12 border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-blue-900 mb-8 uppercase tracking-wide">Recognized for Excellence</h3>
                    <div className="flex justify-center items-center opacity-90 hover:opacity-100 transition-opacity duration-300">
                        <img
                            src="/images/trust-badges.png"
                            alt="Legal Excellence Awards: Best Lawyers, Million Dollar Advocates, Super Lawyers"
                            className="max-w-full h-auto max-h-24 md:max-h-32 object-contain"
                        />
                    </div>
                    <p className="mt-4 text-xs text-gray-400 font-medium">Partner Firm Accolades & Recognition</p>
                </div>
            </section>

            {/* Video Knowledge Library */}
            <section className="bg-gray-900 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12 uppercase italic tracking-tighter">
                        <span className="text-red-600">Video Evidence</span> Library
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <VideoPromo
                            title="Hit by a Drunk Driver?"
                            subtitle="They drank. You paid. It's time to fight back."
                            thumbnailUrl="/images/drunk.png"
                        />
                        <VideoPromo
                            title="18-Wheeler Negligence"
                            subtitle="Fighting the billion-dollar trucking insurance giants."
                            thumbnailUrl="/images/truck.png"
                        />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <VideoPromo
                            title="Uninsured Driver?"
                            subtitle="Finding coverage when they have none."
                            thumbnailUrl="/images/uninsured.png"
                        />
                        <VideoPromo
                            title="Distracted / Texting"
                            subtitle="Proving they weren't watching the road."
                            thumbnailUrl="/images/distracted.png"
                        />
                        <VideoPromo
                            title="Rideshare Accidents"
                            subtitle="Uber/Lyft corporate policy limits explained."
                            thumbnailUrl="/images/rideshare.png" // Placeholder if gen failed
                        />
                    </div>
                </div>
            </section >

            <section className="py-12 px-4 bg-white" id="resources">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{dict.sections.resources_title}</h2>
                    <div className="flex flex-col gap-4">
                        {/* 1. Accident Checklist */}
                        <SectionCard title={dict.sections.checklist.title} subtitle={dict.sections.checklist.subtitle} icon={<CarIcon size={24} />} colorClass="bg-red-600">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-red-600 mb-2 uppercase">{dict.sections.checklist.card_title}</h2></div>
                        </SectionCard>

                        {/* 2. Mitigation */}
                        <SectionCard title={dict.sections.mitigate.title} subtitle={dict.sections.mitigate.subtitle} icon={<ShieldCheckIcon size={24} />} colorClass="bg-emerald-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.mitigate.main_title}</h2></div>
                        </SectionCard>

                        {/* 3. Storage */}
                        <SectionCard title={dict.sections.storage.title} subtitle={dict.sections.storage.subtitle} icon={<DollarSignIcon size={24} />} colorClass="bg-orange-600">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.storage.main_title}</h2></div>
                        </SectionCard>

                        {/* 4. Adjuster */}
                        <SectionCard title={dict.sections.adjuster.title} subtitle={dict.sections.adjuster.subtitle} icon={<AlertTriangleIcon size={24} />} colorClass="bg-gray-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.adjuster.main_title}</h2></div>
                        </SectionCard>

                        {/* 5. Total Loss */}
                        <SectionCard title={dict.sections.total_loss.title} subtitle={dict.sections.total_loss.subtitle} icon={<CarIcon size={24} />} colorClass="bg-red-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.total_loss.main_title}</h2></div>
                        </SectionCard>

                        {/* 6. Market Value */}
                        <SectionCard title={dict.sections.market.title} subtitle={dict.sections.market.subtitle} icon={<DollarSignIcon size={24} />} colorClass="bg-green-600">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.market.main_title}</h2></div>
                        </SectionCard>

                        {/* 7. Fault */}
                        <SectionCard title={dict.sections.fault.title} subtitle={dict.sections.fault.subtitle} icon={<AlertTriangleIcon size={24} />} colorClass="bg-purple-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.fault.main_title}</h2></div>
                        </SectionCard>

                        {/* 8. Coverage */}
                        <SectionCard title={dict.sections.coverage.title} subtitle={dict.sections.coverage.subtitle} icon={<FileTextIcon size={24} />} colorClass="bg-blue-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.coverage.main_title}</h2></div>
                        </SectionCard>

                        {/* 9. UM Law */}
                        <SectionCard title={dict.sections.um_law.title} subtitle={dict.sections.um_law.subtitle} icon={<ShieldCheckIcon size={24} />} colorClass="bg-indigo-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.um_law.main_title}</h2></div>
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
                            </div>
                        </SectionCard>
                        {/* 2. Demand Letter Tool (New) */}
                        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all">
                            <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
                                <FileTextIcon size={150} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileTextIcon /> Challenge Low Offers</h3>
                            <p className="text-blue-200 mb-6">Received a lowball offer? Don't argue on the phone. Send a formal legal demand letter.</p>
                            <a href="/tools/demand-letter" className="bg-white text-blue-900 font-bold py-3 px-6 rounded-lg inline-block w-full text-center hover:bg-blue-50 transition">
                                Generate Free Demand PDF &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-gray-400 py-12 px-4 text-center text-sm">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="border border-gray-800 p-4 rounded bg-gray-900/50">
                        <p className="font-bold text-gray-500 uppercase text-xs mb-2">{dict.footer.disclaimer_title}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{dict.footer.disclaimer_text}</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-xs">
                    <p>&copy; {new Date().getFullYear()} Texas Total Loss Claim Help. {dict.footer.rights}</p>
                </div>
            </footer>

            <ChatWidget dict={dict} />
            <MobileNav />
        </main >
    );
}
