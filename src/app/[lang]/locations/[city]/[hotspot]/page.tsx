import React from 'react';
import { cities } from '@/data/cities';
import Link from 'next/link';
import { AlertTriangleIcon, MapPinIcon } from 'lucide-react';

export async function generateStaticParams() {
    const params = [];
    for (const city of cities) {
        if (city.hotspots) {
            for (const hotspot of city.hotspots) {
                params.push({ lang: 'en', city: city.slug, hotspot: hotspot.slug });
                params.push({ lang: 'es', city: city.slug, hotspot: hotspot.slug });
            }
        }
    }
    return params;
}

type Props = {
    params: Promise<{ lang: 'en' | 'es', city: string, hotspot: string }>;
};

export default async function HotspotPage({ params }: Props) {
    const { lang, city, hotspot: hotspotSlug } = await params;
    const cityRaw = cities.find(c => c.slug === city);
    const hotspot = cityRaw?.hotspots?.find(h => h.slug === hotspotSlug);

    if (!hotspot || !cityRaw) {
        return <div className="p-12 text-center text-white bg-slate-950 min-h-screen flex flex-col justify-center items-center">
            Location not found.
            <Link href="/" className="text-gold-500 underline mt-4">Return Home</Link>
        </div>;
    }

    const t = cityRaw.translations[lang] || cityRaw.translations['en'];
    const cityData = { ...cityRaw, ...t };

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col font-sans text-white">
            <header className="bg-slate-900 text-white py-12 px-4 border-b border-white/5">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-red-900/40 border border-red-500/50 text-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <AlertTriangleIcon size={14} /> High Accident Zone
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        Accident at <span className="text-red-500">{hotspot.name}</span>?
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl">
                        This location in {cityData.name} is known for specific design hazards. Don't let insurance blame *you* for a dangerous road.
                    </p>
                </div>
            </header>

            <section className="py-12 px-4 max-w-4xl mx-auto w-full">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-lg border-l-4 border-red-600 mb-8 border-y border-r border-white/10">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                        <MapPinIcon className="text-red-600" /> Why {hotspot.name} is Dangerous
                    </h2>
                    <p className="text-slate-300 mb-4">
                        We represent many drivers injured at {hotspot.name}. Common issues here include poor signage, confusing lane merges, and high-speed exits.
                        Insurance adjusters often ignore these road defects to shift fault onto you.
                    </p>
                    <div className="bg-slate-800 p-4 rounded text-sm font-medium border border-white/5 text-slate-300">
                        <strong className="text-gold-500">Did you know?</strong> If a road defect contributed to your crash at {hotspot.name}, you may have a claim against the city or state, not just the other driver.
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-2">Total Loss at this location?</h3>
                        <p className="text-slate-400 mb-6">Get a fair payout. Generate a demand letter instantly.</p>
                        <Link href="/tools/demand-letter" className="bg-gold-500 text-navy-900 font-bold py-3 px-6 rounded-lg block text-center hover:bg-gold-600 transition">
                            Use Demand Generator &rarr;
                        </Link>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-2 text-white">Need a Police Report?</h3>
                        <p className="text-slate-400 mb-6">Crashes at {hotspot.name} are handled by {cityData.name} Police Dept.</p>
                        <button className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg block w-full text-center hover:bg-slate-700 transition border border-white/5">
                            Find Report Info
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
