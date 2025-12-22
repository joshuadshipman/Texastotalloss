'use client';

import React, { useState } from 'react';
import { PlayCircleIcon, XIcon, FileTextIcon } from 'lucide-react';

type VideoItem = {
    id: string;
    title: string;
    description: string;
    thumb: string;
    script: string;
    category: string;
};

const VIDEOS: VideoItem[] = [
    {
        id: 'drunk-driver',
        title: 'Hit by a Drunk Driver?',
        description: 'DWI crashes have special punitive damages in Texas. Learn what that means for your payout.',
        thumb: '/images/drunk.png',
        category: 'DWI Accident',
        script: `[Video Starts]
Scene: Lawyer standing in front of a blurred police cruiser lights background.

Lawyer: "If you were hit by a drunk driver in Texas, you're not just a victim of an accident — you're a victim of a crime."

[Cut to graphics showing 'Compensatory' vs 'Punitive' money bags]

Lawyer: "Most people know about compensatory damages—money for bills and pain. But Texas law allows for PUNITIVE damages against drunk drivers. This is extra money designed to punish them."

[Cut back to Lawyer]

Lawyer: "Insurance companies hate this. They want to settle fast before you file a lawsuit. Don't let them. If the other driver was intoxicated, your case value just went up. Call us to find out by how much."
[End Card: Free Case Review]`
    },
    {
        id: 'trucking',
        title: '18-Wheeler Wreck Reality',
        description: 'Trucking companies have rapid response teams. You need one too.',
        thumb: '/images/truck.png',
        category: 'Trucking',
        script: `[Video Starts]
Scene: Drone shot of a highway pileup simulation (or stock footage).

Lawyer: "The moment an 18-wheeler hits you, the trucking company's 'Rapid Response Team' is dispatched to the scene."

[Cut to photo of investigators measuring skid marks]

Lawyer: "Their job? To destroy evidence and blame YOU. They measure skid marks, take the black box, and coach the driver."

[Cut back to Lawyer, serious tone]

Lawyer: "You need your own rapid response. We send accident reconstructionists to the scene immediately to preserve that black box data. Without it, it's your word against theirs. Don't wait."
[End Card: 24/7 Truck Accident Response]`
    },
    {
        id: 'uninsured',
        title: 'Hit by Uninsured Driver?',
        description: '30% of Texas drivers have no insurance. Here is how you recover money anyway.',
        thumb: '/images/uninsured.png',
        category: 'Insurance',
        script: `[Video Starts]
Scene: Lawyer looking at a frustrated driver holding a policy paper.

Lawyer: "The other driver has no insurance. Does that mean you're out of luck? Not necessarily."

[Cut to Text on Screen: 'UM/UIM Coverage']

Lawyer: "If you have Uninsured Motorist coverage, your OWN insurance steps in to pay. And here's the secret: In Texas, they cannot raise your rates for filing a UM claim that wasn't your fault."

[Cut back to Lawyer]

Lawyer: "But they will still fight you on the value. They become the enemy. We fight your own insurance company to make sure they honor the policy you paid for."
[End Card: Check Your Policy Review]`
    },
    {
        id: 'distracted',
        title: 'Rideshare & Distracted Driving',
        description: 'Uber/Lyft accidents involve million-dollar insurance policies. Are you eligible?',
        thumb: '/images/distracted.png',
        category: 'Rideshare',
        script: `[Video Starts]
Scene: Stock footage of a driver looking at a phone, then crash sound.

Lawyer: "Rideshare drivers are constantly on their phones—it's part of their job. But when they crash into you, who pays?"

[Cut to Graphics: 'Personal Policy' vs 'Uber/Lyft Commercial Policy']

Lawyer: "If the app was ON, there is likely a $1,000,000 insurance policy active. But Uber and Lyft will deny it if they can."

[Cut back to Lawyer]

Lawyer: "We know how to prove the app was active. If you were a passenger or hit by a rideshare driver, do not sign anything until we see the data logs."
[End Card: Rideshare Injury Hotline]`
    }
];

export default function VideoGallery() {
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

    return (
        <section className="py-12 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Video Knowledge Base</span>
                    <h2 className="text-3xl md:text-4xl font-black mt-2">Texas Accident Video Answers</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                        Real answers to the tough questions insurance adjusters don't want you to ask.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VIDEOS.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => setActiveVideo(video)}
                            className="group relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all transform hover:-translate-y-1"
                        >
                            {/* Thumbnail */}
                            <div className="h-48 overflow-hidden relative">
                                <img src={video.thumb} alt={video.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircleIcon size={48} className="text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="absolute top-2 right-2 bg-black/60 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                                    VIDEO ANSWER
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <span className="text-blue-400 text-xs font-bold uppercase">{video.category}</span>
                                <h3 className="font-bold text-lg leading-tight mt-1 group-hover:text-blue-300 transition-colors">{video.title}</h3>
                                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{video.description}</p>
                            </div>
                        </div>
                    ))}
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
                                <img src={activeVideo.thumb} alt="Video cover" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                <div className="relative text-center p-6">
                                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <PlayCircleIcon size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Watch: {activeVideo.title}</h3>
                                    <p className="text-sm text-gray-300 italic">Video processing...</p>
                                </div>
                            </div>

                            {/* Right/Bottom: Script/Text */}
                            <div className="flex-1 bg-gray-800 p-6 overflow-y-auto">
                                <div className="flex items-center gap-2 mb-4 text-blue-400 border-b border-gray-700 pb-2">
                                    <FileTextIcon size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Video Transcript / Script</span>
                                </div>
                                <div className="prose prose-invert prose-sm">
                                    <div className="whitespace-pre-wrap font-mono text-gray-300 text-xs leading-relaxed">
                                        {activeVideo.script}
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-700">
                                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition text-sm">
                                        Speak to an Attorney About This
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
