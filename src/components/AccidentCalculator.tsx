'use client';

import { useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { ChevronElement, ChevronLeft, ChevronRight, Car, AlertTriangle, DollarSign, CheckCircle, Calculator, PhoneCall } from 'lucide-react';
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

const STEPS = [
    { id: 1, title: 'Accident Type', icon: Car },
    { id: 2, title: 'Vehicle Status', icon: AlertTriangle },
    { id: 3, title: 'Injury Check', icon: Calculator },
    { id: 4, title: 'Financials', icon: DollarSign },
    { id: 5, title: 'Contact Info', icon: CheckCircle },
    { id: 6, title: 'Your Estimate', icon: CheckCircle }
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

        if (formData.hasInjury === 'Yes') {
            base += (bills * 1.5) + wages;
            base += 5000;
        } else {
            base += 0;
        }

        return {
            low: Math.round(base * 0.8),
            high: Math.round(base * 1.2)
        };
    };

    const handleSubmit = async () => {
        setLoading(true);
        const result = calculateEstimate();
        setEstimate(result);

        try {
            // Save to Supabase 'leads' table
            const { data, error } = await supabaseClient.from('leads').insert([{
                type: 'calculator',
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                status: 'new',
                user_data: {
                    ...formData,
                    estimated_value: result
                }
            }]).select(); // Important: Select to get the ID back

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

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
            {/* Progress Bar */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex space-x-2">
                    {STEPS.map((s) => (
                        <div
                            key={s.id}
                            className={`h-2 w-8 rounded-full transition-all duration-300 ${s.id <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
                <span className="text-sm font-medium text-gray-500">Step {step} of {STEPS.length}</span>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">What type of accident happened?</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {['Car Accident', 'Truck Accident', 'Motorcycle', 'Hail Damage', 'T-Bone', 'Rear-End'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => { setFormData({ ...formData, accidentType: type }); handleNext(); }}
                                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">What represents your vehicle status?</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { label: 'Total Loss (Not Drivable)', value: 'total_loss' },
                                { label: 'Drivable but Damaged', value: 'repairable' },
                                { label: 'Diminished Value Claim', value: 'dv' }
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { setFormData({ ...formData, vehicleStatus: opt.value }); handleNext(); }}
                                    className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all flex items-center justify-between group"
                                >
                                    <span className="text-lg font-medium text-gray-700">{opt.label}</span>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-600" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Were you or anyone injured?</h2>
                        <p className="text-gray-500">Even minor soreness counts as an injury requiring checking.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => { setFormData({ ...formData, hasInjury: 'Yes' }); handleNext(); }} className="p-6 border-2 border-gray-100 rounded-xl hover:border-red-600 hover:bg-red-50 text-xl font-bold text-gray-800">
                                Yes
                            </button>
                            <button onClick={() => { setFormData({ ...formData, hasInjury: 'No' }); handleNext(); }} className="p-6 border-2 border-gray-100 rounded-xl hover:border-green-600 hover:bg-green-50 text-xl font-bold text-gray-800">
                                No
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Estimated Financial Impact</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Bills (Approx)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                        onChange={(e) => setFormData({ ...formData, medicalBills: e.target.value })}
                                        value={formData.medicalBills}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lost Wages (Approx)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                        onChange={(e) => setFormData({ ...formData, lostWages: e.target.value })}
                                        value={formData.lostWages}
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors">
                            Next Step
                        </button>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Where should we send your estimate?</h2>
                        <div className="space-y-4">
                            <input
                                type="text" placeholder="Full Name" className="w-full p-4 rounded-lg border border-gray-300"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="email" placeholder="Email Address" className="w-full p-4 rounded-lg border border-gray-300"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <input
                                type="tel" placeholder="Phone Number" className="w-full p-4 rounded-lg border border-gray-300"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.email}
                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg flex justify-center items-center space-x-2"
                        >
                            {loading ? <span>Calculating...</span> : <span>Get My Estimate</span>}
                        </button>
                    </div>
                )}

                {step === 6 && estimate && (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calculator className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Estimated Claim Value</h2>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">Potential Settlement Range</p>
                            <p className="text-4xl font-extrabold text-blue-700">
                                ${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">*Preliminary estimate based on provided details.</p>
                        </div>

                        <div className="space-y-3">
                            <p className="font-medium text-gray-700">Recommended Next Steps</p>

                            <a href="tel:1-800-555-0199" className="block w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2">
                                <PhoneCall className="h-5 w-5" />
                                <span>Call for Free Case Review</span>
                            </a>

                            {/* Evidence Uploader linked to the Lead ID */}
                            {leadId && <EvidenceUploader leadId={leadId} />}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            {step < 5 && step > 1 && (
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
                    <button onClick={handleBack} className="text-gray-500 font-medium hover:text-gray-900 flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </button>
                </div>
            )}
        </div>
    );
}
