import { intersections } from '@/data/intersections';
import { getDictionary } from '../../dictionaries';
import { Metadata } from 'next';
import Link from 'next/link';
import { MapPinIcon, PhoneIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import SectionCard from '@/components/SectionCard';
import ChatWidget from '@/components/ChatWidget';

type Props = {
    params: Promise<{
        lang: 'en' | 'es';
        slug: string;
    }>;
};

// 1. Generate Static Params for all intersections
export async function generateStaticParams() {
    const paths = [];
    for (const locale of ['en', 'es']) {
        for (const site of intersections) {
            paths.push({ lang: locale, slug: site.slug });
        }
    }
    return paths;
}

// 2. Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;

    const site = intersections.find(i => i.slug === slug);
    if (!site) return { title: 'Location Not Found' };

    const title = lang === 'es'
        ? `Abogado de Accidentes en ${site.title} | Ayuda Legal`
        : `Accident at ${site.title}? Total Loss & Injury Help`;

    const desc = lang === 'es'
        ? `¿Chocó en ${site.title}? Nuestros abogados en ${site.city} luchan por su compensación. Consulta gratis hoy.`
        : `Injured in a crash at ${site.title} in ${site.city}? We specialize in high-conflict intersections. Get your maximum settlement.`;

    return {
        title,
        description: desc,
        openGraph: {
            title,
            description: desc,
        }
    };
}

export default async function LocationPage({ params }: Props) {
    const { lang, slug } = await params;

    const dict = await getDictionary(lang);
    const site = intersections.find(i => i.slug === slug);

    if (!site) return <div className="p-20 text-center">Location not found. <Link href="/" className="text-blue-500">Go Home</Link></div>;

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <header className="bg-blue-900 text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/worried_customer.png')] bg-cover bg-center"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6 animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-red-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                        <AlertTriangleIcon size={16} />
                        {lang === 'es' ? 'ALERTA DE ACCIDENTE' : 'ACCIDENT ALERT'}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black leading-tight">
                        {lang === 'es' ? 'Accidente en' : 'Accident at'} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                            {site.title}
                        </span>
                    </h1>

                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {site.description}
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
                        <button className="bg-white text-blue-900 font-black py-4 px-8 rounded-full shadow-lg hover:scale-105 transition text-lg flex items-center justify-center gap-2">
                            <PhoneIcon size={24} className="text-red-600" />
                            {dict.buttons.call_now}
                        </button>
                        <Link href={`/${lang}`} className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white/10 transition flex items-center justify-center">
                            {lang === 'es' ? 'Revisión de Caso Gratis' : 'Free Case Review'}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Map / Context Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            {lang === 'es' ? `Por qué ${site.title} es peligroso` : `Why ${site.title} is Dangerous`}
                        </h2>
                        <div className="space-y-4 text-gray-600 text-lg">
                            <p>
                                {lang === 'es'
                                    ? `Esta intersección en ${site.city} es conocida por el tráfico intenso y conductores distraídos. Hemos visto múltiples colisiones aquí.`
                                    : `This intersection in ${site.city} is a known hotspot for severe collisions. Heavy congestion, confusing lane markings, and distracted drivers make it a high-risk zone.`
                                }
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-3">
                                    <CheckCircleIcon className="text-green-500" />
                                    {lang === 'es' ? 'Cruces peligrosos' : 'Complex High-Speed Merges'}
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircleIcon className="text-green-500" />
                                    {lang === 'es' ? 'Tráfico de camiones' : 'Heavy Commercial Truck Traffic'}
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircleIcon className="text-green-500" />
                                    {lang === 'es' ? 'Visibilidad reducida' : 'Reduced Visibility Zones'}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 h-80 flex items-center justify-center bg-gray-200">
                        {/* Placeholder for dynamic map or static image */}
                        <div className="text-center text-gray-400">
                            <MapPinIcon size={48} className="mx-auto mb-2" />
                            <p className="font-bold">Map Data Visualization</p>
                            <p className="text-xs">{site.title}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common CTA Footer */}
            <section className="bg-gray-900 text-white py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    {lang === 'es' ? 'No enfrente a la aseguradora solo' : 'Don\'t Face the Insurance Company Alone'}
                </h2>
                <p className="mb-8 text-gray-400 max-w-2xl mx-auto">
                    {lang === 'es'
                        ? 'Nuestros expertos locales conocen esta área y saben cómo ganar su caso.'
                        : 'Our local experts know this intersection and know how to prove liability to get you paid.'}
                </p>
                <Link href={`/${lang}`} className="text-blue-400 underline hover:text-white transition">
                    {lang === 'es' ? 'Volver al Inicio' : 'Return to Home Page'}
                </Link>
            </section>

            <ChatWidget dict={dict} />
        </main>
    );
}
