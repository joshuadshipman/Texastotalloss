'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Car, AlertTriangle, DollarSign, CheckCircle, Calculator, PhoneCall, Share2, Stethoscope, Truck, Bike } from 'lucide-react';
import EvidenceUploader from './EvidenceUploader';

interface CalculatorData {
    accidentType: string;
    vehicleStatus: string;
    hasInjury: string;
    medicalBills: string;
    lostWages: string;
    name: string;
    email: string;
    phone: string;
    zipCode: string;
    carrier: string;
    accidentDate: string;
}

const ACCIDENT_TYPES = [
    { label: 'Car Accident', value: 'car', icon: Car, color: 'blue' },
    { label: 'Truck/18-Wheeler', value: 'truck', icon: Truck, color: 'orange' },
    { label: 'Motorcycle', value: 'motorcycle', icon: Bike, color: 'purple' },
    { label: 'Rear-End', value: 'rear_end', icon: Car, color: 'red' },
    { label: 'T-Bone', value: 't_bone', icon: Car, color: 'amber' },
    { label: 'Hail Damage', value: 'hail', icon: AlertTriangle, color: 'cyan' }
];

const STEPS = [
    { id: 1, title: 'Type' },
    { id: 2, title: 'Details' }, // Renamed from Status
    { id: 3, title: 'Injury' },
    { id: 4, title: 'Costs' },
    { id: 5, title: 'Contact' },
    { id: 6, title: 'Result' }
];

