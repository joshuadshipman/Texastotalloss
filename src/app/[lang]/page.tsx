'use client';

import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';
import { useChat } from '@/components/ChatContext';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { getDictionary } from './dictionaries';
import { Dictionary } from '@/dictionaries/en'; // Type

const ValuationCalculator = dynamic(() => import('@/components/ValuationCalculator'), { ssr: false });
const MobileNav = dynamic(() => import('@/components/MobileNav'), { ssr: false });
const SectionCard = dynamic(() => import('@/components/SectionCard'));
const LightboxImage = dynamic(() => import('@/components/ui/LightboxImage')); // Keep using this if previously defined
import { ShieldCheckIcon, AlertTriangleIcon, FileTextIcon, CarIcon, DollarSignIcon, SearchIcon, SparklesIcon } from 'lucide-react';

export default function Home({ params }: { params: { lang: 'en' | 'es' } }) {
    const { openChat, openReview } = useChat();
    const CaseReviewModal = dynamic(() => import('@/components/CaseReviewModal'), { ssr: false });

    const [dict, setDict] = useState<Dictionary | null>(null);

    useEffect(() => {
        getDictionary(params.lang).then(d => setDict(d));
    }, [params.lang]);

    if (!dict) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 pb-20 md:pb-0">
            <CaseReviewModal />

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
                        <button onClick={() => openChat('callback')} className="flex-1 h-16 bg-white text-blue-900 hover:bg-gray-100 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm md:text-base leading-tight px-2">
                            <span>{dict.buttons.call_now}</span>
                        </button>
                        {/* More buttons... simplified for brevity but can add all */}
                    </div>
                    <p className="text-xs text-blue-300 mt-4">{dict.hero.help_text}</p>
                </div>
            </header>

            <div id="calculator">
                <ValuationCalculator />
            </div>

            <section className="py-12 px-4 bg-white" id="resources">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">{dict.sections.resources_title}</h2>
                    <div className="flex flex-col gap-4">
                        {/* 1. Accident Checklist */}
                        <SectionCard title={dict.sections.checklist.title} subtitle={dict.sections.checklist.subtitle} icon={<CarIcon size={24} />} colorClass="bg-red-600">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-red-600 mb-2 uppercase">{dict.sections.checklist.card_title}</h2></div>
                            {/* ... content ... */}
                            <div className="text-center"><p className="text-gray-500 italic">(Checklist content localized...)</p></div>
                        </SectionCard>

                        {/* 2. Mitigation */}
                        <SectionCard title={dict.sections.mitigate.title} subtitle={dict.sections.mitigate.subtitle} icon={<ShieldCheckIcon size={24} />} colorClass="bg-emerald-700">
                            <div className="text-center mb-8"><h2 className="text-3xl font-black text-gray-800 mb-2">{dict.sections.mitigate.main_title}</h2></div>
                        </SectionCard>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Texas Total Loss Claim Help. {dict.footer.rights}</p>
                </div>
            </footer>

            <ChatWidget />
            <MobileNav />
        </main>
    );
}
