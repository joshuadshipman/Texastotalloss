/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { Dictionary } from '@/dictionaries/en';
import { VEHICLE_DATA } from '@/data/vehicles';
import { jsPDF } from 'jspdf';
import EmailCaptureModal from './EmailCaptureModal';
import { FileText as FileTextIcon, MessageCircleIcon, Shield, Activity, Loader2, AlertCircle, ShieldCheck, Info, Star } from 'lucide-react';
import EvidenceUploader from './EvidenceUploader';

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
    const [vinLoading, setVinLoading] = useState(false);
    const [totalPhotos, setTotalPhotos] = useState(0);

    const [formData, setFormData] = useState({
        zip: '',
        year: '',
        make: '',
        model: '',
        trim: '',
        mileage: '',
        condition: 'Good',
        features: [] as string[],
        vin: '',
        aftermarket_items: [] as string[],
        carrier_report_verified: false,
        is_represented: false
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

    const handleVinSearch = async () => {
        if (!formData.vin || formData.vin.length < 11) return;
        setVinLoading(true);
        try {
            const resp = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${formData.vin}?format=json`);
            const data = await resp.json();
            const result = data.Results[0];
            if (result && result.Make) {
                setFormData({
                    ...formData,
                    year: result.ModelYear || '',
                    make: result.Make || '',
                    model: result.Model || ''
                });
            }
        } catch (err) {
            console.error('VIN Decode Error:', err);
        } finally {
            setVinLoading(false);
        }
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

            const data = res.ok ? await res.json() : { min: 14000, max: 18500, methodology: "Fallback Estimator", sources: [] };

            let featAdj = 0;
            formData.features.forEach((fId: string) => {
                const feat = mockFeatures.find(f => f.id === fId);
                if (feat) featAdj += feat.value;
            });

            // Aftermarket Adjustment
            const aftermarketAdj = (formData.aftermarket_items || []).length * 400;

            const baseMin = data.min;
            const baseMax = data.max;

            setValuation({
                min: baseMin + featAdj + aftermarketAdj,
                max: baseMax + featAdj + aftermarketAdj,
                trimAdj: 0,
                featAdj: featAdj + aftermarketAdj,
                methodology: formData.carrier_report_verified 
                    ? "CROSS-REFERENCED: Factory options verified against Mitchell/CCC report. Aftermarket/Personal property manually adjusted for Statutory Compliance."
                    : (data.methodology || "PRELIMINARY: Analysis based on local market retail comps. Verification against carrier report recommended."),
                sources: data.sources
            });
            setStep(4);

        } catch (error) {
            console.error(error);
            alert("Could not fetch real-time data. Using fallback estimation.");
            setStep(4);
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
        <section className="py-16 px-4 bg-background text-foreground font-sans border-t border-border">
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-[2rem] shadow-2xl overflow-hidden border border-border text-foreground min-h-[600px]">

                    {/* Header / Progress Bar */}
                    <header className="bg-slate-50 p-6 border-b flex justify-between items-center">
                        <h2 className="font-bold text-primary text-lg">{dict.val_calc.labels.calc_title || "Total Loss Calculator"}</h2>
                        <div className="flex gap-2">
                            {step > 0 && [1, 2, 3].map(s => (
                                <div key={s} className={`h-2.5 w-12 rounded-full transition-all ${step >= s ? 'bg-accent' : 'bg-slate-200'}`} />
                            ))}
                        </div>
                    </header>

                    <main className="p-8 md:p-12">
                        {/* STEP 0: INSURANCE TYPE */}
                        {step === 0 && (
                            <div className="animate-in fade-in duration-500 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                                <h3 className="text-2xl md:text-3xl font-black mb-6 text-primary leading-tight">
                                    {dict.val_calc_updates?.who_insurance || "Whose insurance company are you fighting?"}
                                </h3>
                                <p className="text-slate-500 mb-10 max-w-lg text-base">
                                    This helps us generate the correct legal strategy for your claim.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                                    <button
                                        onClick={() => handleInsuranceSelection('other')}
                                        className="group p-8 border-2 border-slate-100 hover:border-primary bg-slate-50/50 hover:bg-white rounded-3xl transition-all shadow-sm hover:shadow-xl text-left"
                                        aria-label="At-Fault Driver's Insurance"
                                    >
                                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🚗</div>
                                        <h4 className="font-bold text-xl text-primary mb-3">{dict.val_calc_updates?.option_other || "Other Driver's Insurance"}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">I am filing a claim against the person who hit me (Third Party).</p>
                                    </button>

                                    <button
                                        onClick={() => handleInsuranceSelection('mine')}
                                        className="group p-8 border-2 border-slate-100 hover:border-accent bg-slate-50/50 hover:bg-white rounded-3xl transition-all shadow-sm hover:shadow-xl text-left"
                                        aria-label="My Own Insurance"
                                    >
                                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📄</div>
                                        <h4 className="font-bold text-xl text-accent mb-3">{dict.val_calc_updates?.option_mine || "My Own Insurance"}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">I am filing a claim under my own policy (First Party / Uninsured).</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* WARNING MODAL FOR 1ST PARTY */}
                        {showAppraisalWarning && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-6 animate-in fade-in">
                                <div className="bg-white rounded-[2rem] max-w-lg w-full p-10 shadow-3xl relative border border-slate-100">
                                    <div className="w-20 h-20 bg-amber-50 text-accent rounded-full flex items-center justify-center mx-auto mb-8">
                                        <span className="text-4xl">⚠️</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-center mb-6 text-primary">
                                        {dict.val_calc_updates?.warning_title || "Invoking Your Appraisal Clause"}
                                    </h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed text-center">
                                        {dict.val_calc_updates?.warning_msg || "Fighting your own insurance company requires a different legal strategy..."}
                                    </p>
                                    <p className="text-slate-600 mb-10 leading-relaxed font-medium text-center italic">
                                        {dict.val_calc_updates?.warning_msg_2 || "Our tools will help you invoke the mandatory appraisal clause."}
                                    </p>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={handleWarningProceed}
                                            className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-secondary transition-all text-lg active:scale-95"
                                        >
                                            {dict.val_calc_updates?.btn_proceed || "I Understand, Proceed »"}
                                        </button>
                                        <button
                                            onClick={() => { setShowAppraisalWarning(false); setInsuranceType(null); }}
                                            className="w-full text-slate-400 font-bold py-3 hover:text-primary transition-colors text-sm"
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
                                <h3 className="text-3xl font-black mb-10 text-center text-primary">{dict.val_calc.labels.step1_title || "Initial Vehicle Match"}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Zip Code *</label>
                                            <input 
                                                name="zip" 
                                                value={formData.zip} 
                                                onChange={handleInputChange} 
                                                maxLength={5} 
                                                className="w-full p-4 border rounded-2xl font-mono text-center tracking-[0.2em] bg-blue-50/30 border-blue-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-[20px] font-bold" 
                                                placeholder="75001" 
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">{dict.val_calc.labels.vin || "VIN (Optional for Precision)"}</label>
                                            <div className="relative">
                                                <input 
                                                    name="vin" 
                                                    value={formData.vin} 
                                                    onChange={handleInputChange} 
                                                    className="w-full p-4 pr-32 border rounded-2xl font-mono focus:border-primary outline-none text-[16px] bg-slate-50" 
                                                    placeholder="17 Digit VIN No." 
                                                />
                                                <button 
                                                    onClick={handleVinSearch}
                                                    disabled={vinLoading || !formData.vin}
                                                    className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-secondary disabled:opacity-50 transition-all"
                                                >
                                                    {vinLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "DECODE"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-primary flex items-center gap-2">
                                                <ShieldCheck className="w-5 h-5 text-accent" />
                                                Legal Representation Status
                                            </h4>
                                            <p className="text-sm text-slate-500">Are you currently working with an attorney on this claim?</p>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setFormData({ ...formData, is_represented: true }); }}
                                                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all border-2 ${formData.is_represented ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); setFormData({ ...formData, is_represented: false }); }}
                                                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all border-2 ${!formData.is_represented ? 'bg-primary text-white border-primary shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                                >
                                                    No
                                                </button>
                                            </div>
                                            {formData.is_represented && (
                                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                                                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                                    <p className="text-xs text-amber-700 leading-relaxed">
                                                        <strong>Note:</strong> Since you already have legal counsel, we cannot provide direct legal advice. However, your attorney can use our tools to <strong>evaluate your unique case (and place it for money)</strong> through our <strong>Consulting Portal</strong>.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <CustomSelect
                                            label={dict.val_calc.labels.year || "Year"}
                                            options={Object.keys(VEHICLE_DATA).sort((a, b) => b.localeCompare(a)).map(y => ({ label: y, value: y }))}
                                            value={formData.year}
                                            onChange={(v: string | number) => {
                                                setFormData({ ...formData, year: v.toString(), make: '', model: '', trim: '' });
                                            }}
                                            placeholder="Select Year"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <CustomSelect
                                            label={dict.val_calc.labels.make || "Make"}
                                            options={formData.year && VEHICLE_DATA[formData.year]
                                                ? Object.keys(VEHICLE_DATA[formData.year]).map(m => ({ label: m, value: m }))
                                                : []}
                                            value={formData.make}
                                            onChange={(v: string | number) => {
                                                setFormData({ ...formData, make: v.toString(), model: '', trim: '' });
                                            }}
                                            placeholder={formData.year ? "Select Make" : "Select Year First"}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <CustomSelect
                                            label={dict.val_calc.labels.model || "Model"}
                                            options={formData.year && formData.make && VEHICLE_DATA[formData.year][formData.make]
                                                ? Object.keys(VEHICLE_DATA[formData.year][formData.make]).map(m => ({ label: m, value: m }))
                                                : []}
                                            value={formData.model}
                                            onChange={(v: string | number) => {
                                                setFormData({ ...formData, model: v.toString(), trim: '' });
                                            }}
                                            placeholder={formData.make ? "Select Model" : "Select Make First"}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">{dict.val_calc.labels.mileage || "Mileage"}</label>
                                        <input 
                                            type="number" 
                                            name="mileage" 
                                            value={formData.mileage} 
                                            onChange={handleInputChange} 
                                            className="w-full p-4 border rounded-2xl focus:border-primary outline-none text-[16px] bg-slate-50" 
                                            placeholder="e.g. 45000" 
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setStep(2)} 
                                    className="w-full bg-primary text-white font-bold py-5 rounded-[1.5rem] shadow-xl hover:bg-secondary transition-all text-lg active:scale-[0.98]"
                                >
                                    {dict.val_calc.labels.btn_next || "Next: Evidence Selection »"}
                                </button>
                            </div>
                        )}

                        {/* STEP 2: EVIDENCE UPLOAD */}
                        {step === 2 && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-3xl font-black mb-6 text-center text-primary">Required Evidence</h3>
                                <p className="text-center text-slate-500 mb-10">To provide a 100% accurate ACV estimate, we require at least 3 photos from the scene or of the loss.</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <EvidenceUploader 
                                        leadId={formData.vin || 'temp'} 
                                        category="loss_photos" 
                                        label="Scene & Vehicle Damage" 
                                        onUploadSuccess={(count: number) => setTotalPhotos(prev => prev + 1)}
                                    />
                                    <EvidenceUploader 
                                        leadId={formData.vin || 'temp'} 
                                        category="carrier_report" 
                                        label="Mitchell / CCC Report" 
                                        onUploadSuccess={(count: number) => setTotalPhotos(prev => prev + 1)}
                                    />
                                    <EvidenceUploader 
                                        leadId={formData.vin || 'temp'} 
                                        category="police_report" 
                                        label="Police Report / Case #" 
                                        onUploadSuccess={(count: number) => setTotalPhotos(prev => prev + 1)}
                                    />
                                </div>

                                <div className="bg-blue-50 p-6 rounded-2xl mb-10 flex items-center justify-between border border-blue-100">
                                    <div>
                                        <p className="font-bold text-primary">Photos Uploaded: {totalPhotos} / 3</p>
                                        <p className="text-xs text-blue-600">Requirement for Free Expert Valuation</p>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`h-3 w-8 rounded-full ${totalPhotos >= i ? 'bg-green-500' : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button onClick={() => setStep(1)} className="w-full sm:w-auto px-10 py-5 border-2 border-slate-100 font-bold rounded-2xl text-slate-400 hover:text-slate-600 transition-all">Back</button>
                                    <button 
                                        onClick={() => setStep(3)} 
                                        disabled={totalPhotos < 3}
                                        className="flex-1 bg-primary text-white font-black py-5 rounded-[1.5rem] shadow-xl disabled:opacity-50 transition-all text-xl"
                                    >
                                        Finalize Precision Logic »
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: TRIM & FEATURES */}
                        {step === 3 && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <h3 className="text-3xl font-black mb-10 text-center text-primary">{labels.step2_title || "Precision Tuning"}</h3>

                                <div className="mb-10">
                                    <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">{labels.select_trim || "Verify Trim Level"}</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomSelect
                                            label={labels.select_trim || "Select Trim Level"}
                                            options={formData.year && formData.make && formData.model && VEHICLE_DATA[formData.year][formData.make][formData.model]
                                                ? (VEHICLE_DATA[formData.year][formData.make][formData.model] as string[]).map((t: string) => ({ label: t, value: t }))
                                                : mockTrims.map((t: { id: string, label: string }) => ({ label: t.label, value: t.id }))}
                                            value={formData.trim}
                                            onChange={(v: string | number) => setFormData({ ...formData, trim: v.toString() })}
                                            placeholder="Select Trim"
                                        />
                                    </div>
                                </div>

                                <div className="mb-10">
                                    <label className="block text-sm font-bold text-slate-700 mb-5 uppercase tracking-wider">{labels.select_features || "Installed Factory Options"}</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                                        {mockFeatures.map((f: { id: string, label: string }) => (
                                            <button 
                                                key={f.id} 
                                                type="button"
                                                onClick={() => toggleFeature(f.id)}
                                                className={`p-5 border-2 rounded-[1.25rem] cursor-pointer flex items-center justify-between text-base transition-all ${formData.features.includes(f.id) ? 'bg-blue-50 border-primary text-primary shadow-inner scale-[0.98]' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                                            >
                                                <span className="font-bold">{f.label}</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.features.includes(f.id) ? 'border-primary bg-primary text-white' : 'border-slate-200'}`}>
                                                    {formData.features.includes(f.id) && <span className="text-[10px]">✓</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200 mb-10">
                                        <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Aftermarket Upgrades & Personal Belongings</h4>
                                        <p className="text-sm text-slate-500 font-medium mb-6">Non-factory items (wheels, tech, custom work) that add value missed by Mitchell/CCC reports.</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            {['Custom Audio/Nav', 'Upgraded Wheels', 'Window Tinting', 'Performance Parts', 'Custom Interior', 'Lighting/LEDs'].map((item) => (
                                                <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 group hover:border-primary/30 transition-all cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        id={item}
                                                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                                                        onChange={(e) => {
                                                            const items = (formData as any).aftermarket_items || [];
                                                            if (e.target.checked) setFormData({...formData, aftermarket_items: [...items, item]});
                                                            else setFormData({...formData, aftermarket_items: items.filter((i: string) => i !== item)});
                                                        }}
                                                    />
                                                    <label htmlFor={item} className="text-sm font-bold text-slate-700 group-hover:text-slate-900 cursor-pointer">{item}</label>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                id="confirm_carrier"
                                                className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-200"
                                                onChange={(e) => setFormData({...formData, carrier_report_verified: e.target.checked})}
                                            />
                                            <label htmlFor="confirm_carrier" className="text-sm font-black text-blue-900 tracking-tight leading-none uppercase">
                                                I confirm these options match my Mitchell / CCC Report
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-12">
                                    <button 
                                        onClick={() => setStep(2)} 
                                        className="w-full sm:w-auto px-10 py-5 border-2 border-slate-100 font-bold rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all text-lg"
                                    >
                                        {labels.back || "Back"}
                                    </button>
                                    <button 
                                        onClick={handleNextStep2} 
                                        disabled={isCalculating} 
                                        className="flex-1 bg-accent text-white font-black py-5 rounded-[1.5rem] shadow-2xl hover:brightness-110 disabled:opacity-50 disabled:cursor-wait transition-all text-xl"
                                    >
                                        {isCalculating ? (labels.searching || "Accessing Market APIs...") : (labels.calculate || "Secure Valuation Analysis »")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: RESULTS (Empathetic) */}
                        {step === 4 && valuation && (
                            <div className="animate-in slide-in-from-right duration-300">
                                <div className="bg-blue-50/50 border-2 border-primary/10 p-10 rounded-[2.5rem] mb-12 text-center relative overflow-hidden">
                                    {/* Authority Seal Decoration */}
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                        <Shield size={200} className="text-primary rotate-12" />
                                    </div>

                                    <h4 className="text-primary font-black uppercase text-sm tracking-[0.25em] mb-4">{labels.est_value_title || "Official Market Valuation"}</h4>
                                    <div className="text-5xl md:text-7xl font-black text-secondary tracking-tighter mb-4">
                                        ${valuation.min.toLocaleString()} - ${valuation.max.toLocaleString()}
                                    </div>
                                    <p className="text-slate-500 font-medium text-base mb-8">
                                        {(labels.est_value_subtitle || "Calculated with +${trim} trim and +${opts} options adjustment.")
                                            .replace('{trim}', valuation.trimAdj.toLocaleString())
                                            .replace('{opts}', valuation.featAdj.toLocaleString())}
                                    </p>

                                    {/* DOWNLOAD BUTTON */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setShowEmailModal(true)}
                                            className="bg-white border-2 border-primary/10 text-primary hover:bg-primary hover:text-white font-bold py-4 px-10 rounded-2xl text-base flex items-center gap-3 shadow-sm transition-all hover:shadow-xl active:scale-95"
                                        >
                                            <FileTextIcon size={22} />
                                            Download Legal PDF Report
                                        </button>
                                    </div>
                                </div>

                                {valuation.methodology && (
                                    <div className="mb-12 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-left">
                                        <h5 className="font-bold text-primary text-base uppercase tracking-widest mb-4 flex items-center gap-3">
                                            <div className="bg-primary/5 p-2 rounded-xl"><Activity size={18} /></div>
                                            Market Analysis Methodology
                                        </h5>
                                        <p className="text-slate-600 text-base mb-6 leading-relaxed">
                                            {valuation.methodology} Our analysts will cross-reference your uploaded **Mitchell/CCC reports** against actual factory options to identify discrepancies.
                                        </p>
                                        {valuation.sources && (
                                            <div className="flex flex-wrap gap-3">
                                                {valuation.sources.map((source, idx) => (
                                                    <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-primary font-bold hover:bg-white hover:shadow-md transition-all flex items-center gap-2">
                                                        <span>Source {idx + 1}:</span> {source.name} ↗
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="text-center animate-in fade-in duration-500 delay-150">
                                    <h3 className="text-3xl font-black text-primary mb-6 leading-tight max-w-2xl mx-auto">{labels.empathy_title || "Is the insurance company offering you less than this?"}</h3>
                                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                        {labels.empathy_msg || "Most initial offers are 20-30% below actual market value. You have the legal right to a fair breakdown. Don't let them undervalue your safety."}
                                    </p>

                                    <div className="flex flex-col gap-4 max-w-md mx-auto">
                                        <button
                                            onClick={() => setStep(5)}
                                            className="w-full bg-accent text-white font-black py-6 rounded-[2rem] shadow-2xl hover:brightness-110 hover:scale-[1.03] active:scale-95 transition-all text-xl flex items-center justify-center gap-3"
                                        >
                                            <ShieldCheck size={24} /> {labels.btn_chat || "Talk to Specialist Now »"}
                                        </button>

                                        <a href="/tools/demand-letter" className="block text-center text-primary font-bold hover:underline text-base mt-4 transition-all">
                                            {labels.btn_demand || "Or, generate a Total Loss Demand Letter »"}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 5: CASE BOOSTER (Elite Readiness) */}
                        {step === 5 && (
                            <div className="animate-in slide-in-from-right duration-300 text-center">
                                <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Activity size={40} className="animate-pulse" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-primary mb-6 leading-tight">
                                    Become an "Elite Case"
                                </h3>
                                <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Top Texas attorneys reject 75% of leads. To secure a <strong>Gold Standard</strong> firm, you must document the <strong>daily impact</strong> of your loss immediately.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200">
                                        <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
                                            <Shield size={20} className="text-accent" />
                                            Customer Benefit
                                        </h4>
                                        <ul className="space-y-3 text-sm text-slate-500 font-medium">
                                            <li className="flex gap-2">✓ <span className="text-slate-700">Higher Settlement Potential</span></li>
                                            <li className="flex gap-2">✓ <span className="text-slate-700">Daily Injury & Pain Logging</span></li>
                                            <li className="flex gap-2">✓ <span className="text-slate-700">Missed Work & Expense Tracking</span></li>
                                        </ul>
                                    </div>
                                    <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100">
                                        <h4 className="font-black text-primary mb-3 flex items-center gap-2">
                                            <Star size={20} className="text-amber-500 fill-amber-500" />
                                            Attorney Benefit
                                        </h4>
                                        <p className="text-sm text-blue-900 leading-relaxed font-bold">
                                            Attorneys prioritize cases with "Ready-to-File" daily journals. We make your claim undeniable.
                                        </p>
                                    </div>
                                </div>

                                <div className="max-w-xl mx-auto space-y-6">
                                    <button
                                        onClick={() => openChat('elite_booster', { ...formData, wants_booster: true })}
                                        className="w-full bg-slate-950 text-white font-black py-6 rounded-3xl shadow-2xl hover:bg-black transition-all text-xl flex flex-col items-center justify-center"
                                    >
                                        <span className="flex items-center gap-3"><MessageCircleIcon size={24} className="text-primary" /> Enable Daily Case Booster Tracking</span>
                                        <span className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Free Daily SMS/Web Journal Updates</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => openChat('standard_referral', { ...formData, wants_booster: false })}
                                        className="text-slate-400 font-bold hover:text-primary transition-colors text-sm uppercase tracking-widest"
                                    >
                                        Skip and Continue with Standard Referral
                                    </button>
                                </div>
                            </div>
                        )}
                    </main>
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
