import type { Metadata } from 'next';
import { cities } from '@/data/cities';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheckIcon, AlertTriangleIcon, CarIcon, MapPinIcon } from 'lucide-react';
import NeighborhoodAccordion from '@/components/NeighborhoodAccordion';
import TrustBadges from '@/components/TrustBadges';
import ResourceLinkHelper from '@/components/ResourceLinkHelper';
// Static imports to debug build issues
import ValuationCalculator from '@/components/ValuationCalculator';
import ChatWidget from '@/components/ChatWidget';
import CaseReviewModal from '@/components/CaseReviewModal';
import { getDictionary } from '@/dictionaries';

type Props = {
    params: Promise<{ city: string; lang: 'en' | 'es' }>;
};

// 1. Generate Static Params for Build Time Optimization (SSG)
// 1. Generate Static Params for Build Time Optimization (SSG)
export async function generateStaticParams() {
    const params = [];
    for (const city of cities) {
        params.push({ lang: 'en', city: city.slug });
        params.push({ lang: 'es', city: city.slug });
    }
    return params;
}

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
                name: `Texas Total Loss & Auto Accident Attorneys - ${city.name}`,
                description: `Full-service auto accident attorneys in ${city.name} handling injury claims, total loss disputes, and complex liability cases.`,
                url: `https://texastotalloss.com/locations/${city.slug}`,
                logo: "https://texastotalloss.com/images/logo.png",
                image: "https://texastotalloss.com/images/og-image.jpg",
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
                hasMap: `https://www.google.com/maps/search/?api=1&query=${city.coordinates.latitude},${city.coordinates.longitude}`,
                areaServed: {
                    '@type': 'City',
                    name: city.name
                },
                telephone: "+1-800-555-0199",
                email: "admin@texastotalloss.com",
                priceRange: "Free Consultation",
                openingHoursSpecification: [
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        opens: '00:00',
                        closes: '23:59'
                    }
                ],
                sameAs: [
                    "https://www.facebook.com/texastotalloss",
                    "https://twitter.com/txtotalloss",
                    "https://www.linkedin.com/company/texas-total-loss"
                ],
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: "4.9",
                    reviewCount: "124",
                    bestRating: "5",
                    worstRating: "1"
                },
                // UPGRADE: Service Catalog (What we actually do)
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Auto Accident & Total Loss Services',
                    itemListElement: [
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Car Accident Injury Representation',
                                description: 'Full legal representation for medical bills, pain & suffering, and lost wages.'
                            }
                        },
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Total Loss Vehicle Valuation',
                                description: 'Independent appraisal and ACV dispute assistance.'
                            }
                        },
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Accident Review',
                                description: 'Free review of accident details and insurance coverage.'
                            }
                        }
                    ]
                }
            },
            {
                '@type': 'FAQPage',
                // UPGRADE: Speakable Optimization for Voice Search
                speakable: {
                    '@type': 'SpeakableSpecification',
                    cssSelector: ['h2', 'p'] // Targeted reading zones
                },
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
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `https://texastotalloss.com/locations/${city.slug}#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://texastotalloss.com'
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: city.metroArea || 'Locations',
                        // If metroArea is a valid city slug (lowercase), link to it, otherwise map to locations root
                        item: city.metroArea && cities.find(c => c.slug === city.metroArea?.toLowerCase().replace(' ', '-'))
                            ? `https://texastotalloss.com/locations/${city.metroArea.toLowerCase().replace(' ', '-')}`
                            : 'https://texastotalloss.com/locations'
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: city.name,
                        item: `https://texastotalloss.com/locations/${city.slug}`
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-slate-950 flex flex-col font-sans text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <CaseReviewModal dict={dict} />
            {/* We reuse the main modal, which is global context anyway, but good to ensure it's here */}

            {/* City Hero */}
            <header className="bg-slate-900 text-white py-16 px-4 text-center relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')]"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Navigation */}
                    <div className="flex justify-between items-center mb-6">
                        <Link href={`/${lang}`} className="inline-flex items-center gap-1 text-slate-400 hover:text-gold-500 transition text-sm font-bold uppercase tracking-wider">
                            &larr; Return Home
                        </Link>
                        <div className="inline-flex items-center gap-2 bg-slate-800/80 px-4 py-1 rounded-full text-gold-500 text-sm font-bold border border-white/10">
                            <MapPinIcon size={14} /> Local Assistance for {city.county} County
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
                        {city.name} Total Loss & <br /><span className="text-gold-500">Injury Claim Help</span>
                    </h1>

                    {/* Hotspot Links (SEO) */}
                    {city.hotspots && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
                            <span className="text-xs font-bold text-gold-500 uppercase tracking-widest pt-1">Crash Hotspots:</span>
                            {city.hotspots.map(spot => (
                                <a key={spot.slug} href={`/${lang}/locations/${city.slug}/${spot.slug}`} className="text-xs bg-slate-800 hover:bg-gold-500 hover:text-navy-900 text-slate-300 px-2 py-1 rounded border border-white/10 transition">
                                    {spot.name}
                                </a>
                            ))}
                        </div>
                    )}

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mt-6">
                        Don't let {city.name} insurance adjusters underpay you. Get your free valuation and legal review today.
                    </p>
                </div>
            </header>

            {/* Sub-City & Parent Link Navigation */}
            {
                (city.subCities || city.parentCity) && (
                    <div className="max-w-4xl mx-auto px-4 py-4 mb-4">
                        {city.parentCity && (
                            <a href={`/${lang}/locations/${city.parentCity}`} className="text-gold-500 hover:text-gold-400 font-bold mb-4 flex items-center gap-1">
                                &larr; Back to {city.parentCity.charAt(0).toUpperCase() + city.parentCity.slice(1)} Metro Area
                            </a>
                        )}
                        {city.subCities && city.subCities.length > 0 && (
                            <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-white/10">
                                <h3 className="font-bold text-white mb-3">Serving Nearby {city.name} Communities:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {city.subCities.map(sc => (
                                        <a key={sc} href={`/${lang}/locations/${sc}`} className="bg-slate-800 hover:bg-gold-500 text-slate-300 hover:text-navy-900 px-3 py-1 rounded-full text-sm font-medium transition cursor-pointer border border-white/5">
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
            <section className="py-12 px-4 bg-slate-950">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold text-white">Why {city.name} Claims Are Different</h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            {city.description}
                        </p>
                        <p className="text-slate-400">
                            Whether you were on the highway or a local road in {city.name} (Zip Codes: {city.zipCodes.slice(0, 3).join(', ')}, etc.), local market values for vehicles differ from the state average. This affects your "Actual Cash Value" (ACV).
                        </p>



                        <div className="bg-slate-900 p-6 rounded-xl border-l-4 border-gold-500 mt-6 border border-white/5">
                            <h3 className="font-bold text-white text-lg mb-2">Local Tip for {city.name} Residents</h3>
                            <p className="text-slate-300">
                                If your car is at a tow lot in {city.county} County, you are accruing daily storage fees. Mitigation is critical.
                            </p>
                        </div>

                        {/* NEIGHBORHOODS ACCORDION (SEO) */}
                        {city.neighborhoods && city.neighborhoods.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Serving All {city.name} Neighborhoods</h2>
                                <NeighborhoodAccordion
                                    title={`Total Loss Disputes in ${city.name}`}
                                    neighborhoods={city.neighborhoods.map(n => ({
                                        name: n,
                                        desc: `We help residents of ${n} dispute lowball insurance offers and recover the true value of their vehicles.`
                                    }))}
                                />
                            </div>
                        )}

                        {/* RECENT SETTLEMENTS (Social Proof) */}
                        {city.settlements && city.settlements.length > 0 && (
                            <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-gold-500 mb-4 flex items-center gap-2">
                                    <ShieldCheckIcon size={20} /> Recent {city.name} Success Stories
                                </h3>
                                <div className="space-y-3">
                                    {city.settlements.map((s, i) => (
                                        <div key={i} className="flex gap-3 items-start p-3 bg-slate-950/50 rounded border border-white/5 hover:border-gold-500/30 transition">
                                            <span className="text-green-500 font-bold text-sm">✓ PAID</span>
                                            <span className="text-slate-300 font-medium text-sm">{s}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-3 italic">*Past results do not guarantee future outcomes.</p>
                            </div>
                        )}

                        {/* TRUSTED RESOURCES BLOCK */}
                        {city.resources && (
                            <div className="mt-8 space-y-6">
                                <h3 className="text-2xl font-bold text-white border-b border-white/10 pb-2">Top Rated {city.name} Resources</h3>

                                {/* Towing */}
                                {city.resources.towing && city.resources.towing.length > 0 ? (
                                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-gold-500 flex items-center gap-2 mb-3"><AlertTriangleIcon size={18} /> Emergency Towing</h4>
                                        <div className="space-y-3">
                                            {city.resources.towing.map((r, i) => (
                                                <div key={i} className="flex justify-between items-start border-b border-white/5 last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <div className="font-bold text-slate-200">{r.name}</div>
                                                        <div className="text-xs text-slate-500">{r.note}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        {r.rating && <div className="text-gold-400 text-sm font-bold">★ {r.rating}</div>}
                                                        <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">View</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-gold-500 flex items-center gap-2 mb-3"><AlertTriangleIcon size={18} /> Emergency Towing</h4>
                                        <ResourceLinkHelper resourceType="towing" city={city.name} className="w-full justify-center" />
                                    </div>
                                )}

                                {/* Hospitals */}
                                {city.resources.hospitals && city.resources.hospitals.length > 0 ? (
                                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-red-500 flex items-center gap-2 mb-3"><ShieldCheckIcon size={18} /> Hospitals & ERs</h4>
                                        <div className="space-y-3">
                                            {city.resources.hospitals.map((r, i) => (
                                                <div key={i} className="flex justify-between items-start border-b border-white/5 last:border-0 pb-2 last:pb-0">
                                                    <div>
                                                        <div className="font-bold text-slate-200">{r.name}</div>
                                                        <div className="text-xs text-slate-500">{r.note}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">View</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-red-500 flex items-center gap-2 mb-3"><ShieldCheckIcon size={18} /> Hospitals & ERs</h4>
                                        <ResourceLinkHelper resourceType="hospital" city={city.name} className="w-full justify-center" />
                                    </div>
                                )}

                                {/* Collision Centers (New) */}
                                {(city.resources.collisionCenters || city.resources.repair) && (
                                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-gold-500 flex items-center gap-2 mb-3"><CarIcon size={18} /> Trusted Body Shops</h4>
                                        <div className="space-y-3">
                                            {/* Combine legacy repair and new collisionCenters */}
                                            {[...(city.resources.collisionCenters || []), ...(city.resources.repair || [])].length > 0 ? (
                                                [...(city.resources.collisionCenters || []), ...(city.resources.repair || [])].map((r, i) => (
                                                    <div key={i} className="flex justify-between items-start border-b border-white/5 last:border-0 pb-2 last:pb-0">
                                                        <div>
                                                            <div className="font-bold text-slate-200">{r.name}</div>
                                                            <div className="text-xs text-slate-500">{r.note}</div>
                                                        </div>
                                                        <div className="text-right">
                                                            {r.rating && <div className="text-gold-400 text-sm font-bold">★ {r.rating}</div>}
                                                            <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">View</a>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <ResourceLinkHelper resourceType="auto repair" city={city.name} className="w-full justify-center" />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Government Resources */}
                                {(city.resources.insuranceDept || city.resources.registrationOffice) && (
                                    <div className="bg-slate-900 border border-white/10 rounded-lg p-4 shadow-sm">
                                        <h4 className="font-bold text-blue-400 flex items-center gap-2 mb-3"><MapPinIcon size={18} /> Official Resources</h4>
                                        <div className="space-y-3">
                                            {city.resources.insuranceDept && (
                                                <div className="border-b border-white/5 pb-2">
                                                    <div className="font-bold text-slate-200 text-sm mb-1">Texas Dept. of Insurance</div>
                                                    <div className="text-xs text-slate-400">{city.resources.insuranceDept.note}</div>
                                                    <a href={city.resources.insuranceDept.link} target="_blank" className="text-xs text-green-400 hover:underline block mt-1">Official Website &rarr;</a>
                                                </div>
                                            )}
                                            {city.resources.registrationOffice && (
                                                <div>
                                                    <div className="font-bold text-slate-200 text-sm mb-1">Vehicle Title & Registration</div>
                                                    <div className="text-xs text-slate-400">{city.resources.registrationOffice.note}</div>
                                                    <a href={city.resources.registrationOffice.link} target="_blank" className="text-xs text-green-400 hover:underline block mt-1">Official Website &rarr;</a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>


                    {/* Quick Stats / Sidebar */}
                    <div className="space-y-6">
                        {/* TRUST BADGES (New) */}
                        <TrustBadges />

                        <div className="bg-slate-900 p-6 rounded-xl h-fit border border-white/10">
                            <h3 className="font-bold text-white mb-4 border-b border-white/10 pb-2">Area Resources</h3>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><CarIcon size={16} className="text-gold-500" /> {city.name} Body Shops</li>
                                <li className="flex items-center gap-2"><AlertTriangleIcon size={16} className="text-gold-500" /> {city.name} Police Reports</li>
                                <li className="flex items-center gap-2"><ShieldCheckIcon size={16} className="text-gold-500" /> {city.county} County Court Info</li>
                            </ul>
                            <button className="mt-6 w-full bg-gold-500 text-navy-900 font-bold py-3 rounded-lg hover:bg-gold-600 transition">
                                Compare {city.name} Market Values
                            </button>

                            {/* Rental Link */}
                            {city.resources?.rental && (
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Need a Rental?</h4>
                                    {city.resources.rental.map((r, i) => (
                                        <a key={i} href={r.link} target="_blank" className="block bg-slate-800 border border-white/5 p-2 rounded mb-2 hover:bg-slate-700 transition">
                                            <div className="font-bold text-slate-200 text-sm">{r.name}</div>
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>{r.note}</span>
                                                <span className="text-gold-400">★ {r.rating}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Dynamic Content Injection - Reusing Main Components */}
            <section className="py-12 bg-slate-950 border-t border-white/5">
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-white">Check Your {city.name} Vehicle Value</h2>
                    <p className="text-slate-400 mb-8">Use our calculator to see if the insurance offer matches local {city.name} dealer prices.</p>
                    <ValuationCalculator dict={dict} />
                </div>
            </section>

            {/* SEO Keywords Footer Block */}
            <section className="py-8 bg-slate-900 border-t border-white/5 text-xs text-slate-500">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p>Serving {city.name} and surrounding areas including {city.zipCodes.join(', ')}. Keywords: {city.name} car accident lawyer, total loss help {city.name}, gap insurance {city.name}.</p>
                </div>
            </section>

            <ChatWidget dict={dict} />
        </main >
    );
}

