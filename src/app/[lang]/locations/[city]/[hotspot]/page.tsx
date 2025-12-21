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
            }
        }
    }
    return params;
}

export default function HotspotPage({ params }: { params: { lang: string, city: string, hotspot: string } }) {
    const cityRaw = cities.find(c => c.slug === params.city);
    const hotspot = cityRaw?.hotspots?.find(h => h.slug === params.hotspot);

    if (!hotspot || !cityRaw) {
        return <div className="p-12 text-center">Location not found. <Link href="/" className="text-blue-600 underline">Return Home</Link></div>;
    }

    const t = cityRaw.translations[params.lang] || cityRaw.translations['en'];
    const cityData = { ...cityRaw, ...t };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-gray-900 text-white py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/50 text-red-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        <AlertTriangleIcon size={14} /> High Accident Zone
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black mb-4">
                        Accident at <span className="text-red-500">{hotspot.name}</span>?
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        This location in {cityData.name} is known for specific design hazards. Don't let insurance blame *you* for a dangerous road.
                    </p>
                </div>
            </header>

            <section className="py-12 px-4 max-w-4xl mx-auto w-full">
                <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-600 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <MapPinIcon className="text-red-600" /> Why {hotspot.name} is Dangerous
                    </h2>
                    <p className="text-gray-700 mb-4">
                        We represent many drivers injured at {hotspot.name}. Common issues here include poor signage, confusing lane merges, and high-speed exits.
                        Insurance adjusters often ignore these road defects to shift fault onto you.
                    </p>
                    <div className="bg-gray-100 p-4 rounded text-sm font-medium">
                        <strong>Did you know?</strong> If a road defect contributed to your crash at {hotspot.name}, you may have a claim against the city or state, not just the other driver.
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl">
                        <h3 className="text-xl font-bold mb-2">Total Loss at this location?</h3>
                        <p className="text-blue-200 mb-6">Get a fair payout. Generate a demand letter instantly.</p>
                        <Link href="/tools/demand-letter" className="bg-white text-blue-900 font-bold py-3 px-6 rounded-lg block text-center hover:bg-blue-50">
                            Use Demand Generator &rarr;
                        </Link>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Need a Police Report?</h3>
                        <p className="text-gray-600 mb-6">Crashes at {hotspot.name} are handled by {cityData.name} Police Dept.</p>
                        <button className="bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-lg block w-full text-center hover:bg-gray-200">
                            Find Report Info
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
