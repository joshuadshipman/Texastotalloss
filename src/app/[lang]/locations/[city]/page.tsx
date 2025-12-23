import type { Metadata } from 'next';
import { cities } from '@/data/cities';
import { notFound } from 'next/navigation';
import { ShieldCheckIcon, AlertTriangleIcon, CarIcon, MapPinIcon } from 'lucide-react';
// Static imports to debug build issues
import ValuationCalculator from '@/components/ValuationCalculator';
import ChatWidget from '@/components/ChatWidget';
import CaseReviewModal from '@/components/CaseReviewModal';
import { getDictionary } from '../../dictionaries';

type Props = {
    params: Promise<{ city: string; lang: 'en' | 'es' }>;
};

// 1. Generate Static Params for Build Time Optimization (SSG)
// export async function generateStaticParams() {
//    return cities.map((city) => ({
//        city: city.slug,
//    }));
// }

// 2. Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { city: citySlug, lang } = await params;
    const cityRaw = cities.find((c) => c.slug === citySlug);
    if (!cityRaw) return {};

    const t = cityRaw.translations[lang] || cityRaw.translations['en'];
    const city = { ...cityRaw, ...t };

    return {
        title: `${city.name} Total Loss & Gap Insurance Help | Free Injury Check`,
        description: `Car totaled in ${city.name}? Get a free ${city.name} vehicle valuation, Gap insurance check, and injury case review. Trusted ${city.county} County assistance.`,
        keywords: [
            `${city.name} car accident lawyer`,
            `total loss calculator ${city.name}`,
            `gap insurance help ${city.name}`,
            `${city.name} diminished value`,
            `upside down car loan ${city.name}`
        ],
    };
}

