import { blogPosts } from '@/data/blog-posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) return {};

    return {
        title: `${post.title} | Texas Total Loss`,
        description: post.excerpt,
    };
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const { lang, slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white py-20 px-4">
            <article className="max-w-3xl mx-auto">
                <Link href={`/${lang}/blog`} className="inline-flex items-center gap-2 text-slate-500 hover:text-navy-900 transition mb-8 font-bold text-sm">
                    <ChevronLeft size={16} /> Back to Library
                </Link>

                <header className="mb-12">
                    <div className="flex gap-2 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-gold-100 text-gold-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-navy-900 mb-6 font-serif leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-500 border-l-4 border-gold-500 pl-4">
                        <p>By <span className="font-bold text-navy-900">{post.author}</span></p>
                        <span>•</span>
                        <p>{post.date}</p>
                        <span>•</span>
                        <p>{post.readTime}</p>
                    </div>
                </header>

                {/* Content Injection */}
                <div
                    className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-navy-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Call to Action Footer */}
                <div className="mt-16 bg-navy-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                    <h3 className="text-2xl font-bold font-serif mb-4 relative z-10">Maximize Your Settlement Today</h3>
                    <p className="text-blue-200 mb-8 max-w-lg mx-auto relative z-10">
                        Don't let the insurance company undervalue your claim. Get a free AI analysis in seconds.
                    </p>
                    <Link href={`/${lang}/review`} className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform relative z-10">
                        Start Free Case Review
                    </Link>
                </div>
            </article>
        </main>
    );
}
