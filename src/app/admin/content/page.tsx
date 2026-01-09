'use client';

import React, { useState } from 'react';
import { scrapeCompetitorHeadlines, ScrapedHeadline } from '@/lib/scraper';
import { analyzeHeadlines, ContentConcept } from '@/lib/gemini';
import { Loader2, RefreshCw, PenTool, Video, MapPin, Copy } from 'lucide-react';

export default function ContentDashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [headlines, setHeadlines] = useState<ScrapedHeadline[]>([]);
    const [concept, setConcept] = useState<ContentConcept | null>(null);
    const [status, setStatus] = useState<string>('Ready');

    const handleGenerate = async () => {
        setIsLoading(true);
        setConcept(null);
        setHeadlines([]);

        try {
            // 1. Scrape
            setStatus('Scouting Competitors...');
            const scraped = await scrapeCompetitorHeadlines(); // NOTE: In prod, this must be a Server Action or API route
            setHeadlines(scraped);

            if (scraped.length === 0) {
                setStatus('No headlines found.');
                setIsLoading(false);
                return;
            }

            // 2. Analyze
            setStatus('Analyzing Trends with Gemini...');
            const result = await analyzeHeadlines(scraped); // NOTE: In prod, server-side to hide key
            setConcept(result);
            setStatus('Done!');

        } catch (error) {
            console.error(error);
            setStatus('Error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Content Growth Engine</h1>
                    <p className="text-slate-500">Automated Competitor Analysis & empathetic Content Generation</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    {isLoading ? status : 'Run Daily Scout'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. The Scout (Left Col) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-blue-500" /> Competitor Intel
                    </h2>
                    {headlines.length > 0 ? (
                        <div className="space-y-4">
                            {headlines.map((h, i) => (
                                <div key={i} className="text-sm p-3 bg-slate-50 rounded border border-slate-100">
                                    <p className="font-semibold text-slate-800 line-clamp-2">{h.title}</p>
                                    <span className="text-xs text-slate-400 mt-1 block">{h.source}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm italic py-8 text-center">{isLoading ? 'Scanning blogs...' : 'No data yet. Run the scout.'}</p>
                    )}
                </div>

                {/* 2. The Analyst (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    {concept ? (
                        <>
                            {/* Blog Concept */}
                            <div className="bg-white p-8 rounded-xl shadow-lg border border-indigo-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16"></div>

                                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
                                    TRENDING THEME: {concept.theme.toUpperCase()}
                                </span>

                                <h2 className="text-2xl font-black text-slate-900 mb-2">{concept.title}</h2>
                                <p className="text-slate-600 italic mb-6">"{concept.hook}"</p>

                                <div className="mb-6">
                                    <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><PenTool size={16} /> Structure</h3>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                        {concept.blog_outline.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>

                                <div className="flex gap-2">
                                    {concept.geo_targets.map((city, i) => (
                                        <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded border">
                                            +{city}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Video Prompt (Option B) */}
                            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 rounded-xl shadow-xl text-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                                            <Video className="text-pink-400" /> AI Video Prompt
                                        </h2>
                                        <p className="text-indigo-200 text-sm">Paste this into Google Vids or HeyGen</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(concept.video_prompt)}
                                        className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition"
                                    >
                                        <Copy size={20} />
                                    </button>
                                </div>

                                <div className="bg-black/30 p-4 rounded-lg font-mono text-sm leading-relaxed text-purple-100">
                                    {concept.video_prompt}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center h-full flex flex-col items-center justify-center text-slate-400">
                            {isLoading ? (
                                <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                            ) : (
                                <div className="bg-white p-4 rounded-full mb-4 shadow-sm">💡</div>
                            )}
                            <p>{isLoading ? 'Gemini is crafting a strategy...' : 'Ready to generate daily content'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
