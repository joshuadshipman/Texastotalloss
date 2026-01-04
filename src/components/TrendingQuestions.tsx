'use client';

import Link from 'next/link';
import { PlayCircleIcon, TrendingUpIcon, ArrowRightIcon } from 'lucide-react';
import { ContentItem } from '@/lib/content';

export default function TrendingQuestions({ items }: { items: ContentItem[] }) {
    if (!items || items.length === 0) return null;

    return (
        <section className="bg-slate-50 py-16 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                <TrendingUpIcon size={12} /> Trending Now
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-900">
                            This Week's <span className="text-gold-600 italic">Top Questions</span>
                        </h2>
                    </div>
                    <Link href="/library" className="group flex items-center gap-2 text-slate-600 font-bold hover:text-gold-600 transition">
                        View Full Library <ArrowRightIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <Link key={item.id} href={`/library/video/${item.slug}`} className="group relative block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                            {/* Video Thumbnail Placeholder (Uses Video Embed if available or generic) */}
                            <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                                {item.video_url ? (
                                    <img
                                        src={`https://img.youtube.com/vi/${getYouTubeId(item.video_url)}/hqdefault.jpg`}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-90"></div>
                                )}

                                <div className="z-10 bg-gold-500/90 text-navy-900 rounded-full p-3 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <PlayCircleIcon size={32} fill="currentColor" className="text-white" />
                                </div>
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
                                    Video
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                    {item.description || "Watch this video to learn more about this topic."}
                                </p>
                                <span className="inline-block text-xs font-bold text-gold-600 uppercase tracking-wider border-b border-transparent group-hover:border-gold-600 transition-all">
                                    Watch Answer &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
