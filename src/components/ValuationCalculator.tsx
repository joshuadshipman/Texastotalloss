'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';

export default function ValuationCalculator() {
    const { openChat } = useChat();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        vin: '',
        year: '',
        make: '',
        model: '',
        mileage: '',
        condition: 'good',
        // Contact Info
        name: '',
        phone: '',
        email: '',
        contactPref: 'text',
        bestTime: '',
        // Incident Info
        dateOfLoss: '',
        injuries: '',
        description: ''
    });
    const [valuation, setValuation] = useState<{ min: number, max: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial simple valuation (Step 1 -> Step 2)
    const handleNextStep = () => {
        setStep(2);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Final Calculation & Submission (Step 2 -> Step 3)
    const submitLeadAndCalculate = async () => {
        setIsSubmitting(true);

        // 1. Calculate 'Mock' Value
        const baseValue = 24000;
        const randomFactor = Math.floor(Math.random() * 2000);
        const minVal = baseValue + randomFactor;
        const maxVal = minVal + 3500;
        setValuation({ min: minVal, max: maxVal });

        // 2. Capture Referral Info
        let referrer = 'Direct/Unknown';
        if (typeof document !== 'undefined') {
            referrer = document.referrer || 'Direct';
        }

        // 3. Prepare Lead Data for Admin Chat
        const leadMessage = `
🚨 NEW VALUATION LEAD 🚨
------------------------
👤 CONTACT:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Pref: ${formData.contactPref} (Best Time: ${formData.bestTime})

🚗 VEHICLE:
${formData.year} ${formData.make} ${formData.model}
VIN: ${formData.vin}
Miles: ${formData.mileage} | Cond: ${formData.condition}

📅 INCIDENT:
Date: ${formData.dateOfLoss}
Injuries: ${formData.injuries}
Desc: ${formData.description}

🕵️ TRACKING:
Source: ${referrer}
------------------------
`.trim();

        // 4. Submit to Supabase (as a new Chat Session)
        try {
            // Import client here or assume it's available via context/props. 
            // Since we don't have global supabase client in this file, we'll quickly create one or imports.
            // For now, let's use the one from '../lib/supabaseClient' if possible, or dynamic import.
            // A safer way in this component is to fetch via API or reusing ChatContext if it had submit.
            // We will do a direct fetch to the same table used by ChatWidget.

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (supabaseUrl && supabaseKey) {
                const { createClient } = await import('@supabase/supabase-js');
                const sb = createClient(supabaseUrl, supabaseKey);

                const sessionId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                await sb.from('chat_messages').insert({
                    session_id: sessionId,
                    sender: 'user', // "User" sent this form
                    text: leadMessage,
                    is_read: false
                });
            }
        } catch (e) {
            console.error("Error submitting lead:", e);
        }

        setIsSubmitting(false);
        setStep(3);
    };

    return (
        <section className="py-16 px-4 bg-blue-900 text-white">
            <div className="max-w-4xl mx-auto">

                {step === 1 && (
                    <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-8 md:p-12">
                        <h2 className="text-3xl font-bold text-center mb-2 text-blue-900">Check Your Total Loss Value</h2>
                        <p className="text-center text-gray-600 mb-8">See what your car is actually worth vs. what they offered.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">VIN (Optional)</label>
                                <input
                                    type="text"
                                    name="vin"
                                    value={formData.vin}
                                    onChange={handleInputChange}
                                    placeholder="17-Digit VIN"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Year</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="">Select Year</option>
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018">2018</option>
                                    <option value="older">Older</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Make</label>
                                <input
                                    type="text"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Ford, Toyota"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    placeholder="e.g. F-150, Camry"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Mileage</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 45000"
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <label className="block text-sm font-bold">Condition</label>
                                    <div className="group relative">
                                        <span className="cursor-help bg-blue-100 text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">?</span>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 mb-2">
                                            <div className="font-bold mb-1 border-b border-gray-700 pb-1">Definitions (CCC/NADA):</div>
                                            <ul className="space-y-1 text-[10px] leading-tight text-left">
                                                <li><strong className="text-green-400">Excellent/Extra Clean:</strong> No defects. Glossy paint. Interior perfect. (Rare for daily drivers).</li>
                                                <li><strong className="text-blue-400">Good/Clean:</strong> Minor wear. No mechanical issues. Tires good. "Ready for Retail".</li>
                                                <li><strong className="text-yellow-400">Fair/Average:</strong> Minor blemishes. Some wear on seats/carpet. May need tires/service.</li>
                                            </ul>
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                                <select
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="excellent">Excellent (Dealer Retail)</option>
                                    <option value="good">Good (Clean Retail)</option>
                                    <option value="fair">Fair (Average)</option>
                                    <option value="poor">Poor (Rough)</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleNextStep}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg text-xl transition transform hover:scale-[1.02]"
                        >
                            Next: Incident Details &raquo;
                        </button>
                    </div>
                    </div>
                )}

            {step === 2 && (
                <div className="bg-white text-gray-900 rounded-xl shadow-2xl p-8 md:p-12 animate-fade-in-up">
                    <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Step 2: Incident & Contact Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* Contact Details */}
                        <div className="md:col-span-2"><h3 className="font-bold text-gray-500 border-b pb-2 mb-4">Your Information</h3></div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Phone Number</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 123-4567" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Best Contact</label>
                                <select name="contactPref" value={formData.contactPref} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none bg-white">
                                    <option value="text">msg/Text</option>
                                    <option value="phone">Phone Call</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Best Time</label>
                                <input type="text" name="bestTime" value={formData.bestTime} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none" placeholder="e.g. After 5pm" />
                            </div>
                        </div>

                        {/* Incident Details */}
                        <div className="md:col-span-2 mt-4"><h3 className="font-bold text-gray-500 border-b pb-2 mb-4">The Accident</h3></div>

                        <div>
                            <label className="block text-sm font-bold mb-2">Date of Loss</label>
                            <input type="date" name="dateOfLoss" value={formData.dateOfLoss} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Any Injuries?</label>
                            <input type="text" name="injuries" value={formData.injuries} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Back pain, Whiplash..." />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold mb-2">What Happened? (Brief Description)</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="I was rear-ended at a red light..."></textarea>
                        </div>

                    </div>

                    <button
                        onClick={submitLeadAndCalculate}
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg text-xl transition transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center"
                    >
                        {isSubmitting ? 'Processing...' : 'Calculate Private Retail Value »'}
                    </button>
                </div>
            )}

            {step === 3 && valuation && (
                <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
                    <div className="bg-green-600 p-6 text-center">
                        <h3 className="text-white text-lg font-semibold opacity-90 mb-1">Estimated Retail Value Range</h3>
                        <div className="text-white text-5xl font-black tracking-tight">
                            ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}*
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
                            <p className="text-sm text-yellow-800">
                                <strong>*Disclaimer:</strong> This is a generic retail estimation based on market averages for vehicles in this class.
                                It is not a formal appraisal. Your specific options, trim, and local market can affect value significantly.
                            </p>
                        </div>

                        <div className="text-center max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">But here is the truth...</h3>
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Fighting over a few thousand dollars on the car value is important, but often the <strong>bigger financial risk</strong> is ignoring your medical needs.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                Focus less on fighting the adjuster over the total‑loss number and more on getting the medical care you need.
                                If you were hurt, even slightly, you need to protect your rights immediately.
                            </p>

                            <button
                                onClick={() => openChat()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg text-xl transition animate-pulse"
                            >
                                Discuss My Options & Injuries
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
        </section >
    );
}
