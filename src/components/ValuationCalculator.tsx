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
        // NEW: Trim & Options
        trim: 'base',
        features: [] as string[],
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
    const [valuation, setValuation] = useState<{ min: number, max: number, trimAdj: number, featAdj: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // MOCK DATA for Trims/Features (In real app, fetch based on Make/Model)
    const mockTrims = [
        { id: 'base', label: 'Base / LE / LX', multiplier: 1.0 },
        { id: 'mid', label: 'Mid / XLE / EX', multiplier: 1.12 },
        { id: 'sport', label: 'Sport / SE / GT', multiplier: 1.15 },
        { id: 'limited', label: 'Limited / Touring / Platinum', multiplier: 1.25 },
        { id: 'offroad', label: 'Off-Road / TRD / Rubicon', multiplier: 1.30 }
    ];

    const mockFeatures = [
        { id: 'leather', label: 'Leather Seats', value: 800 },
        { id: 'nav', label: 'Navigation', value: 400 },
        { id: 'sunroof', label: 'Sunroof / Moonroof', value: 650 },
        { id: 'tech', label: 'Driver Assist / Tech Pkg', value: 1200 },
        { id: 'wheels', label: 'Premium Wheels', value: 500 },
        { id: 'tow', label: 'Tow Package', value: 450 },
        { id: 'audio', label: 'Premium Audio', value: 350 },
        { id: '3rd_row', label: '3rd Row Seating', value: 700 }
    ];

    // Use dictionary labels if available
    const labels = dict?.val_calc?.labels || {
        vin: "VIN (Optional)",
        year: "Year",
        make: "Make",
        model: "Model",
        mileage: "Mileage",
        condition: "Condition",
        condition_help: "Good (Clean Retail)",
        btn_next: "Next Step »",
        btn_final: "Get Free Valuation »"
    };

    const handleNextStep1 = () => {
        if (!formData.year || !formData.make || !formData.model) {
            alert("Please fill in Year, Make, and Model.");
            return;
        }
        setStep(2);
    };

    const [isCalculating, setIsCalculating] = useState(false);

    const handleNextStep2 = async () => {
        setIsCalculating(true);
        try {
            // Call our new API endpoint
            const res = await fetch('/api/valuation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: formData.year,
                    make: formData.make,
                    model: formData.model,
                    trim: formData.trim,
                    features: formData.features
                })
            });

            if (!res.ok) throw new Error("Valuation failed");

            const data = await res.json();

            // Calculate Feature Adjustment locally or trust API? 
            // The API returns a 'min'/'max' based on listings. We can add feature value on top if we assume listings are "average".
            // For now, let's assume the API gives the base market value and we add features on top.

            let featAdj = 0;
            formData.features.forEach(fId => {
                const feat = mockFeatures.find(f => f.id === fId);
                if (feat) featAdj += feat.value;
            });

            const baseMin = data.min;
            const baseMax = data.max;

            setValuation({
                min: baseMin + featAdj,
                max: baseMax + featAdj,
                trimAdj: 0, // Included in API search query ideally
                featAdj: featAdj
            });
            setStep(3);

        } catch (error) {
            console.error(error);
            alert("Could not fetch real-time data. Using fallback estimation.");
            // Fallback logic could go here or be handled by the API itself (which it is)
            setStep(3);
        } finally {
            setIsCalculating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleFeature = (featId: string) => {
        setFormData(prev => {
            if (prev.features.includes(featId)) {
                return { ...prev, features: prev.features.filter(f => f !== featId) };
            }
            return { ...prev, features: [...prev.features, featId] };
        });
    };

    const submitLead = async () => {
        setIsSubmitting(true);
        // ... (Referrer logic same as before) ...
        let referrer = 'Direct/Unknown';
        if (typeof document !== 'undefined') referrer = document.referrer || 'Direct';

        const leadMessage = `
🚨 NEW VALUATION LEAD 🚨
------------------------
VALUATION: $${valuation?.min.toLocaleString()} - $${valuation?.max.toLocaleString()}
TRIM: ${formData.trim}
FEATURES: ${formData.features.join(', ')}

👤 CONTACT: ${formData.name} | ${formData.phone} | ${formData.email}
🚗 VEHICLE: ${formData.year} ${formData.make} ${formData.model} (VIN: ${formData.vin})
------------------------
`.trim();

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
                    incident_details: `Vehicle: ${formData.year} ${formData.make} ${formData.model} (${formData.trim}). Features: ${formData.features.join(',')}. Est Value: $${valuation?.min}-${valuation?.max}`,
                    role: 'owner',
                    has_injury: !!formData.injuries,
                    language: 'en',
                    score: 65,
                    pain_level: 0,
                    accident_date: formData.dateOfLoss || new Date().toISOString(),
                    city: 'Unknown'
                })
            });
            // ... (Insert Chat Message logic) ...
        } catch (e) {
            console.error("Error submitting lead:", e);
        }
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    return (
        <section className="py-16 px-4 bg-blue-900 text-white font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-50 text-gray-900 min-h-[600px]">

                    {/* Header / Progress Bar */}
                    <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                        <h2 className="font-bold text-blue-900 text-lg">Total Loss Calculator</h2>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? 'bg-green-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* STEP 1: VEHICLE */}
                        {step === 1 && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-2xl font-black mb-6 text-center">Step 1: Vehicle Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">VIN (Recommended for Exact Match)</label>
                                        <input name="vin" value={formData.vin} onChange={handleInputChange} className="w-full p-2 border rounded font-mono" placeholder="17 Digit VIN" />
                                    </div>
                                    <CustomSelect label="Year" options={Array.from({ length: 25 }, (_, i) => 2025 - i).map(y => ({ label: y.toString(), value: y.toString() }))} value={formData.year} onChange={(v) => setFormData({ ...formData, year: v.toString() })} />
                                    <div><label className="block text-sm font-bold mb-2">Make</label><input name="make" value={formData.make} onChange={handleInputChange} className="w-full p-3 border rounded" placeholder="Toyota" /></div>
                                    <div><label className="block text-sm font-bold mb-2">Model</label><input name="model" value={formData.model} onChange={handleInputChange} className="w-full p-3 border rounded" placeholder="Camry" /></div>
                                    <div><label className="block text-sm font-bold mb-2">Mileage</label><input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="w-full p-3 border rounded" placeholder="50000" /></div>
                                </div>
                                <button onClick={handleNextStep1} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700">Next Step »</button>
                            </div>
                        )}

                        {/* STEP 2: TRIM & FEATURES */}
                        {step === 2 && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-2xl font-black mb-6 text-center">Step 2: Trim & Features</h3>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Select Trim Level</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {mockTrims.map(t => (
                                            <label key={t.id} className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center text-center hover:bg-blue-50 ${formData.trim === t.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'}`}>
                                                <input type="radio" name="trim" value={t.id} checked={formData.trim === t.id} onChange={(e) => setFormData({ ...formData, trim: e.target.value })} className="sr-only" />
                                                <span className="font-bold text-blue-900">{t.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Key Features (Select all that apply)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {mockFeatures.map(f => (
                                            <label key={f.id} className={`p-3 border rounded-lg cursor-pointer flex items-center gap-2 text-sm hover:bg-gray-50 ${formData.features.includes(f.id) ? 'bg-green-50 border-green-500 text-green-800' : 'text-gray-600'}`}>
                                                <input type="checkbox" checked={formData.features.includes(f.id)} onChange={() => toggleFeature(f.id)} className="rounded text-green-600 focus:ring-green-500" />
                                                {f.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="px-6 py-4 border font-bold rounded-xl text-gray-500 hover:text-gray-900">Back</button>
                                    <button onClick={handleNextStep2} disabled={isCalculating} className="flex-1 bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-wait">
                                        {isCalculating ? 'Searching Market...' : 'Calculate Value »'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: RESULTS (Form) */}
                        {step === 3 && !isSubmitted && valuation && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <div className="bg-green-50 border border-green-100 p-6 rounded-2xl mb-8 text-center">
                                    <h4 className="text-green-800 font-bold uppercase text-xs tracking-widest mb-1">Estimated Market Value</h4>
                                    <div className="text-4xl md:text-5xl font-black text-green-700">
                                        ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">Includes +${valuation.trimAdj.toLocaleString()} for Trim and +${valuation.featAdj.toLocaleString()} for Options.</p>
                                </div>

                                <h3 className="text-xl font-bold mb-4 text-center">Where should we send the full report?</h3>
                                <div className="grid grid-cols-1 gap-4 mb-6 max-w-lg mx-auto">
                                    <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="p-3 border rounded w-full" />
                                    <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="p-3 border rounded w-full" />
                                    <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="p-3 border rounded w-full" />
                                </div>
                                <button onClick={submitLead} disabled={isSubmitting} className="w-full md:max-w-md mx-auto block bg-blue-900 text-white font-bold py-4 rounded-xl shadow hover:bg-blue-800">
                                    {isSubmitting ? 'Sending...' : 'Send Full PDF Report »'}
                                </button>
                            </div>
                        )}

                        {/* SUCCESS */}
                        {isSubmitted && (
                            <div className="text-center py-12 animate-in zoom-in duration-300">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-3xl font-black text-blue-900 mb-2">Report Generated!</h3>
                                <p className="text-gray-600">We have texted a link to <b>{formData.phone}</b>.</p>
                                <button onClick={() => window.location.reload()} className="mt-8 text-blue-600 underline">Start New Valuation</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
