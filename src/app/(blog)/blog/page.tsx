import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Texas Auto Law Blog | Latest News & Safety Tips',
    description: 'Daily updates on Texas traffic laws, total loss claims, diminished value, and road safety.',
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogIndex() {
    const { data: posts } = await supabaseClient
        .from('posts')
        .select('title, slug, excerpt, published_at, tags')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            <header className="bg-blue-900 text-white py-16 px-4 text-center">
                <h1 className="text-4xl font-extrabold mb-4">Texas Auto Law Blog</h1>
                <p className="text-blue-200 text-lg max-w-2xl mx-auto">Staying ahead of changes in Texas insurance laws, safety regulations, and total loss rights.</p>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts && posts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                            <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition h-full flex flex-col">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    {/* Placeholder for featured image */}
                                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition"></div>
                                    <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 text-xs font-bold uppercase rounded text-blue-900 shadow-sm">
                                        {post.tags?.[0] || 'News'}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                        <span className="text-blue-600 font-bold group-hover:translate-x-1 transition flex items-center">Read More →</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                    {(!posts || posts.length === 0) && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            <p className="text-xl">No articles published yet.</p>
                            <p className="text-sm">Check back tomorrow for our first daily update!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
