import React from 'react';
import Link from 'next/link';
import { cities } from '@/data/cities';
import { MapPinIcon, ArrowRightIcon } from 'lucide-react';

interface LocationsIndexProps {
    params: Promise<{ lang: string }>;
}

export default async function LocationsIndex({ params }: LocationsIndexProps) {
    const { lang } = await params;

    const dict = lang === 'es' ? {
        title: "Guías de Ciudades de Texas",
        subtitle: "Encuentre recursos locales, médicos y legales en su área.",
        view_guide: "Ver Guía Local"
    } : {
        title: "Texas City Guides",
        subtitle: "Find local resources, medical providers, and legal help in your area.",
        view_guide: "View Local Guide"
    };

    return (
        <div className="min-h-screen bg-slate-950 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 relative">
                    <div className="absolute top-0 left-0">
                        <Link href={`/${lang}`} className="inline-flex items-center gap-1 text-slate-400 hover:text-gold-500 transition text-sm font-bold uppercase tracking-wider">
                            &larr; Return Home
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">{dict.title}</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                        {dict.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cities.map((city) => {
                        const cityInfo = city.translations[lang as 'en' | 'es'] || city.translations.en;
                        return (
                            <Link href={`/${lang}/locations/${city.slug}`} key={city.slug} className="group">
                                <div className="bg-slate-900 rounded-2xl shadow-lg border border-white/10 p-8 transition-all hover:bg-slate-800 hover:border-gold-500/50 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-slate-950 text-gold-500 rounded-lg border border-white/5 group-hover:bg-gold-500 group-hover:text-slate-900 transition-colors">
                                            <MapPinIcon size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">{cityInfo.name}</h2>
                                    </div>
                                    <p className="text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">
                                        {cityInfo.description}
                                    </p>
                                    <div className="flex items-center text-gold-500 font-bold group-hover:gap-2 transition-all text-sm uppercase tracking-wide mt-auto">
                                        {dict.view_guide} <ArrowRightIcon size={18} className="ml-2" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