export default async function CityPage({ params }: Props) {
    const { city: citySlug, lang } = await params;
    const cityRaw = cities.find((c) => c.slug === citySlug);
    const dict = await getDictionary(lang);

    if (!cityRaw) {
        notFound();
    }

    const t = cityRaw.translations[lang] || cityRaw.translations['en'];
    const city = { ...cityRaw, ...t };

    // 3. LocalBusiness + FAQ + HowTo Schema (Graph)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'LegalService',
                '@id': `https://texastotalloss.com/locations/${city.slug}#service`,
                name: `Texas Total Loss - ${city.name} Assistance`,
                description: `Assisting ${city.name} residents with total loss vehicle claims, gap insurance disputes, and injury case reviews.`,
                url: `https://texastotalloss.com/locations/${city.slug}`,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: city.name,
                    addressRegion: 'TX',
                    addressCountry: 'US'
                },
                geo: {
                    '@type': 'GeoCoordinates',
                    latitude: city.coordinates.latitude,
                    longitude: city.coordinates.longitude
                },
                areaServed: {
                    '@type': 'City',
                    name: city.name
                },
                telephone: "+1-800-555-0199",
                priceRange: "Free Consultation"
            },
            {
                '@type': 'FAQPage',
                '@id': `https://texastotalloss.com/locations/${city.slug}#faq`,
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: `Is ${city.name} in a diminished value state?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: `Yes, Texas is a diminished value state. If you live in ${city.name} and were in an accident that wasn't your fault, you may be entitled to the lost value of your vehicle.`
                        }
                    },
                    {
                        '@type': 'Question',
                        name: `How do I dispute a total loss offer in ${city.name}?`,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: "You should invoke the Appraisal Clause in your policy. This allows you to hire an independent appraiser in " + city.county + " County to provide a counter-valuation against the insurance company's offer."
                        }
                    }
                ]
            },
            {
                '@type': 'HowTo',
                '@id': `https://texastotalloss.com/locations/${city.slug}#howto`,
                name: `How to Handle a Total Loss in ${city.name}`,
                step: [
                    {
                        '@type': 'HowToStep',
                        name: 'Get a Valuation',
                        text: `Don't accept the first offer. Research local dealer prices in ${city.name}.`
                    },
                    {
                        '@type': 'HowToStep',
                        name: 'Check for Injuries',
                        text: 'Even minor soreness can indicate serious injury. See a doctor immediately.'
                    },
                    {
                        '@type': 'HowToStep',
                        name: 'Request Policy Appraisal',
                        text: 'Demand an appraisal if the offer is too low.'
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <CaseReviewModal dict={dict} />
            {/* We reuse the main modal, which is global context anyway, but good to ensure it's here */}

            {/* City Hero */}
            <header className="bg-blue-900 text-white py-16 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')]"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-800/80 px-4 py-1 rounded-full text-blue-200 text-sm font-bold mb-4 border border-blue-700">
                        <MapPinIcon size={14} /> Local Assistance for {city.county} County
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        {city.name} Total Loss & <br /><span className="text-red-500">Injury Claim Help</span>
                    </h1>

                    {/* Hotspot Links (SEO) */}
                    {city.hotspots && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest pt-1">Crash Hotspots:</span>
                            {city.hotspots.map(spot => (
                                <a key={spot.slug} href={`/${lang}/locations/${city.slug}/${spot.slug}`} className="text-xs bg-blue-800/50 hover:bg-blue-700 text-white px-2 py-1 rounded border border-blue-500/30 transition">
                                    {spot.name}
                                </a>
                            ))}
                        </div>
                    )}

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mt-6">
                        Don't let {city.name} insurance adjusters underpay you. Get your free valuation and legal review today.
                    </p>
                </div>
            </header>

            {/* Sub-City & Parent Link Navigation */}
            {
                (city.subCities || city.parentCity) && (
                    <div className="max-w-4xl mx-auto px-4 py-4 mb-4">
                        {city.parentCity && (
                            <a href={`/${lang}/locations/${city.parentCity}`} className="text-blue-600 hover:underline flex items-center gap-1 font-bold mb-4">
                                &larr; Back to {city.parentCity.charAt(0).toUpperCase() + city.parentCity.slice(1)} Metro Area
                            </a>
                        )}
                        {city.subCities && city.subCities.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-3">Serving Nearby {city.name} Communities:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {city.subCities.map(sc => (
                                        <a key={sc} href={`/${lang}/locations/${sc}`} className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm font-medium transition cursor-pointer">
                                            {sc.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Local Context Section */}
            <section className="py-12 px-4 bg-white">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Why {city.name} Claims Are Different</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            {city.description}
                        </p>
                        <p className="text-gray-600">
                            Whether you were on the highway or a local road in {city.name} (Zip Codes: {city.zipCodes.slice(0, 3).join(', ')}, etc.), local market values for vehicles differ from the state average. This affects your "Actual Cash Value" (ACV).
                        </p>

                        <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 mt-6">
                            <h3 className="font-bold text-blue-900 text-lg mb-2">Local Tip for {city.name} Residents</h3>
                            <p className="text-blue-800">
                                If your car is at a tow lot in {city.county} County, you are accruing daily storage fees. Mitigation is critical.
                            </p>
                        </div>

                        {/* TRUSTED RESOURCES BLOCK */}
                        {city.resources && (
                            <div className="mt-8 space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Top Rated {city.name} Resources</h3>

                                {/* Towing */}
                                {city.resources.towing && (
                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-red-600 flex items-center gap-2 mb-3"><AlertTriangleIcon size={18} /> Emergency Towing</h4>
                                        <div className="space-y-3">
                                            {city.resources.towing.map((r, i) => (
                                                <div key={i} className="flex justify-between items-start border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <div className="font-bold text-gray-800">{r.name}</div>
                                                        <div className="text-xs text-gray-500">{r.note}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-yellow-500 text-sm font-bold">★ {r.rating}</div>
                                                        <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Repair */}
                                {city.resources.repair && (
                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-blue-600 flex items-center gap-2 mb-3"><CarIcon size={18} /> Trusted Repair Facilities</h4>
                                        <div className="space-y-3">
                                            {city.resources.repair.map((r, i) => (
                                                <div key={i} className="flex justify-between items-start border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <div className="font-bold text-gray-800">{r.name}</div>
                                                        <div className="text-xs text-gray-500">{r.note}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-yellow-500 text-sm font-bold">★ {r.rating}</div>
                                                        <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Quick Stats / Sidebar */}
                    <div className="bg-gray-100 p-6 rounded-xl h-fit">
                        <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">Area Resources</h3>
                        <ul className="space-y-3 text-sm text-gray-700">
                            <li className="flex items-center gap-2"><CarIcon size={16} className="text-blue-600" /> {city.name} Body Shops</li>
                            <li className="flex items-center gap-2"><AlertTriangleIcon size={16} className="text-red-600" /> {city.name} Police Reports</li>
                            <li className="flex items-center gap-2"><ShieldCheckIcon size={16} className="text-green-600" /> {city.county} County Court Info</li>
                        </ul>
                        <button className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                            Compare {city.name} Market Values
                        </button>

                        {/* Rental Link */}
                        {city.resources?.rental && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h4 className="font-bold text-xs text-gray-500 uppercase mb-2">Need a Rental?</h4>
                                {city.resources.rental.map((r, i) => (
                                    <a key={i} href={r.link} target="_blank" className="block bg-white border border-gray-200 p-2 rounded mb-2 hover:bg-blue-50 transition">
                                        <div className="font-bold text-gray-800 text-sm">{r.name}</div>
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>{r.note}</span>
                                            <span className="text-yellow-600">★ {r.rating}</span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Dynamic Content Injection - Reusing Main Components */}
            <section className="py-12 bg-gray-50 border-t border-gray-200">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-6">Check Your {city.name} Vehicle Value</h2>
                    <p className="text-gray-600 mb-8">Use our calculator to see if the insurance offer matches local {city.name} dealer prices.</p>
                    <ValuationCalculator dict={dict} />
                </div>
            </section>

            {/* SEO Keywords Footer Block */}
            <section className="py-8 bg-white border-t border-gray-100 text-xs text-gray-400">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p>Serving {city.name} and surrounding areas including {city.zipCodes.join(', ')}. Keywords: {city.name} car accident lawyer, total loss help {city.name}, gap insurance {city.name}.</p>
                </div>
            </section>

            <ChatWidget dict={dict} />
        </main >
    );
}

