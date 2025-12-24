'use client';

import React from 'react';
import {
    ShieldCheckIcon, ScaleIcon, ClockIcon,
    AlertTriangleIcon, SearchIcon, FileTextIcon,
    CheckCircleIcon, HeartHandshakeIcon
} from 'lucide-react';

export default function InfoSections() {
    return (
        <div className="space-y-16 py-16">

            {/* Why Hire Us */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    <div className="bg-blue-900 text-white p-8 md:w-1/3 flex flex-col justify-center">
                        <h2 className="text-3xl font-black mb-4 uppercase leading-tight">Why You Need a Partner</h2>
                        <p className="text-blue-200 mb-6">Motor vehicle accidents are common, but fair settlements are not. Insurance companies have teams of lawyers. You should too.</p>
                        <hr className="border-blue-700 w-12 mb-6" />
                        <div className="flex items-center gap-3">
                            <ShieldCheckIcon className="text-yellow-400" size={32} />
                            <span className="font-bold text-sm">Dedicated to Texas Claims</span>
                        </div>
                    </div>
                    <div className="p-8 md:w-2/3 grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><SearchIcon size={18} className="text-blue-600" /> Investigation</h3>
                            <p className="text-sm text-gray-600">We collect critical evidence, scene photos, and witness statements to prove fault.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><HeartHandshakeIcon size={18} className="text-blue-600" /> Communication</h3>
                            <p className="text-sm text-gray-600">We handle all calls with the insurance company so you can focus strictly on recovering.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><ScaleIcon size={18} className="text-blue-600" /> Valuation</h3>
                            <p className="text-sm text-gray-600">We accurately calculate your total damages, including hidden costs like diminished value.</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-blue-900 flex items-center gap-2"><FileTextIcon size={18} className="text-blue-600" /> Court Representation</h3>
                            <p className="text-sm text-gray-600">If they refuse a fair offer, we are prepared to fight for maximum compensation in court.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Responsibility & Causes Unified Section */}
            {/* Responsibility & Causes Cards */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Responsibility Card */}
                    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-blue-600 p-8 hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                <ScaleIcon size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Determining Responsibility</h2>
                        </div>

                        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                            Establishing fault is the foundation of your claim. We document every detail to ensure liability is clear.
                        </p>
                        <ul className="space-y-3">
                            {['Drunk / Impaired Drivers', 'Distracted Driving (Texting)', 'Failure to Yield', 'Reckless Speeding', 'Poor Road Design'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                                    <ShieldCheckIcon size={18} className="text-blue-500" />
                                    <span className="font-semibold">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Common Causes Card */}
                    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-red-600 p-8 hover:shadow-2xl transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                                <AlertTriangleIcon size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Common Causes</h2>
                        </div>

                        <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                            Recognizing these patterns helps build a stronger case against the insurance company's denial tactics.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {['Speeding', 'Drunk Driving', 'Red Lights', 'Road Rage', 'Weather', 'Defects'].map((cause, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-red-50/50 p-3 rounded-lg border border-red-100 hover:bg-red-50 transition-colors">
                                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                                    <span className="font-bold">{cause}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Urgency / Prompt Action */}
            <section className="max-w-6xl mx-auto px-4">
                <div className="bg-blue-900 text-white rounded-2xl shadow-xl overflow-hidden p-10 md:p-16 text-center">
                    <ClockIcon size={48} className="text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tight">Why Timing Is Critical</h2>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
                        In Texas, delaying your claim can cost you thousands. Evidence disappears, and statutory deadlines expire.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition-colors">
                            <h3 className="font-bold text-yellow-300 mb-2 text-lg">Preserve Evidence</h3>
                            <p className="text-sm text-blue-100/90 leading-relaxed">CCTV footage relies on short retention policies. Skid marks fade. Witnesses forget.</p>
                        </div>
                        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition-colors">
                            <h3 className="font-bold text-yellow-300 mb-2 text-lg">Statute of Limitations</h3>
                            <p className="text-sm text-blue-100/90 leading-relaxed">Every state has a deadline. Missing the Texas 2-year filing window generally bars recovery forever.</p>
                        </div>
                        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition-colors">
                            <h3 className="font-bold text-yellow-300 mb-2 text-lg">Build Leverage</h3>
                            <p className="text-sm text-blue-100/90 leading-relaxed">Insurance companies pay less to unrepresented claimants. Level the playing field early.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
