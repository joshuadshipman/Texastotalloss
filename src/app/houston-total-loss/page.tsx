'use client';

import React from 'react';
import ChatWidget from '@/components/ChatWidget';
import { useChat } from '@/components/ChatContext';

export default function HoustonTotalLossPage() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Is My Vehicle a Total Loss After a <span className="text-yellow-400">Houston</span> Crash?
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
                        Expert help for Harris County wrecks, storage fees, and insurance disputes.
                    </p>
                    <button
                        onClick={openChat}
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Houston Traffic & Total Loss Trends</h2>
                        <p className="text-slate-700 mb-4">
                            Houston's massive freeways like <strong>I-10, I-45, US-59, Loop 610, and Beltway 8</strong> are notorious for high-speed, heavy-impact crashes.
                            The severity of collisions in Houston often results in immediate "Total Loss" verdicts from insurers.
                        </p>
                        <p className="text-slate-700">
                            Don't let the insurer rush you. In Houston's competitive car market, your vehicle might be worth more than the initial lowball offer.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Towing Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🚗 Located Your Towed Car (Houston)</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Vehicles towed by HPD often end up at police-authorized storage lots or the <strong>Harris County Impound</strong>.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Action Plan:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Call <strong>Find My Towed Car (Houston)</strong> or check the Harris County Sheriff's database.</li>
                                    <li>Daily storage fees accumulate rapidly. Call your insurer to move it immediately.</li>
                                    <li>Confirm if it's at a "Safe Clear" lot.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Appraiser Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🔍 Houston Appraisers</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Need to fight the valuation? Hire a local expert.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Search Tips:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Search "Houston total loss appraisal" or "Houston auto claim appraiser".</li>
                                    <li>Look for reviews mentioning "ACV negotiation" success in Harris County.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TDI & FAQ */}
            <section className="py-16 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Houston FAQ & Resources</h2>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">How do I file a TDI complaint in Houston?</h3>
                            <p className="text-slate-600">
                                Use the <a href="https://www.tdi.texas.gov/" target="_blank" className="text-blue-600 underline hover:text-blue-800">Texas Department of Insurance</a> website.
                                Mention specifically if a Houston-area adjuster is delaying your claim or ignoring local market data.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">Are flooded cars common in Houston valuations?</h3>
                            <p className="text-slate-600">
                                Yes. Insurers may try to use flood-damaged "comps" to lower your car's value. Ensure all comparable vehicles presented are clean-title and flood-free.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={openChat}
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
