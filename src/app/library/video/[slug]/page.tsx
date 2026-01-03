import { getContentBySlug } from '@/lib/content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

interface Props {
    params: {
        slug: string;
    }
}

export default async function VideoPage({ params }: Props) {
    const post = await getContentBySlug(params.slug);

    if (!post) {
        notFound();
    }

    // SEO: JSON-LD VideoObject
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": post.title,
        "description": post.description,
        "thumbnailUrl": [
            "https://example.com/thumbnail.jpg" // Todo: Real thumbnail logic
        ],
        "uploadDate": post.published_at || new Date().toISOString(),
        "contentUrl": post.video_url,
        "embedUrl": post.video_url, // Adjust for YouTube Embed logic
    };

    return (
        <main className="min-h-screen bg-neutral-900 text-white pb-20">
            {/* Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Breadcrumbs */}
            <div className="border-b border-white/10 bg-neutral-900 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-neutral-400">
                    <Link href="/library" className="hover:text-gold-500 transition">Library</Link>
                    <span>/</span>
                    <span className="text-white truncate">{post.title}</span>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-500 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        {post.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-xl text-neutral-300 leading-relaxed">
                        {post.description}
                    </p>
                </div>

                {/* Video Player Container */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-12 border border-white/10 relative group">
                    {/* Replace with real Embed Component */}
                    <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        {post.video_url ? (
                            <iframe
                                className="w-full h-full"
                                src={post.video_url}
                                title={post.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <span>Video Placeholder (No URL)</span>
                        )}
                    </div>
                </div>

                {/* Content / Transcript */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-gold-500 prose-a:text-gold-400">
                    <h2>Key Takeaways & Transcript</h2>
                    <div className="bg-neutral-800/30 p-8 rounded-xl border border-white/5">
                        {post.transcript ? (
                            <div className="whitespace-pre-wrap font-sans text-neutral-300">
                                {post.transcript}
                            </div>
                        ) : (
                            <p className="italic text-neutral-500">No transcript available.</p>
                        )}
                    </div>
                </div>

                {/* CTA - Ask Angel */}
                <div className="mt-16 p-8 bg-gradient-to-r from-slate-900 to-neutral-900 border border-gold-500/20 rounded-2xl text-center">
                    <h3 className="text-2xl font-serif font-bold text-white mb-4">
                        Still have questions about this?
                    </h3>
                    <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
                        Angel can answer specific questions about {post.category} claims or connect you with a specialist.
                    </p>
                    <button className="bg-gold-500 text-neutral-900 font-bold px-8 py-4 rounded-full hover:bg-gold-400 transition transform hover:scale-105 shadow-lg shadow-gold-500/20">
                        Chat with Angel About This Claim
                    </button>
                </div>
            </article>
        </main>
    );
}
