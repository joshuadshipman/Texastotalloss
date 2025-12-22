import { blogTopics } from '@/data/blog-topics';
import { getDictionary } from '../../dictionaries';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeftIcon, CheckCircleIcon, AlertTriangleIcon, FileTextIcon } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';

// Logic to generate 50 static pages at build time
export async function generateStaticParams() {
    return blogTopics.map((topic) => ({
        slug: topic.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const topic = blogTopics.find((t) => t.slug === slug);

    if (!topic) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${topic.title} | Texas Accident Claims`,
        description: topic.intention,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang as any); // Type assertion for now to avoid 'any' error if strict
    const topic = blogTopics.find((t) => t.slug === slug);

    if (!topic) {
        return notFound();
    }

    // Generic Content Template based on Category
    // We construct the article dynamically based on the "Formula" provided by the user.
    // Hook -> Case? -> Rules -> Evidence -> Money -> Tools

    return (
        <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 font-sans text-gray-800">
            {/* Nav */}
            <div className="mb-6">
                <Link href={`/${lang}`} className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium">
                    <ArrowLeftIcon size={16} className="mr-1" /> Back to Home
                </Link>
            </div>

            {/* Header */}
            <header className="mb-8 border-b border-gray-200 pb-8">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide mb-3 inline-block">
                    {topic.category} Guide
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                    {topic.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed font-light">
                    {topic.intention}
                </p>
            </header>

            {/* Dynamic Content Body (The User's Formula) */}
            <div className="space-y-10">
                {/* 1. The Hook / "Do I Have a Case?" */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">01</span>
                        Do I Have a Case?
                    </h2>
                    <div className="prose prose-lg text-gray-700">
                        <p>
                            If you are reading this, likely something unexpected happened on the road.
                            <strong>{topic.title}</strong> is a complex issue in Texas, but the core question is always:
                            <em> Did someone else's negligence cause your loss?</em>
                        </p>
                        <p className="mt-4">
                            In Texas, to have a valid claim for a {topic.category.toLowerCase()}, you typically need to prove three things:
                        </p>
                        <ul className="list-disc pl-5 mt-4 space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <li><strong>Duty of Care:</strong> The other driver had a responsibility to drive safely.</li>
                            <li><strong>Breach:</strong> They failed that duty (e.g., speeding, distracted, unsafe lane change).</li>
                            <li><strong>Causation:</strong> Their failure directly caused your injury or property damage.</li>
                        </ul>
                    </div>
                </section>

                {/* 2. Key Texas Rules */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">02</span>
                        Key Texas Laws You Should Know
                    </h2>
                    <div className="prose prose-lg text-gray-700">
                        <p>
                            Texas follows a <strong>"Modified Comparative Negligence"</strong> rule (51% Bar Rule).
                            This means you can still recover damages as long as you are <em>not more than 50% at fault</em>.
                        </p>

                        <div className="my-6 bg-amber-50 border-l-4 border-amber-500 p-4">
                            <h4 className="font-bold text-amber-800 flex items-center gap-2">
                                <AlertTriangleIcon size={18} />
                                Important Warning
                            </h4>
                            <p className="text-sm text-amber-900 mt-1">
                                Insurance adjusters often try to pin 51% of the blame on you to avoid paying <em>anything</em>.
                                Never admit fault at the scene or on recorded lines without speaking to a lawyer.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3. Evidence & Money */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm">03</span>
                        Recovering Your Money
                    </h2>
                    <div className="prose prose-lg text-gray-700">
                        <p>
                            For {topic.category.toLowerCase()} cases, you may be entitled to compensation for:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="font-bold text-green-700 mb-2">Economic Damages</h3>
                                <ul className="text-sm space-y-1">
                                    <li>✅ Medical Bills (Past & Future)</li>
                                    <li>✅ Lost Wages</li>
                                    <li>✅ Property Damage / Total Loss</li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="font-bold text-blue-700 mb-2">Non-Economic Damages</h3>
                                <ul className="text-sm space-y-1">
                                    <li>✅ Pain and Suffering</li>
                                    <li>✅ Mental Anguish</li>
                                    <li>✅ Physical Impairment</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Tools & CTA (Soft Sell) */}
                <section className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 rounded-2xl shadow-xl transform transition hover:scale-[1.01]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                        <CheckCircleIcon className="text-green-400" />
                        Take The Next Step (Free)
                    </h2>
                    <p className="text-blue-100 mb-6 text-lg">
                        Don't guess about your case value. Use our free tools to get answers instantly.
                        We don't need to call you—just get your data and decide what's best.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/${lang}#calculator`} className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg text-center transition shadow-lg border-b-4 border-green-700 active:translate-y-1 active:border-b-0">
                            Calculate Total Loss Value
                        </Link>
                        <Link href={`/${lang}/chat`} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg text-center transition border border-white/30 backdrop-blur-sm">
                            Ask AI Case Review
                        </Link>
                    </div>
                </section>
            </div>

            {/* Chat Widget for this page */}
            <div className="fixed z-50">
                <ChatWidget dict={dict} />
            </div>
        </main>
    );
}
