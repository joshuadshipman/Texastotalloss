/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { Dictionary } from '@/dictionaries/en';
import { VEHICLE_DATA } from '@/data/vehicles';

interface ValuationCalculatorProps {
    dict: Dictionary;
}

export default function ValuationCalculator({ dict }: ValuationCalculatorProps) {
    const { openChat } = useChat();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        zip: '',
        vin: '',
        year: '',
        make: '',
        model: '',
        mileage: '',
        condition: 'good',
        trim: 'base',
        features: [] as string[]
    });
    const [valuation, setValuation] = useState<{ min: number, max: number, trimAdj: number, featAdj: number, methodology?: string, sources?: any[] } | null>(null);

    // Use dictionary labels if available
    const labels = dict?.val_calc?.labels || {};

    const mockTrims = [
        { id: 'base', label: labels?.trims?.base || 'Base / LE / LX', multiplier: 1.0 },
        { id: 'mid', label: labels?.trims?.mid || 'Mid / XLE / EX', multiplier: 1.12 },
        { id: 'sport', label: labels?.trims?.sport || 'Sport / SE / GT', multiplier: 1.15 },
        { id: 'limited', label: labels?.trims?.limited || 'Limited / Touring / Platinum', multiplier: 1.25 },
        { id: 'offroad', label: labels?.trims?.offroad || 'Off-Road / TRD / Rubicon', multiplier: 1.30 }
    ];

    const mockFeatures = [
        { id: 'leather', label: labels?.features?.leather || 'Leather Seats', value: 800 },
        { id: 'nav', label: labels?.features?.nav || 'Navigation', value: 400 },
        { id: 'sunroof', label: labels?.features?.sunroof || 'Sunroof / Moonroof', value: 650 },
        { id: 'tech', label: labels?.features?.tech || 'Driver Assist / Tech Pkg', value: 1200 },
        { id: 'wheels', label: labels?.features?.wheels || 'Premium Wheels', value: 500 },
        { id: 'tow', label: labels?.features?.tow || 'Tow Package', value: 450 },
        { id: 'audio', label: labels?.features?.audio || 'Premium Audio', value: 350 },
        { id: '3rd_row', label: labels?.features?.['3rd_row'] || '3rd Row Seating', value: 700 }
    ];

    const handleNextStep1 = () => {
        if (!formData.zip || formData.zip.length < 5) {
            alert("Please enter a valid 5-digit Zip Code.");
            return;
        }
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
                    zip: formData.zip,
                    year: formData.year,
                    make: formData.make,
                    model: formData.model,
                    trim: formData.trim,
                    features: formData.features
                })
            });

            if (!res.ok) throw new Error("Valuation failed");

            const data = await res.json();

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
                trimAdj: 0,
                featAdj: featAdj,
                methodology: data.methodology,
                sources: data.sources
            });
            setStep(3);

        } catch (error) {
            console.error(error);
            alert("Could not fetch real-time data. Using fallback estimation.");
            setStep(3);
        } finally {
            setIsCalculating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    return (
        <section className="py-16 px-4 bg-slate-900 text-white font-sans border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-50 text-gray-900 min-h-[600px]">

                    {/* Header / Progress Bar */}
                    <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                        <h2 className="font-bold text-blue-900 text-lg">{labels.calc_title || "Total Loss Calculator"}</h2>
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
                                <h3 className="text-2xl font-black mb-6 text-center">{labels.step1_title || "Step 1: Vehicle Details"}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code *</label>
                                            <input name="zip" value={formData.zip} onChange={handleInputChange} maxLength={5} className="w-full p-2 border rounded font-mono text-center tracking-widest bg-yellow-50 border-yellow-200" placeholder="75001" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{labels.vin || "VIN (Optional)"}</label>
                                            <input name="vin" value={formData.vin} onChange={handleInputChange} className="w-full p-2 border rounded font-mono" placeholder="17 Digit VIN" />
                                        </div>
                                    </div>
                                    <CustomSelect
                                        label={labels.year || "Year"}
                                        options={Object.keys(VEHICLE_DATA).sort((a, b) => b.localeCompare(a)).map(y => ({ label: y, value: y }))}
                                        value={formData.year}
                                        onChange={(v) => {
                                            setFormData({ ...formData, year: v.toString(), make: '', model: '', trim: '' });
                                        }}
                                        placeholder="Select Year"
                                    />

                                    <CustomSelect
                                        label={labels.make || "Make"}
                                        options={formData.year && VEHICLE_DATA[formData.year]
                                            ? Object.keys(VEHICLE_DATA[formData.year]).map(m => ({ label: m, value: m }))
                                            : []}
                                        value={formData.make}
                                        onChange={(v) => {
                                            setFormData({ ...formData, make: v.toString(), model: '', trim: '' });
                                        }}
                                        placeholder={formData.year ? "Select Make" : "Select Year First"}
                                    />

                                    <CustomSelect
                                        label={labels.model || "Model"}
                                        options={formData.year && formData.make && VEHICLE_DATA[formData.year][formData.make]
                                            ? Object.keys(VEHICLE_DATA[formData.year][formData.make]).map(m => ({ label: m, value: m })) // Note: Structure change, Vehicle Data is Make -> Model -> Trims[]
                                            : []}
                                        value={formData.model}
                                        onChange={(v) => {
                                            setFormData({ ...formData, model: v.toString(), trim: '' });
                                        }}
                                        placeholder={formData.make ? "Select Model" : "Select Make First"}
                                    />

                                    <div>
                                        <label className="block text-sm font-bold mb-2">{labels.mileage || "Mileage"}</label>
                                        <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="50000" />
                                    </div>
                                </div>
                                <button onClick={handleNextStep1} className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-navy-800 transition-colors">{labels.btn_next || "Next Step »"}</button>
                            </div>
                        )}

                        {/* STEP 2: TRIM & FEATURES */}
                        {step === 2 && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-2xl font-black mb-6 text-center">{labels.step2_title || "Step 2: Trim & Features"}</h3>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">{labels.select_trim || "Select Trim Level"}</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomSelect
                                            label={labels.select_trim || "Select Trim Level"}
                                            options={formData.year && formData.make && formData.model && VEHICLE_DATA[formData.year][formData.make][formData.model]
                                                ? VEHICLE_DATA[formData.year][formData.make][formData.model].map(t => ({ label: t, value: t }))
                                                : mockTrims.map(t => ({ label: t.label, value: t.id }))} // Fallback if regular data missing
                                            value={formData.trim}
                                            onChange={(v) => setFormData({ ...formData, trim: v.toString() })}
                                            placeholder="Select Trim"
                                        />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">{labels.select_features || "Key Features (Select all that apply)"}</label>
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
                                    <button onClick={() => setStep(1)} className="px-6 py-4 border font-bold rounded-xl text-gray-500 hover:text-gray-900">{labels.back || "Back"}</button>
                                    <button onClick={handleNextStep2} disabled={isCalculating} className="flex-1 bg-gold-500 text-navy-900 font-bold py-4 rounded-xl shadow-lg hover:bg-gold-400 disabled:opacity-50 disabled:cursor-wait transition-colors">
                                        {isCalculating ? (labels.searching || "Searching Market...") : (labels.calculate || "Calculate Value »")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: RESULTS (Empathetic) */}
                        {step === 3 && valuation && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <div className="bg-green-50 border border-green-100 p-6 rounded-2xl mb-8 text-center">
                                    <h4 className="text-green-800 font-bold uppercase text-xs tracking-widest mb-1">{labels.est_value_title || "Estimated Market Value"}</h4>
                                    <div className="text-4xl md:text-5xl font-black text-green-700">
                                        ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">
                                        {(labels.est_value_subtitle || "Includes +${trim} for Trim and +${opts} for Options.")
                                            .replace('{trim}', valuation.trimAdj.toLocaleString())
                                            .replace('{opts}', valuation.featAdj.toLocaleString())}
                                    </p>
                                </div>

                                {valuation.methodology && (
                                    <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                                        <h5 className="font-bold text-slate-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                                            <span className="bg-green-100 text-green-700 p-1 rounded">✓</span> Market Methodology
                                        </h5>
                                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                                            {valuation.methodology}
                                        </p>
                                        {valuation.sources && (
                                            <div className="flex flex-wrap gap-2">
                                                {valuation.sources.map((source, idx) => (
                                                    <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-blue-600 hover:underline hover:bg-blue-50">
                                                        View {source.name} Source ↗
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="text-center animate-in fade-in duration-500 delay-150">
                                    <h3 className="text-2xl font-black text-blue-900 mb-4">{labels.empathy_title || "We understand this might not be enough..."}</h3>
                                    <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                                        {labels.empathy_msg || "It might not be enough to pay off your loan or match what you were expecting. Don't worry about the vehicle right now, worry about you getting better."}
                                    </p>

                                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                                        <button
                                            onClick={() => openChat('valuation', { ...formData, valuation, source: 'calculator' })}
                                            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-black py-4 rounded-xl shadow-xl hover:from-gold-400 hover:to-gold-500 hover:scale-105 transition-all text-lg flex items-center justify-center gap-2"
                                        >
                                            <span>💬</span> {labels.btn_chat || "Chat Now & See How We Can Help »"}
                                        </button>

                                        <a href="/tools/demand-letter" className="block text-center text-blue-600 font-bold hover:underline text-sm mt-2">
                                            {labels.btn_demand || "Or, generate a Total Loss Demand Letter »"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
