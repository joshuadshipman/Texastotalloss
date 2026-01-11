import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expert Auto Insurance Claim Advice | Texas Total Loss Blog',
    description: 'Read the latest guides on handling total loss claims, diminished value, and injury settlements in Texas.',
};

export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;

    return (
        <main className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-navy-900 mb-6 font-serif">
                        Claim <span className="text-gold-500">Intel</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Expert guides to help you fight insurance companies and maximize your payout.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col">
                            {/* Decorative Top Bar */}
                            <div className="h-2 bg-gradient-to-r from-navy-900 to-blue-800"></div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto flex items-center justify-between text-xs text-slate-400 font-medium">
                                    <span>{post.date}</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            {/* Read More Arrow */}
                            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-navy-900 group-hover:text-white transition-colors">
                                <span className="font-bold text-sm uppercase tracking-wide">Read Article</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
