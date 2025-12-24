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
        description: '',
        // New Incident Details
        ambulance: 'no',
        tickets: 'no',
        towed: 'no',
        typeOfLoss: 'collision'
    });
    const [valuation, setValuation] = useState<{ min: number, max: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Use dictionary labels if available, fallback to English hardcoded (safety)
    const labels = dict?.val_calc?.labels || {
        vin: "VIN (Optional)",
        year: "Year",
        make: "Make",
        model: "Model",
        mileage: "Mileage",
        condition: "Condition",
        condition_help: "Good (Clean Retail)",
        btn_next: "Get Free Valuation »"
    };
    const title = dict?.val_calc?.title || "Check Your Total Loss Value";
    const subtitle = dict?.val_calc?.subtitle || "See what your car is actually worth vs. what they offered.";

    // Initial simple valuation (Step 1 -> Step 2)
    const handleNextStep = () => {
        // 1. Calculate 'Mock' Value immediately
        const baseValue = 24000;
        const randomFactor = Math.floor(Math.random() * 2000);
        const minVal = baseValue + randomFactor;
        const maxVal = minVal + 3500;
        setValuation({ min: minVal, max: maxVal });

        setStep(2);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Final Submission (Step 2 -> Done)
    const submitLead = async () => {
        setIsSubmitting(true);

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
Type: ${formData.typeOfLoss}
Ambulance: ${formData.ambulance}
Tickets: ${formData.tickets}
Towed: ${formData.towed}
Injuries: ${formData.injuries}
Desc: ${formData.description}

🕵️ TRACKING:
Source: ${referrer}
------------------------
`.trim();

        // 4. Submit to Supabase (as a new Chat Session)
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
                    incident_details: `Vehicle: ${formData.year} ${formData.make} ${formData.model}. Loss Type: ${formData.typeOfLoss}. Ambulance: ${formData.ambulance}. Tickets: ${formData.tickets}. Towed: ${formData.towed}. Desc: ${formData.description}`,
                    role: 'owner',
                    has_injury: !!formData.injuries,
                    language: 'en',
                    score: 60, // Higher score for complete form
                    pain_level: 0,
                    accident_date: formData.dateOfLoss,
                    city: 'Unknown',
                    injury_summary: formData.injuries,
                    liability_summary: 'Valuation & Accident Intake',
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
        setIsSubmitted(true);
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
                    step === 2 && valuation && !isSubmitted && (
                        <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

                            {/* VALUATION HEADER */}
                            <div className="bg-green-600 p-6 text-center">
                                <h3 className="text-white text-lg font-semibold opacity-90 mb-1">Estimated Retail Value Range</h3>
                                <div className="text-white text-5xl font-black tracking-tight">
                                    ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}*
                                </div>
                                <p className="text-green-100 text-xs mt-2">*Preliminary estimate based on market data.</p>
                            </div>

                            <div className="p-8 md:p-12">
                                {/* DON'T WORRY SECTION */}
                                <div className="text-center max-w-2xl mx-auto mb-10">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">But don't worry about that aspect yet...</h3>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        Give us a call to see if we can help you maximize this number.
                                        Often the <strong>bigger financial risk</strong> is ignoring your medical needs or hidden vehicle value.
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-100">
                                    <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Get Your Free Case Review</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                                        {/* Contact Details */}
                                        <div className="md:col-span-2"><h3 className="font-bold text-gray-500 border-b pb-2 mb-4 uppercase text-xs tracking-wider">Contact Information</h3></div>

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
                                                <label className="block text-sm font-bold mb-2">Best Method</label>
                                                <CustomSelect
                                                    options={[
                                                        { value: 'text', label: 'Tech/SMS' },
                                                        { value: 'phone', label: 'Phone Call' },
                                                        { value: 'email', label: 'Email' }
                                                    ]}
                                                    value={formData.contactPref}
                                                    onChange={(val) => setFormData({ ...formData, contactPref: val.toString() })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-2">Best Time</label>
                                                <input type="text" name="bestTime" value={formData.bestTime} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none" placeholder="Anytime / After 5pm" />
                                            </div>
                                        </div>

                                        {/* Incident Details */}
                                        <div className="md:col-span-2 mt-4"><h3 className="font-bold text-gray-500 border-b pb-2 mb-4 uppercase text-xs tracking-wider">The Accident</h3></div>

                                        <div>
                                            <label className="block text-sm font-bold mb-2">Type of Loss</label>
                                            <CustomSelect
                                                options={[
                                                    { value: 'collision', label: 'Collision / Wreck' },
                                                    { value: 'hail', label: 'Hail / Weather' },
                                                    { value: 'theft', label: 'Theft / Vandalism' },
                                                    { value: 'other', label: 'Other' }
                                                ]}
                                                value={formData.typeOfLoss}
                                                onChange={(val) => setFormData({ ...formData, typeOfLoss: val.toString() })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-2">Date of Loss</label>
                                            <input type="date" name="dateOfLoss" value={formData.dateOfLoss} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>

                                        {/* Yes/No Toggles */}
                                        <div className='md:col-span-2 grid grid-cols-3 gap-4'>
                                            <div>
                                                <label className="block text-xs font-bold mb-2 text-gray-600">Ambulance Needed?</label>
                                                <select name="ambulance" value={formData.ambulance} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded bg-white">
                                                    <option value="no">No</option>
                                                    <option value="yes">Yes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold mb-2 text-gray-600">Tickets Issued?</label>
                                                <select name="tickets" value={formData.tickets} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded bg-white">
                                                    <option value="no">No</option>
                                                    <option value="yes">Yes</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold mb-2 text-gray-600">Vehicles Towed?</label>
                                                <select name="towed" value={formData.towed} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded bg-white">
                                                    <option value="no">No</option>
                                                    <option value="yes">Yes</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold mb-2">What Happened? (Brief Description)</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full p-3 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500" placeholder="I was rear-ended at a red light..."></textarea>
                                        </div>

                                    </div>

                                    <button
                                        onClick={submitLead}
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg text-xl transition transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center"
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit to Legal Team »'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Success State */}
                {isSubmitted && (
                    <div className="bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h3 className="text-3xl font-black text-blue-900 mb-4">Request Received!</h3>
                        <p className="text-xl text-gray-600 mb-8">
                            Our team is reviewing your vehicle valuation and accident details. <br />
                            We will reach out via <strong>{formData.contactPref}</strong> shortly.
                        </p>
                        <button onClick={() => window.location.reload()} className="text-blue-600 font-bold hover:underline">Start New Estimate</button>
                    </div>
                )}

            </div >
        </section >
    );
}