export default function AccidentCalculator() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [estimate, setEstimate] = useState<{ low: number; high: number; score: number } | null>(null);
    const [leadId, setLeadId] = useState<string | number | null>(null);
    const [formData, setFormData] = useState<CalculatorData>({
        accidentType: '',
        vehicleStatus: '',
        hasInjury: '',
        medicalBills: '',
        lostWages: '',
        name: '',
        email: '',
        phone: '',
        zipCode: '',
        carrier: '',
        accidentDate: ''
    });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, STEPS.length));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const calculateEstimate = () => {
        let baseValue = 0;
        let score = 0;
        
        const bills = parseFloat(formData.medicalBills) || 0;
        const wages = parseFloat(formData.lostWages) || 0;

        // A. Valuation Potential (V) - Weight: 40% (Simplified for MVP)
        let vScore = 0;
        if (formData.vehicleStatus === 'total_loss') {
            baseValue += 12000; // Updated higher TX average
            vScore = 100;
        } else if (formData.vehicleStatus === 'repairable') {
            baseValue += 4500;
            vScore = 50;
        }
        score += vScore * 0.40;

        // B. Delay & Statutory Penalty (D) - Weight: 25%
        let dScore = 0;
        if (formData.accidentDate) {
            const daysSinceAccident = Math.floor((Date.now() - new Date(formData.accidentDate).getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceAccident > 60) dScore = 100;
            else if (daysSinceAccident > 30) dScore = 75;
            else if (daysSinceAccident > 15) dScore = 50;
        }
        score += dScore * 0.25;

        // C. Impact & Injury (I) - Weight: 20%
        let iScore = 0;
        if (formData.hasInjury === 'Yes') {
            const multiplier = formData.accidentType === 'truck' ? 3.5 : 2.0;
            baseValue += (bills * multiplier) + wages + 10000; // Base value for pain/suffering
            iScore = 100;
        }
        score += iScore * 0.20;

        // D. Policy/Carrier Risk (P) - Weight: 15%
        let pScore = 25; // Default for standard liability
        const aggressiveCarriers = ['State Farm', 'Allstate', 'Progressive'];
        if (aggressiveCarriers.some(c => formData.carrier.includes(c))) {
            pScore = 75; // Higher exposure due to known aggressive valuation
        }
        score += pScore * 0.15;

        return {
            low: Math.round(baseValue * 0.85),
            high: Math.round(baseValue * 1.35), // Increased ceiling for negotiation room
            score: Math.round(score)
        };
    };

    const handleSubmit = async () => {
        setLoading(true);
        const result = calculateEstimate();
        setEstimate(result);

        try {
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: `calc_${Date.now()}`, // Generate a temporary session ID
                    full_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    carrier: formData.carrier,
                    zipCode: formData.zipCode,
                    accidentDate: formData.accidentDate,
                    source: 'accident_calculator',
                    source_type: 'organic',
                    vehicle_value: result.high, // Use high estimate for scoring potential
                    has_injury: formData.hasInjury === 'Yes',
                    tools_used: ['calculator'],
                    description: `Accident Type: ${formData.accidentType}, Status: ${formData.vehicleStatus}`,
                    user_data: {
                        ...formData,
                        estimated_value: result
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Lead Submission Error:', data.error);
                // Fallback to direct insertion if API fails? 
                // No, let's trust the API or report error.
            }

            if (data && data.id) {
                setLeadId(data.id);
            }

            setStep(6);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!estimate) return;
        const text = `I just got a free case estimate from Texas Total Loss! My potential claim value: $${estimate.low.toLocaleString()} - $${estimate.high.toLocaleString()}. Get yours: https://texastotalloss.com/en/assessment`;

        if (navigator.share) {
            await navigator.share({ text });
        } else {
            navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8">
            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-600">Step {step} of {STEPS.length}</span>
                    <span className="text-xs text-gray-400">{STEPS[step - 1]?.title}</span>
                </div>
                <div className="flex space-x-1.5">
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={`h-2 flex-1 rounded-full transition-all duration-500 ${s.id < step ? 'bg-green-500' :
                                s.id === step ? 'bg-blue-600 animate-pulse' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="p-6 sm:p-8 min-h-[400px]">
                {/* Step 1: Accident Type */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What type of accident?</h2>
                            <p className="text-gray-500 mt-2">Select the option that best describes your situation</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {ACCIDENT_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => { setFormData({ ...formData, accidentType: type.value }); handleNext(); }}
                                        className="p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                                            <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-700 text-center">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 2: Details & Status */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Accident Details</h2>
                            <p className="text-gray-500 mt-2">Help us analyze local market conditions and carrier behaviors</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Carrier Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. State Farm"
                                    value={formData.carrier}
                                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Accident Zip</label>
                                <input
                                    type="text"
                                    placeholder="77XXX"
                                    maxLength={5}
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Accident Date</label>
                                <input
                                    type="date"
                                    value={formData.accidentDate}
                                    onChange={(e) => setFormData({ ...formData, accidentDate: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">Vehicle Condition</label>
                            {[
                                { label: 'Total Loss', desc: 'Vehicle is not drivable or repairable', value: 'total_loss', emoji: '🚗💥' },
                                { label: 'Repairable', desc: 'Drivable with damage', value: 'repairable', emoji: '🔧' },
                                { label: 'Diminished Value', desc: 'Repaired but worth less now', value: 'dv', emoji: '📉' }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { 
                                        setFormData({ ...formData, vehicleStatus: opt.value }); 
                                        handleNext(); 
                                    }}
                                    className={`w-full p-4 border-2 rounded-xl transition-all flex items-center justify-between group text-left ${
                                        formData.vehicleStatus === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{opt.emoji}</span>
                                        <div>
                                            <span className="block text-base font-semibold text-gray-800">{opt.label}</span>
                                            <span className="text-xs text-gray-500">{opt.desc}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className={`transition-colors ${formData.vehicleStatus === opt.value ? 'text-blue-600' : 'text-gray-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Injury */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <div className="inline-flex p-4 bg-red-50 rounded-full mb-4">
                                <Stethoscope className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Were there any injuries?</h2>
                            <p className="text-gray-500 mt-2">Even minor pain counts (neck, back, headaches)</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => { setFormData({ ...formData, hasInjury: 'Yes' }); handleNext(); }}
                                className="p-8 border-2 border-gray-100 rounded-2xl hover:border-red-500 hover:bg-red-50 text-center transition-all group"
                            >
                                <span className="text-4xl block mb-2">🤕</span>
                                <span className="text-xl font-bold text-gray-800 group-hover:text-red-600">Yes</span>
                            </button>
                            <button
                                onClick={() => { setFormData({ ...formData, hasInjury: 'No' }); handleNext(); }}
                                className="p-8 border-2 border-gray-100 rounded-2xl hover:border-green-500 hover:bg-green-50 text-center transition-all group"
                            >
                                <span className="text-4xl block mb-2">👍</span>
                                <span className="text-xl font-bold text-gray-800 group-hover:text-green-600">No</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Financials */}
                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Financial Impact</h2>
                            <p className="text-gray-500 mt-2">Approximate amounts are fine</p>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Bills (Estimate)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-medium transition-all"
                                        onChange={(e) => setFormData({ ...formData, medicalBills: e.target.value })}
                                        value={formData.medicalBills}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Lost Wages (if any)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-medium transition-all"
                                        onChange={(e) => setFormData({ ...formData, lostWages: e.target.value })}
                                        value={formData.lostWages}
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-200">
                            Continue
                        </button>
                    </div>
                )}

                {/* Step 5: Contact */}
                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Almost done!</h2>
                            <p className="text-gray-500 mt-2">Where should we send your estimate?</p>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                value={formData.name}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                value={formData.email}
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                value={formData.phone}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.email}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-lg flex justify-center items-center space-x-2 shadow-lg shadow-green-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><Calculator className="animate-spin" /> Calculating...</span>
                            ) : (
                                <span>Get My Free Estimate →</span>
                            )}
                        </button>
                    </div>
                )}

                {/* Step 6: Result */}
                {step === 6 && estimate && (
                    <div className="space-y-8 animate-in zoom-in duration-500">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center p-6 bg-blue-50 rounded-full mb-6 relative">
                                <Calculator className="h-10 w-10 text-blue-600" />
                                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                                    SCORE: {estimate.score}
                                </div>
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900">Your Case Assessment</h2>
                            <p className="text-gray-500 mt-2">Based on current Texas statutes and market data</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-blue-100">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest text-center block">Estimated Recovery</span>
                                <div className="flex items-baseline justify-center gap-2 mt-2">
                                    <span className="text-4xl font-black text-gray-900">${estimate.low.toLocaleString()}</span>
                                    <span className="text-gray-400 font-medium">to</span>
                                    <span className="text-4xl font-black text-gray-900">${estimate.high.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className={`p-6 rounded-3xl border ${estimate.score > 75 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                                <span className="text-xs font-bold uppercase tracking-widest text-center block">Case Intensity</span>
                                <div className="mt-2 text-center">
                                    <span className={`text-2xl font-black ${estimate.score > 75 ? 'text-amber-700' : 'text-green-700'}`}>
                                        {estimate.score > 75 ? '🔥 HIGH PRIORITY' : '✅ STANDARD CLAIM'}
                                    </span>
                                    <p className="text-sm mt-1 opacity-80">
                                        {estimate.score > 75 
                                            ? 'Significant statutory violations or valuation gaps detected.' 
                                            : 'Your claim appears to fall within standard ranges.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* TIC 542.060 "18% Hammer" Alert */}
                        <div className="bg-red-900 text-white p-6 rounded-3xl shadow-xl border-4 border-red-700">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="h-6 w-6 text-red-400" />
                                <span className="font-black text-lg">18% PENALTY ALERT</span>
                            </div>
                            <p className="text-sm text-red-50 font-medium leading-relaxed">
                                Under **Texas Insurance Code § 542.060**, if your carrier delays payment beyond strict deadlines, they may owe you **18% annual interest** as damages.
                            </p>
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                <button className="flex-1 bg-white text-red-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                    Download RI Manual
                                </button>
                                <button className="flex-1 bg-red-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-800 transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle className="h-4 w-4" /> Verify Deadlines
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => window.location.href = 'tel:+14697294423'}
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-black transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl"
                            >
                                <PhoneCall className="h-6 w-6" /> REQUEST EXPEDITED REVIEW
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-full bg-white text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 border-2 border-gray-100 transition-all flex items-center justify-center gap-2"
                            >
                                <Share2 className="h-5 w-5" /> Share Assessment
                            </button>
                        </div>
                        
                        {leadId && (
                            <EvidenceUploader 
                                leadId={leadId as string} 
                                uploaderName={formData.name} 
                                uploaderEmail={formData.email} 
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Navigation (Only if not result) */}
            {step < 5 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between gap-4">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 text-gray-500 font-bold hover:text-gray-900 flex items-center gap-2"
                        >
                            <ChevronLeft className="h-5 w-5" /> Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !formData.accidentType) ||
                            (step === 2 && !formData.vehicleStatus) ||
                            (step === 3 && !formData.hasInjury)
                        }
                        className="ml-auto px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        Next <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
