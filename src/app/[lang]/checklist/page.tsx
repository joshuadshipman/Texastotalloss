'use client';

import React from 'react';

export default function ChecklistPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200 print:shadow-none print:border-0">

                <div className="text-center border-b-4 border-gray-900 pb-6 mb-8">
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-2">🚨 Post-Accident Action Plan</h1>
                    <p className="text-gray-600 font-bold">Keep this in your glovebox. Follow it strictly to protect your rights.</p>
                </div>

                <div className="space-y-8">

                    {/* Phase 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white bg-gray-900 px-4 py-2 inline-block rounded mb-4 print:text-black print:bg-transparent print:border-b-2 print:border-black print:px-0">Phase 1: At the Scene (Safety & Evidence)</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-lg">Stop & Assess Safety</strong>
                                    <p className="text-gray-600 text-sm">Turn on hazards. Call 911 if anyone is hurt. Move to shoulder if drivable (Texas Law).</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-lg">Call 911</strong>
                                    <p className="text-gray-600 text-sm">Always get a police report, even for minor accidents. It is your official record.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-red-600">Protect Your Rights (What NOT To Say)</strong>
                                    <p className="text-gray-600 text-sm">DO NOT say "I'm sorry" or "I'm fine." Say "I am shaken up" and "I need a doctor."</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-lg">Collect Critical Info</strong>
                                    <p className="text-gray-600 text-sm">Driver Name, Insurance Policy #, License Plate, <strong>Witness Phone Numbers</strong>.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Phase 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white bg-blue-900 px-4 py-2 inline-block rounded mb-4 print:text-black print:bg-transparent print:border-b-2 print:border-black print:px-0">Phase 2: The Aftermath</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-lg">Seek Medical Care (Within 72 Hours)</strong>
                                    <p className="text-gray-600 text-sm">Go to ER or Urgent Care immediately. "Gaps in care" kill claims.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-lg">Notify Your Insurance</strong>
                                    <p className="text-gray-600 text-sm">Report the crash. Stick to basic facts (Time, Location). No recorded statements yet.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <input type="checkbox" className="w-6 h-6 mt-1 border-2 border-gray-400 rounded" />
                                <div>
                                    <strong className="text-lg">Secure Your Vehicle</strong>
                                    <p className="text-gray-600 text-sm">If towed, authorize your insurer to move it to a fee-free shop ASAP to avoid storage fees.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* Contact Table */}
                    <div className="mt-8 border-2 border-gray-300 rounded-lg p-4">
                        <h3 className="font-bold mb-4">Quick Reference</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="border-b border-gray-200 pb-2">
                                <p className="text-gray-500 text-xs">Other Driver Name</p>
                                <div className="h-6 bg-gray-100 rounded"></div>
                            </div>
                            <div className="border-b border-gray-200 pb-2">
                                <p className="text-gray-500 text-xs">Policy Number</p>
                                <div className="h-6 bg-gray-100 rounded"></div>
                            </div>
                            <div className="border-b border-gray-200 pb-2">
                                <p className="text-gray-500 text-xs">Police Report #</p>
                                <div className="h-6 bg-gray-100 rounded"></div>
                            </div>
                            <div className="border-b border-gray-200 pb-2">
                                <p className="text-gray-500 text-xs">Witness Phone</p>
                                <div className="h-6 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12 print:hidden">
                        <button onClick={() => window.print()} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700">
                            🖨️ Print Checklist
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
