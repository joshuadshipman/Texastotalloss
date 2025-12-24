'use client';

import React from 'react';
import Link from 'next/link';
import { cities } from '@/data/cities';
import { MapPinIcon, ArrowRightIcon } from 'lucide-react';

interface LocationsIndexProps {
    params: { lang: string };
}

export default function LocationsIndex({ params: { lang } }: LocationsIndexProps) {
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
        <div className="min-h-screen bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{dict.title}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {dict.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cities.map((city) => {
                        const cityInfo = city.translations[lang as 'en' | 'es'] || city.translations.en;
                        return (
                            <Link href={`/${lang}/locations/${city.slug}`} key={city.slug} className="group">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <MapPinIcon size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">{cityInfo.name}</h2>
                                    </div>
                                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                                        {cityInfo.description}
                                    </p>
                                    <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
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
