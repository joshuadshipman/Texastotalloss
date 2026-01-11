'use client';

import { useState, useEffect } from 'react';
import { triggerContentScout, getDrafts, publishDraft } from '@/app/actions/content_actions';
import {
    NewspaperIcon, ZapIcon, Loader2Icon, CheckCircleIcon,
    FileTextIcon, YoutubeIcon, GlobeIcon
} from 'lucide-react';

export default function ContentEngineManager() {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [scouting, setScouting] = useState(false);

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        setLoading(true);
        try {
            const data = await getDrafts();
            setDrafts(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleScout = async () => {
        setScouting(true);
        try {
            const res = await triggerContentScout();
            if (res.success) {
                alert(res.message);
                loadDrafts();
            } else {
                alert('Error: ' + res.message);
            }
        } catch (e) {
            alert('Scout failed to run.');
        } finally {
            setScouting(false);
        }
    };

    const handlePublish = async (id: string) => {
        if (!confirm('Publish this content to the live library?')) return;
        try {
            const res = await publishDraft(id);
            if (res.success) {
                alert('Published!');
                loadDrafts();
            } else {
                alert('Publish failed: ' + res.message);
            }
        } catch (e) {
            alert('Error publishing.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-900 to-slate-900 p-6 rounded-xl text-white shadow-lg">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-wider flex items-center gap-2">
                        <NewspaperIcon className="text-blue-400" /> Content Growth Engine
                    </h2>
                    <p className="text-blue-200 text-sm mt-1">AI Scout • Trend Analyst • Content Generation</p>
                </div>
                <button
                    onClick={handleScout}
                    disabled={scouting}
                    className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-lg ${scouting
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-400 text-white'
                        }`}
                >
                    {scouting ? (
                        <><Loader2Icon className="animate-spin" /> Scouting Competitors...</>
                    ) : (
                        <><ZapIcon fill="currentColor" /> Trigger Scout</>
                    )}
                </button>
            </div>

            <div className="grid gap-6">
                {drafts.map((draft) => (
                    <div key={draft.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${draft.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {draft.status}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {new Date(draft.created_at).toLocaleString()}
                                </span>
                            </div>
                            {draft.status !== 'published' && (
                                <button
                                    onClick={() => handlePublish(draft.id)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <CheckCircleIcon size={16} /> Approve & Publish
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{draft.concept.title}</h3>
                            <p className="text-gray-600 mb-4 italic">"{draft.concept.hook}"</p>

                            <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                                        <FileTextIcon size={14} /> Blog Strategy
                                    </h4>
                                    <ul className="text-sm space-y-1 list-disc list-inside text-slate-700">
                                        {draft.concept.blog_outline?.map((point: string, i: number) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                                        <YoutubeIcon size={14} /> Video Prompt
                                    </h4>
                                    <p className="text-sm text-slate-700 bg-white p-2 rounded border border-slate-200 font-mono">
                                        {draft.concept.video_prompt}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                                <GlobeIcon size={14} />
                                <span>Targeting: {draft.concept.geo_targets?.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {drafts.length === 0 && !loading && (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        No drafts found. Click "Trigger Scout" to generate new content.
                    </div>
                )}
            </div>
        </div>
    );
}
