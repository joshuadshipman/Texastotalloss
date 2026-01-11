'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
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
    { id: 2, title: 'Status' },
    { id: 3, title: 'Injury' },
    { id: 4, title: 'Costs' },
    { id: 5, title: 'Contact' },
    { id: 6, title: 'Result' }
];

export default function AccidentCalculator() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [estimate, setEstimate] = useState<{ low: number; high: number } | null>(null);
    const [leadId, setLeadId] = useState<string | number | null>(null);
    const [formData, setFormData] = useState<CalculatorData>({
        accidentType: '',
        vehicleStatus: '',
        hasInjury: '',
        medicalBills: '',
        lostWages: '',
        name: '',
        email: '',
        phone: ''
    });

    const handleNext = () => setStep((prev) => Math.min(prev + 1, STEPS.length));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const calculateEstimate = () => {
        let base = 0;
        const bills = parseFloat(formData.medicalBills) || 0;
        const wages = parseFloat(formData.lostWages) || 0;

        // Injury multiplier based on Texas guidelines
        if (formData.hasInjury === 'Yes') {
            const multiplier = formData.accidentType === 'truck' ? 2.5 : 1.5;
            base += (bills * multiplier) + wages;
            base += 5000; // Base value for pain & suffering
        }

        // Add property damage estimate (rough)
        if (formData.vehicleStatus === 'total_loss') {
            base += 8000; // Average TX total loss
        } else if (formData.vehicleStatus === 'repairable') {
            base += 3000;
        }

        return {
            low: Math.round(base * 0.85),
            high: Math.round(base * 1.25)
        };
    };

    const handleSubmit = async () => {
        setLoading(true);
        const result = calculateEstimate();
        setEstimate(result);

        try {
            const { data, error } = await supabaseClient.from('leads').insert([{
                type: 'calculator',
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                status: 'new',
                user_data: {
                    ...formData,
                    estimated_value: result,
                    source: 'accident_calculator'
                }
            }]).select();

            if (error) console.error('Supabase Error:', error);

            if (data && data[0]) {
                setLeadId(data[0].id);
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

                {/* Step 2: Vehicle Status */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicle Status</h2>
                            <p className="text-gray-500 mt-2">How would you describe your vehicle's condition?</p>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Loss', desc: 'Vehicle is not drivable or repairable', value: 'total_loss', emoji: '🚗💥' },
                                { label: 'Repairable', desc: 'Drivable with damage', value: 'repairable', emoji: '🔧' },
                                { label: 'Diminished Value', desc: 'Repaired but worth less now', value: 'dv', emoji: '📉' }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setFormData({ ...formData, vehicleStatus: opt.value }); handleNext(); }}
                                    className="w-full p-5 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{opt.emoji}</span>
                                        <div>
                                            <span className="block text-lg font-semibold text-gray-800">{opt.label}</span>
                                            <span className="text-sm text-gray-500">{opt.desc}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
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
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="relative">
                            <div className="h-24 w-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                                <CheckCircle className="h-12 w-12 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 left-0 flex justify-center">
                                <span className="relative flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                                </span>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900">Your Estimated Value</h2>

                        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-3xl border border-blue-100 shadow-inner">
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-3">Potential Settlement Range</p>
                            <p className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-3">*Based on Texas liability guidelines. Not legal advice.</p>
                        </div>

                        <div className="space-y-3 pt-4">
                            <a
                                href="tel:1-800-555-0199"
                                className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 transform hover:-translate-y-1 transition-all"
                            >
                                <PhoneCall className="h-6 w-6" />
                                <span>Call for Free Review</span>
                            </a>

                            <button
                                onClick={handleShare}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-700 rounded-xl font-semibold transition-all"
                            >
                                <Share2 className="h-5 w-5" />
                                <span>Share Result</span>
                            </button>

                            {leadId && (
                                <EvidenceUploader
                                    leadId={leadId}
                                    uploaderName={formData.name}
                                    uploaderEmail={formData.email}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            {step > 1 && step < 6 && (
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                    <button onClick={handleBack} className="text-gray-500 font-medium hover:text-gray-900 flex items-center transition-colors">
                        <ChevronLeft className="h-5 w-5 mr-1" /> Back
                    </button>
                </div>
            )}
        </div>
    );
}
