import { supabaseClient } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'; // Ensure this package is installed or use a simple renderer
import { Metadata } from 'next';

type Props = {
    params: { slug: string };
};

// 1. Generate Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data: post } = await supabaseClient
        .from('posts')
        .select('title, excerpt, published_at')
        .eq('slug', params.slug)
        .single();

    if (!post) return {};

    return {
        title: `${post.title} | Texas Total Loss Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.published_at,
        }
    };
}

// 2. SSG Params
export async function generateStaticParams() {
    const { data: posts } = await supabaseClient
        .from('posts')
        .select('slug')
        .eq('status', 'published');

    return (posts || []).map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: Props) {
    const { data: post } = await supabaseClient
        .from('posts')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!post) notFound();

    // 3. BlogPosting Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: {
            '@type': 'Organization',
            name: post.author || 'Texas Total Loss Legal Team',
            url: 'https://texastotalloss.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Texas Total Loss',
            logo: {
                '@type': 'ImageObject',
                url: 'https://texastotalloss.com/images/logo.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://texastotalloss.com/blog/${post.slug}`
        }
    };

    return (
        <main className="min-h-screen bg-white font-sans text-gray-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                <Link href="/blog" className="text-blue-600 font-bold text-sm hover:underline mb-8 block">← Back to Blog</Link>

                <header className="mb-8">
                    <div className="flex gap-2 mb-4">
                        {post.tags?.map((tag: string) => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">{tag}</span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>
                    <div className="flex items-center justify-between text-gray-500 text-sm border-b pb-8">
                        <div>By <span className="font-bold text-gray-900">{post.author}</span></div>
                        <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString()}</time>
                    </div>
                </header>

                <div className="prose prose-lg prose-blue max-w-none">
                    {/* Basic Markdown Rendering (or usage of ReactMarkdown if installed) */}
                    {/* For now, assuming plain text structure or simple HTML injection for MVP */}
                    {/* In a real app, use <ReactMarkdown>{post.content}</ReactMarkdown> */}
                    <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
                </div>

                <div className="mt-12 p-8 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <h3 className="text-2xl font-bold mb-2">Need Help with your Claim?</h3>
                    <p className="text-gray-600 mb-6">Our AI can review your case details instantly.</p>
                    <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition">
                        Get Free Case Review
                    </Link>
                </div>
            </article>
        </main>
    );
}
