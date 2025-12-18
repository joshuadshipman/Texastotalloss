'use client';

import React from 'react';
import ChatWidget from '@/components/ChatWidget';
import { useChat } from '@/components/ChatContext';

export default function AustinTotalLossPage() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Is My Vehicle a Total Loss After an <span className="text-yellow-400">Austin</span> Accident?
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
                        Help for Travis County drivers dealing with total loss valuations and I-35 crashes.
                    </p>
                    <button
                        onClick={() => openChat()}
                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition transform hover:scale-105"
                    >
                        🤖 Get a Free Instant Valuation
                    </button>
                </div>
            </section>

            {/* Local Context Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Austin Traffic: Stop-and-Go & Rear-Ends</h2>
                        <p className="text-slate-700 mb-4">
                            The infamous congestion on <strong>I-35, MoPac (Loop 1), US-183, and Hwy 290</strong> leads to frequent high-impact rear-end collisions.
                            These crashes often cause hidden frame damage that pushes repair estimates over the threshold, resulting in a total loss.
                        </p>
                        <p className="text-slate-700">
                            Austin's used car market is expensive. Make sure your insurance payout reflects local Austin prices, not statewide averages.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Towing Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🚗 Towed in Austin?</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Austin Police and Travis County Sheriff channel tows to specific VSFs.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Action Plan:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Search "Find My Car Austin" for the official police database.</li>
                                    <li>Storage fees are strictly enforced. Move your car to a shop or your home immediately to stop the billing clock.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Appraiser Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🔍 Austin Appraisers</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Don't accept a lowball offer. Local appraisers understand the Austin market premium.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Search Tips:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Search "Austin total loss appraiser" or "Travis County auto claim expert".</li>
                                    <li>Check reviews for experience with "tech packages" and newer vehicles common in Austin.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TDI & FAQ */}
            <section className="py-16 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Austin Area FAQ</h2>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">Can I keep my car in Austin?</h3>
                            <p className="text-slate-600">
                                Yes (Owner Retention). You will get a Salvage Title. Note that passing inspection in Travis County (emissions + safety) is strict, so ensure the car is truly repairable.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() => openChat()}
                            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition"
                        >
                            <span>💬 Start a Free Claim Review</span>
                        </button>
                    </div>
                </div>
            </section>

            <ChatWidget />
        </main>
    );
}
