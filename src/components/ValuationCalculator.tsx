/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { Dictionary } from '@/dictionaries/en';
import { VEHICLE_DATA } from '@/data/vehicles';
import { jsPDF } from 'jspdf';
import EmailCaptureModal from './EmailCaptureModal';
import { FileTextIcon, MessageCircleIcon } from 'lucide-react';

interface ValuationCalculatorProps {
    dict: Dictionary;
}

export default function ValuationCalculator({ dict }: ValuationCalculatorProps) {
    const { openChat } = useChat();
    const [step, setStep] = useState(0); // Start at Step 0
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [insuranceType, setInsuranceType] = useState<'mine' | 'other' | null>(null);
    const [showAppraisalWarning, setShowAppraisalWarning] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);

    const [formData, setFormData] = useState({
        zip: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        mileage: '',
        condition: 'Good',
        features: [] as string[],
        vin: ''
    });

    const [valuation, setValuation] = useState<{
        min: number;
        max: number;
        trimAdj: number;
        featAdj: number;
        methodology?: string;
        sources?: any[];
    } | null>(null);

    const labels = dict.val_calc.labels;

    // Mock Data Helpers
    const mockTrims = [
        { id: 'Base', label: labels.trims?.base || "Base / LE / LX" },
        { id: 'Mid', label: labels.trims?.mid || "Mid / XLE / EX" },
        { id: 'Sport', label: labels.trims?.sport || "Sport / SE / GT" },
        { id: 'Limited', label: labels.trims?.limited || "Limited / Touring / Platinum" }
    ];

    const mockFeatures = [
        { id: 'Leather', label: labels.features?.leather || "Leather", value: 850 },
        { id: 'Nav', label: labels.features?.nav || "Navigation", value: 400 },
        { id: 'Sunroof', label: labels.features?.sunroof || "Sunroof", value: 550 },
        { id: 'Wheels', label: labels.features?.wheels || "Premium Wheels", value: 600 }
    ];

    const generatePDF = (email?: string) => {
        if (!valuation) return;

        const doc = new jsPDF();
        const date = new Date().toLocaleDateString();

        // 1. Header with Authority
        doc.setFillColor(30, 58, 138); // Navy Blue
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text("TexasTotalLoss.com", 20, 20);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text("Official Preliminary Valuation Report", 20, 30);

        doc.setTextColor(0, 0, 0);

        // 2. Vehicle Details Scope
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${date}`, 20, 50);
        if (email) doc.text(`Prepared for: ${email}`, 20, 55);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 60, 190, 60);

        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`${formData.year} ${formData.make} ${formData.model}`, 20, 70);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Trim: ${formData.trim}`, 20, 78);
        doc.text(`Mileage: ${formData.mileage} miles`, 20, 84);
        doc.text(`Zip Code: ${formData.zip}`, 20, 90);

        // 3. The Valuation (The Hero)
        doc.setFillColor(240, 253, 244); // Light Green bg
        doc.rect(20, 100, 170, 40, 'F');

        doc.setFontSize(14);
        doc.setTextColor(21, 128, 61); // Green text
        doc.text("ESTIMATED MARKET VALUE RANGE", 30, 115);

        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${valuation.min.toLocaleString()} - $${valuation.max.toLocaleString()}`, 30, 130);

        // 4. Adjustments
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let yPos = 160;
        doc.text("Valuation Factors Considered:", 20, yPos);
        yPos += 7;
        doc.text(`- Trim Adjustment: +$${valuation.trimAdj.toLocaleString()}`, 25, yPos);
        yPos += 7;
        doc.text(`- Options/Features: +$${valuation.featAdj.toLocaleString()}`, 25, yPos);
        yPos += 7;
        doc.text(`- Local Market Demand (Zip ${formData.zip})`, 25, yPos);

        // 5. Legal disclaimer / Authority
        yPos += 20;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("NOTE: This is a preliminary market assessment based on retail ask prices of comparable vehicles", 20, yPos);
        yPos += 5;
        doc.text("in your area. Insurance companies often use 'CCC One' or 'Audatex' reports which may significantly", 20, yPos);
        yPos += 5;
        doc.text("undervalue your vehicle. Under Texas Insurance Code 542.003, you have the right to a fair breakdown.", 20, yPos);

        // 6. CTA / Next Step
        yPos += 25;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Did the insurance company offer you less?", 20, yPos);
        yPos += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text("You may be entitled to thousands more. Our attorneys can review this for FREE.", 20, yPos);
        yPos += 10;
        doc.setTextColor(30, 58, 138);
        doc.text("Call Now: 1-800-555-0199 or Visit TexasTotalLoss.com", 20, yPos);

        doc.save('TexasTotalLoss_Valuation_Report.pdf');
    };

    const handleEmailSubmit = async (email: string) => {
        try {
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    source: 'calculator_pdf',
                    vehicle_info: `${formData.year} ${formData.make} ${formData.model}`,
                    valuation: valuation
                })
            });
        } catch (e) {
            console.error("Lead save error", e);
        }
        generatePDF(email);
        setShowEmailModal(false);
    };

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

    const handleNextStep2 = async () => {
        setIsCalculating(true);
        try {
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

    const handleInsuranceSelection = (type: 'mine' | 'other') => {
        setInsuranceType(type);
        if (type === 'mine') {
            setShowAppraisalWarning(true);
        } else {
            setStep(1);
        }
    };

    const handleWarningProceed = () => {
        setShowAppraisalWarning(false);
        setStep(1);
    };

    return (
        <section className="py-16 px-4 bg-slate-900 text-white font-sans border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-50 text-gray-900 min-h-[600px]">

                    {/* Header / Progress Bar */}
                    <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                        <h2 className="font-bold text-blue-900 text-lg">{dict.val_calc.labels.calc_title || "Total Loss Calculator"}</h2>
                        <div className="flex gap-2">
                            {step > 0 && [1, 2, 3].map(s => (
                                <div key={s} className={`h-2 w-12 rounded-full transition-all ${step >= s ? 'bg-green-500' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* STEP 0: INSURANCE TYPE */}
                        {step === 0 && (
                            <div className="animate-in fade-in duration-500 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                                <h3 className="text-2xl md:text-3xl font-black mb-4 text-navy-900">
                                    {dict.val_calc_updates?.who_insurance || "Whose insurance company are you fighting?"}
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-lg">
                                    This helps us generate the correct legal strategy for your claim.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                                    <button
                                        onClick={() => handleInsuranceSelection('other')}
                                        className="group p-8 border-2 border-green-100 hover:border-green-500 bg-green-50/50 hover:bg-green-50 rounded-2xl transition-all shadow-sm hover:shadow-xl text-left"
                                    >
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🚗</div>
                                        <h4 className="font-bold text-lg text-green-800 mb-2">{dict.val_calc_updates?.option_other || "At-Fault Driver's Insurance"}</h4>
                                        <p className="text-sm text-gray-600">I am filing a claim against the person who hit me (Third Party).</p>
                                    </button>

                                    <button
                                        onClick={() => handleInsuranceSelection('mine')}
                                        className="group p-8 border-2 border-blue-100 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-2xl transition-all shadow-sm hover:shadow-xl text-left"
                                    >
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📄</div>
                                        <h4 className="font-bold text-lg text-blue-900 mb-2">{dict.val_calc_updates?.option_mine || "My Own Insurance"}</h4>
                                        <p className="text-sm text-gray-600">I am filing a claim under my own policy (First Party / Uninsured).</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* WARNING MODAL FOR 1ST PARTY */}
                        {showAppraisalWarning && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
                                <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative">
                                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl">⚠️</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-center mb-4 text-gray-900">
                                        {dict.val_calc_updates?.warning_title || "Invoking Your Appraisal Clause"}
                                    </h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        {dict.val_calc_updates?.warning_msg || "Fighting your own insurance company is different..."}
                                    </p>
                                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                                        {dict.val_calc_updates?.warning_msg_2 || "Our tools are optimized for Third-Party claims..."}
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleWarningProceed}
                                            className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-navy-800 transition-all"
                                        >
                                            {dict.val_calc_updates?.btn_proceed || "I Understand, Proceed to Calculator »"}
                                        </button>
                                        <button
                                            onClick={() => { setShowAppraisalWarning(false); setInsuranceType(null); }}
                                            className="w-full text-slate-500 font-medium py-3 hover:text-slate-800"
                                        >
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 1: VEHICLE */}
                        {step === 1 && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-2xl font-black mb-6 text-center">{dict.val_calc.labels.step1_title || "Step 1: Vehicle Details"}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code *</label>
                                            <input name="zip" value={formData.zip} onChange={handleInputChange} maxLength={5} className="w-full p-2 border rounded font-mono text-center tracking-widest bg-yellow-50 border-yellow-200" placeholder="75001" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{dict.val_calc.labels.vin || "VIN (Optional)"}</label>
                                            <input name="vin" value={formData.vin} onChange={handleInputChange} className="w-full p-2 border rounded font-mono" placeholder="17 Digit VIN" />
                                        </div>
                                    </div>
                                    <CustomSelect
                                        label={dict.val_calc.labels.year || "Year"}
                                        options={Object.keys(VEHICLE_DATA).sort((a, b) => b.localeCompare(a)).map(y => ({ label: y, value: y }))}
                                        value={formData.year}
                                        onChange={(v) => {
                                            setFormData({ ...formData, year: v.toString(), make: '', model: '', trim: '' });
                                        }}
                                        placeholder="Select Year"
                                    />

                                    <CustomSelect
                                        label={dict.val_calc.labels.make || "Make"}
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
                                        label={dict.val_calc.labels.model || "Model"}
                                        options={formData.year && formData.make && VEHICLE_DATA[formData.year][formData.make]
                                            ? Object.keys(VEHICLE_DATA[formData.year][formData.make]).map(m => ({ label: m, value: m }))
                                            : []}
                                        value={formData.model}
                                        onChange={(v) => {
                                            setFormData({ ...formData, model: v.toString(), trim: '' });
                                        }}
                                        placeholder={formData.make ? "Select Model" : "Select Make First"}
                                    />

                                    <div>
                                        <label className="block text-sm font-bold mb-2">{dict.val_calc.labels.mileage || "Mileage"}</label>
                                        <input type="number" name="mileage" value={formData.mileage} onChange={handleInputChange} className="w-full p-3 border rounded-xl" placeholder="50000" />
                                    </div>
                                </div>
                                <button onClick={handleNextStep1} className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-navy-800 transition-colors">{dict.val_calc.labels.btn_next || "Next Step »"}</button>
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
                                                : mockTrims.map(t => ({ label: t.label, value: t.id }))}
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
                                <div className="bg-green-50 border border-green-100 p-6 rounded-2xl mb-8 text-center relative overflow-hidden">
                                    {/* Official Seal Watermark */}
                                    <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                                        <div className="w-40 h-40 bg-green-900 rounded-full"></div>
                                    </div>

                                    <h4 className="text-green-800 font-bold uppercase text-xs tracking-widest mb-1">{labels.est_value_title || "Estimated Market Value"}</h4>
                                    <div className="text-4xl md:text-5xl font-black text-green-700">
                                        ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-green-600 mt-2">
                                        {(labels.est_value_subtitle || "Includes +${trim} for Trim and +${opts} for Options.")
                                            .replace('{trim}', valuation.trimAdj.toLocaleString())
                                            .replace('{opts}', valuation.featAdj.toLocaleString())}
                                    </p>

                                    {/* DOWNLOAD BUTTON */}
                                    <div className="mt-6 flex justify-center">
                                        <button
                                            onClick={() => setShowEmailModal(true)}
                                            className="bg-white border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 font-bold py-2 px-6 rounded-full text-sm flex items-center gap-2 shadow-sm transition-all"
                                        >
                                            <FileTextIcon size={16} />
                                            Download Official PDF Report
                                        </button>
                                    </div>
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

            <EmailCaptureModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSubmit={handleEmailSubmit}
                title="Save This Valuation"
                description="We'll send the official PDF report to your email immediately."
            />
        </section>
    );
}
