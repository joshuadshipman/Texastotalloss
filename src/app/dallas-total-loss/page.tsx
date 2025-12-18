'use client';

import React from 'react';
import ChatWidget from '@/components/ChatWidget';
import { useChat } from '@/components/ChatContext';

export default function DallasTotalLossPage() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Is My Vehicle a Total Loss After a <span className="text-yellow-400">Dallas</span> Car Accident?
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
                        Navigating DFW's complex total loss rules, storage fees, and valuation disputes.
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Dallas Crash Patterns & Total Loss Risks</h2>
                        <p className="text-slate-700 mb-4">
                            Driving in Dallas means dealing with high-speed corridors like <strong>I-635 (LBJ), I-35E, US-75, and the George Bush Turnpike</strong>.
                            The high incidents of rear-end collisions and multi-car pileups on these arteries often lead to significant frame damage—a primary trigger for "Total Loss" designations.
                        </p>
                        <p className="text-slate-700">
                            In Texas, your car is a total loss if the repair costs + salvage value exceed the car's actual value (The 100% Rule). DFW adjusters are aggressive; know your rights before accepting an offer.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Towing Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🚗 Where Did My Car Anything? (Dallas)</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                If Dallas Police initiated the tow, your car is likely at the <strong>Dallas Auto Pound</strong> or a licensed Vehicle Storage Facility (VSF) in Dallas County.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Action Plan:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Search "Dallas Auto Pound" or "Vehicle Storage" near the crash site.</li>
                                    <li>Call immediately. Storage fees in Dallas can exceed <strong>$40/day</strong>.</li>
                                    <li>Move your car to a fee-free body shop ASAP.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Appraiser Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🔍 finding a Dallas Appraiser</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Disputing a low offer? You may need an independent appraiser.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Search Tips:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Google: "Dallas total loss appraisal" or "Diminished Value Appraiser DFW".</li>
                                    <li>Verify they are a <strong>Texas Licensed Adjuster</strong>.</li>
                                    <li>Avoid "upfront fee" scams if possible.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TDI & FAQ */}
            <section className="py-16 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Dallas FAQ & Resources</h2>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">How do I file a complaint against an insurer in Dallas?</h3>
                            <p className="text-slate-600">
                                Use the <a href="https://www.tdi.texas.gov/" target="_blank" className="text-blue-600 underline hover:text-blue-800">Texas Department of Insurance (TDI)</a> portal.
                                Dallas residents use the same statewide system. Filing a complaint forces the insurer to respond formally within 15 days.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">Are Dallas storage fees regulated?</h3>
                            <p className="text-slate-600">
                                Yes, state law caps certain VSF fees, but they are still expensive. "Notification fees" kick in after 24 hours. Don't let the car sit.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">Does Dallas traffic affect my valuation?</h3>
                            <p className="text-slate-600">
                                It can. "Comparables" should be local. If the insurer uses comps from rural Texas (cheaper markets) instead of the competitive DFW market, your offer might be artificially low. Challenge this.
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
