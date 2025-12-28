import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { getDictionary } from '../dictionaries';

// Initialize Supabase Client (Public)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''; // Use Anon Key for public read
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 60; // Revalidate every minute

export default async function BlogIndex({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as 'en' | 'es');

    // Fetch Published Posts
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching posts:", error);
    }

    return (
        <main className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-blue-900 text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Texas Total Loss <span className="text-blue-300">Resources</span>
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Latest guides, legal insights, and viral TikTok breakdowns regarding your total loss claim.
                    </p>
                </div>
            </header>

            {/* Blog Grid */}
            <section className="py-12 px-4 max-w-6xl mx-auto">
                {!posts || posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No articles published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/${lang}/blog/${post.slug}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col h-full"
                            >
                                {/* Fallback Image or Video Thumbnail could go here */}
                                <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                    {/* If we had a thumbnail_url, we'd use it. For now, a pattern. */}
                                    <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern.png')] bg-cover"></div>
                                    <span className="text-4xl">📄</span>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
                                        Article
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                        {/* Simple markdown strip for excerpt */}
                                        {post.content
                                            ? post.content.replace(/[#*`]/g, '').substring(0, 150) + "..."
                                            : "Read the full guide on Texas Total Loss..."}
                                    </p>
                                    <div className="text-blue-600 font-bold text-sm flex items-center gap-1">
                                        Read Article &rarr;
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
