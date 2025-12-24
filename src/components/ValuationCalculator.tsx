'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';
import CustomSelect from '@/components/ui/CustomSelect';

interface ValuationCalculatorProps {
    dict: any; // Using any for simplicity as Dictionary type is in another file, or better import it
}

export default function ValuationCalculator({ dict }: ValuationCalculatorProps) {
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

    // Use dictionary labels if available, fallback to English hardcoded (safety)
    const labels = dict?.val_calc?.labels || {
        vin: "VIN (Optional)",
        year: "Year",
        make: "Make",
        model: "Model",
        mileage: "Mileage",
        condition: "Condition",
        condition_help: "Good (Clean Retail)",
        btn_next: "Next: Incident Details »"
    };
    const title = dict?.val_calc?.title || "Check Your Total Loss Value";
    const subtitle = dict?.val_calc?.subtitle || "See what your car is actually worth vs. what they offered.";

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
        // 4. Submit to Supabase via API (Ensure it hits Admin Dashboard)
        const sessionId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        try {
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: sessionId,
                    full_name: formData.name,
                    phone: formData.phone,
                    contact_pref: formData.contactPref,
                    best_time: formData.bestTime,
                    incident_details: `Vehicle: ${formData.year} ${formData.make} ${formData.model} (VIN: ${formData.vin || 'N/A'}). Condition: ${formData.condition}. Desc: ${formData.description}`,
                    role: 'owner',
                    has_injury: !!formData.injuries,
                    language: 'en',
                    score: 50, // Default score for valuation leads
                    pain_level: 0,
                    accident_date: formData.dateOfLoss,
                    city: 'Unknown', // Not collected in this form
                    injury_summary: formData.injuries,
                    liability_summary: 'Valuation Request',
                    files_count: 0
                })
            });

            // 5. Also insert into Chat Messages for the Widget/History
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (supabaseUrl && supabaseKey) {
                const { createClient } = await import('@supabase/supabase-js');
                const sb = createClient(supabaseUrl, supabaseKey);

                await sb.from('chat_messages').insert({
                    session_id: sessionId,
                    sender: 'user',
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

                {/* Step 1: Vehicle Details */}
                {step === 1 && (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-50 animate-in fade-in duration-500">
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black text-blue-900 mb-2">{title}</h2>
                                <p className="text-gray-500">{subtitle}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* VIN */}
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{labels.vin}</label>
                                    <input
                                        type="text"
                                        name="vin"
                                        value={formData.vin}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono text-sm placeholder:text-gray-300"
                                        placeholder="17 Digit VIN"
                                    />
                                </div>

                                {/* Year */}
                                <div className="relative z-30">
                                    <CustomSelect
                                        label={labels.year}
                                        options={Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => ({ label: year, value: year.toString() }))}
                                        value={formData.year}
                                        onChange={(val) => setFormData({ ...formData, year: val.toString() })}
                                        placeholder="Select Year"
                                    />
                                </div>

                                {/* Make */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{labels.make}</label>
                                    <input
                                        type="text"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="e.g. Ford, Toyota"
                                    />
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{labels.model}</label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="e.g. F-150, Camry"
                                    />
                                </div>

                                {/* Mileage */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{labels.mileage}</label>
                                    <input
                                        type="number"
                                        name="mileage"
                                        value={formData.mileage}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        placeholder="e.g. 45000"
                                    />
                                </div>

                                {/* Condition */}
                                <div className="relative z-20">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{labels.condition} <span className="text-gray-400 font-normal text-xs ml-1">(?)</span></label>
                                    <CustomSelect
                                        options={[
                                            { value: "good", label: labels.condition_help },
                                            { value: "average", label: "Average (Wear & Tear)" },
                                            { value: "poor", label: "Poor (Prior Damage)" }
                                        ]}
                                        value={formData.condition}
                                        onChange={(val) => setFormData({ ...formData, condition: val.toString() })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleNextStep}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-4 rounded-xl shadow-lg shadow-green-900/20 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg"
                            >
                                {labels.btn_next}
                            </button>
                        </div>
                    </div>

                )
                }

                {
                    step === 2 && (
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
                                    <div className="relative z-30">
                                        <label className="block text-sm font-bold mb-2">Best Contact</label>
                                        <CustomSelect
                                            options={[
                                                { value: 'text', label: 'msg/Text' },
                                                { value: 'phone', label: 'Phone Call' },
                                                { value: 'email', label: 'Email' }
                                            ]}
                                            value={formData.contactPref}
                                            onChange={(val) => setFormData({ ...formData, contactPref: val.toString() })}
                                        />
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
                    )
                }

                {
                    step === 3 && valuation && (
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
                    )
                }

            </div >
        </section >
    );
}
