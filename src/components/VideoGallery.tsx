'use client';

import React, { useState } from 'react';
import { PlayCircleIcon, XIcon, FileTextIcon } from 'lucide-react';

interface VideoGalleryProps {
    dict: any;
}

type VideoItem = {
    id: string;
    thumb: string;
    dictKey: string; // Key to lookup in dict.video_gallery.videos
};

const VIDEOS_META: VideoItem[] = [
    { id: 'drunk-driver', thumb: '/images/drunk.png', dictKey: 'drunk' },
    { id: 'trucking', thumb: '/images/truck.png', dictKey: 'truck' },
    { id: 'uninsured', thumb: '/images/uninsured.png', dictKey: 'uninsured' },
    { id: 'distracted', thumb: '/images/distracted.png', dictKey: 'distracted' }
];

export default function VideoGallery({ dict }: VideoGalleryProps) {
    const [activeVideo, setActiveVideo] = useState<{ item: VideoItem, data: any } | null>(null);

    // Helper to get video data from dict safely
    const getVideoData = (key: string) => {
        return dict?.video_gallery?.videos?.[key] || { title: 'Loading...', desc: '', cat: '', script: '' };
    };

    const sectionTitle = dict?.video_gallery?.title || "Texas Accident Video Answers";
    const sectionSubtitle = dict?.video_gallery?.subtitle || "Video Knowledge Base";
    const sectionDesc = dict?.video_gallery?.desc || "Real answers to tough questions.";

    return (
        <section id="video-gallery" className="py-12 bg-slate-950 text-white border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <span className="text-gold-500 font-bold tracking-widest text-xs uppercase">{sectionSubtitle}</span>
                    <h2 className="text-3xl md:text-4xl font-black mt-2">{sectionTitle}</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                        {sectionDesc}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VIDEOS_META.map((video) => {
                        const data = getVideoData(video.dictKey);
                        return (
                            <div
                                key={video.id}
                                onClick={() => setActiveVideo({ item: video, data })}
                                className="group relative bg-slate-900 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-gold-500 transition-all transform hover:-translate-y-1 border border-white/5"
                            >
                                {/* Thumbnail */}
                                <div className="h-48 overflow-hidden relative">
                                    <img src={video.thumb} alt={data.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircleIcon size={48} className="text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/60 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                                        VIDEO
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <span className="text-gold-500 text-xs font-bold uppercase">{data.cat}</span>
                                    <h3 className="font-bold text-lg leading-tight mt-1 group-hover:text-white transition-colors">{data.title}</h3>
                                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">{data.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {activeVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800/50 p-1 rounded-full z-10"
                        >
                            <XIcon size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row h-[70vh] md:h-auto md:max-h-[80vh]">
                            {/* Left/Top: Visual Placeholder (Video Player Mockup) */}
                            <div className="bg-black flex-1 flex items-center justify-center relative min-h-[250px]">
                                <img src={activeVideo.item.thumb} alt="Video cover" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                <div className="relative text-center p-6">
                                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <PlayCircleIcon size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{dict?.video_gallery?.modal?.watch || "Watch:"} {activeVideo.data.title}</h3>
                                    <p className="text-sm text-gray-300 italic">{dict?.video_gallery?.modal?.processing || "Video processing..."}</p>
                                </div>
                            </div>

                            {/* Right/Bottom: Script/Text */}
                            <div className="flex-1 bg-gray-800 p-6 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-4 text-blue-400 border-b border-gray-700 pb-2">
                                    <FileTextIcon size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{dict?.video_gallery?.modal?.transcript || "Transcript"}</span>
                                </div>
                                <div className="prose prose-invert prose-sm">
                                    <div className="whitespace-pre-wrap font-mono text-gray-300 text-xs leading-relaxed">
                                        {activeVideo.data.script}
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-700">
                                    <button className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-2 px-4 rounded-lg transition text-sm">
                                        {dict?.video_gallery?.modal?.cta || "Speak to an Attorney"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
