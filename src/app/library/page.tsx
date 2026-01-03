import { getLibraryContent, getTrendingContent } from '@/lib/content';
import Link from 'next/link';

export const revalidate = 60; // Revalidate every minute

export default async function LibraryPage() {
    const trending = await getTrendingContent();
    const allContent = await getLibraryContent();

    return (
        <main className="min-h-screen bg-neutral-900 text-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-neutral-900 via-slate-900 to-neutral-900 border-b border-white/10">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        Texas Injury <span className="text-gold-500 italic">Knowledge Library</span>
                    </h1>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                        Real answers to the tough questions insurance adjusters don't want you to ask.
                        Updated weekly with trending topics.
                    </p>
                </div>
            </section>

            {/* Trending Section */}
            {trending.length > 0 && (
                <section className="py-16 px-4 bg-neutral-900/50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-2xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                            <span className="text-gold-500">🔥</span> Trending Now
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trending.map((item) => (
                                <Link key={item.id} href={`/library/video/${item.slug}`} className="group relative block bg-neutral-800 rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/10">
                                    <div className="aspect-video bg-neutral-700 relative flex items-center justify-center">
                                        {/* Thumbnail Placeholder or Youtube Thumb */}
                                        <span className="text-4xl">▶️</span>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-2">{item.category}</div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-neutral-400 text-sm line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Content Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-serif font-bold text-white">Latest Videos & Guides</h2>
                        {/* Future: Filter Tabs */}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allContent.map((item) => (
                            <Link key={item.id} href={`/library/video/${item.slug}`} className="flex flex-col bg-neutral-800/50 rounded-lg p-4 border border-white/5 hover:bg-neutral-800 transition">
                                <div className="text-xs font-bold text-neutral-500 uppercase mb-2">{item.category}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
