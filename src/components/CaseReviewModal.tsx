'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';
import { XIcon, CheckCircleIcon, AlertTriangleIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

export default function CaseReviewModal() {
    const { isReviewOpen, closeReview } = useChat();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        // 1. Contact
        fullName: '',
        phone: '',
        permissionText: false,
        email: '',
        contactMethod: 'text',
        language: 'English',
        bestTime: '',
        // 2. Accident
        dateOfAccident: '',
        cityState: 'Texas', // default
        incidentType: 'auto_auto',
        role: 'driver',
        vehicle: '',
        policeReport: 'unsure',
        tickets: 'unsure',
        // 3. Fault
        faultBelief: 'other_driver',
        admitFault: 'unsure',
        otherInsurance: 'yes',
        myInsurance: '',
        spokenToInsurance: 'no',
        recordedStatement: 'no',
        // 4. Injury
        isInjured: 'yes',
        bodyParts: [] as string[],
        painLevel: 5,
        anxietyLevel: 5,
        treatmentStatus: 'none_yet',
        firstTreatmentDate: '',
        symptomProgression: 'same',
        needDoctor: 'yes',
        // 5. Prior Rep
        hiredLawyer: 'no',
        changeLawyer: 'no',
        priorClaims: 'no',
        // 6. Work
        wasWorking: 'no',
        missedWork: 'no',
        missedDays: '',
        biggestConcern: [] as string[],
        // 7. Internal Flags (Calculated)
        leadSource: 'AI_Case_Review_Web',
        severityFlag: false,
        liabilityFlag: 'clear',
    });

    if (!isReviewOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleArrayItem = (field: 'bodyParts' | 'biggestConcern', value: string) => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(value)) return { ...prev, [field]: list.filter(i => i !== value) };
            return { ...prev, [field]: [...list, value] };
        });
    };

    const calculateScore = () => {
        let s = 10; // Base chance
        // Fault
        if (formData.faultBelief === 'other_driver') s += 40;
        else if (formData.faultBelief === 'shared') s += 10;
        else if (formData.faultBelief === 'me') s -= 50;

        // Injury
        if (formData.isInjured === 'yes') s += 30;
        if (formData.painLevel >= 6) s += 10;

        // Coverage
        if (formData.otherInsurance === 'yes') s += 10;

        // Red Flags
        if (formData.hiredLawyer === 'yes' && formData.changeLawyer === 'no') s = 0; // Already represented
        if (s > 95) s = 95;
        if (s < 0) s = 0;
        return s;
    };

    const submitReview = async () => {
        setIsSubmitting(true);
        const finalScore = calculateScore();
        setScore(finalScore);

        // Format for Admin
        const formattedReport = `
🤖 AI CASE REVIEW REPORT 🤖
===========================
SCORE: ${finalScore}% Acceptance Probability

👤 CONTACT:
${formData.fullName} | ${formData.phone} | ${formData.email}
Pref: ${formData.contactMethod} (${formData.language}) | Time: ${formData.bestTime}
Perm to Text: ${formData.permissionText ? 'YES' : 'NO'}

🚗 ACCIDENT:
Date: ${formData.dateOfAccident} in ${formData.cityState}
Type: ${formData.incidentType} | Role: ${formData.role}
Vehicle: ${formData.vehicle}
Police Rpt: ${formData.policeReport} | Tickets: ${formData.tickets}

⚖️ LIABILITY:
Fault: ${formData.faultBelief} | Admitted: ${formData.admitFault}
Other Ins: ${formData.otherInsurance} | My Ins: ${formData.myInsurance}
Recorded Stmt: ${formData.recordedStatement}

ea INJURY (Pain: ${formData.painLevel}/10):
Injured: ${formData.isInjured} | Parts: ${formData.bodyParts.join(', ')}
Treatment: ${formData.treatmentStatus} | Need Doc: ${formData.needDoctor}

⚠️ FLAGS:
Represented: ${formData.hiredLawyer}
Missed Work: ${formData.missedWork}
Prior Claims: ${formData.priorClaims}
Concerns: ${formData.biggestConcern.join(', ')}
===========================
        `.trim();

        try {
            const sessionId = `review-${Date.now()}`;
            await supabaseClient.from('chat_messages').insert({
                session_id: sessionId,
                sender: 'system',
                text: formattedReport,
                is_read: false
            });
        } catch (e) {
            console.error(e);
        }
        setIsSubmitting(false);
        setStep(8); // Success Screen
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const renderStep = () => {
        switch (step) {
            case 1: // Contact
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">1. Your Contact Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="p-3 border rounded w-full" />
                            <input name="phone" placeholder="Mobile Phone" value={formData.phone} onChange={handleChange} className="p-3 border rounded w-full" />
                            <input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="p-3 border rounded w-full" />
                            <select name="contactMethod" value={formData.contactMethod} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="text">Prefer Text</option>
                                <option value="call">Prefer Call</option>
                                <option value="email">Prefer Email</option>
                            </select>
                            <input name="bestTime" placeholder="Best time to contact?" value={formData.bestTime} onChange={handleChange} className="p-3 border rounded w-full" />
                            <select name="language" value={formData.language} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="English">English</option>
                                <option value="Spanish">Español</option>
                            </select>
                            <label className="flex items-center gap-2 md:col-span-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <input type="checkbox" name="permissionText" checked={formData.permissionText} onChange={handleChange} />
                                I give permission to receive text messages about my case review.
                            </label>
                        </div>
                    </div>
                );
            case 2: // Accident
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">2. Accident Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold">Date</label><input type="date" name="dateOfAccident" value={formData.dateOfAccident} onChange={handleChange} className="p-3 border rounded w-full" /></div>
                            <div><label className="text-xs font-bold">Location (City, TX)</label><input name="cityState" value={formData.cityState} onChange={handleChange} placeholder="e.g. Houston, TX" className="p-3 border rounded w-full" /></div>
                            <select name="incidentType" value={formData.incidentType} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="auto_auto">Car vs Car</option>
                                <option value="auto_truck">Car vs Truck/Commercial</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="pedestrian">Pedestrian</option>
                                <option value="other">Other</option>
                            </select>
                            <select name="role" value={formData.role} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="driver">I was the Driver</option>
                                <option value="passenger">I was a Passenger</option>
                                <option value="pedestrian">I was a Pedestrian</option>
                            </select>
                            <input name="vehicle" placeholder="Your Vehicle (Year/Make/Model)" value={formData.vehicle} onChange={handleChange} className="p-3 border rounded w-full md:col-span-2" />
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <label className="text-sm">Police Report? <select name="policeReport" value={formData.policeReport} onChange={handleChange} className="border p-1 rounded ml-2"><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Unsure</option></select></label>
                                <label className="text-sm">Tickets Issued? <select name="tickets" value={formData.tickets} onChange={handleChange} className="border p-1 rounded ml-2"><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Unsure</option></select></label>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Fault
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">3. Liability Check</h3>
                        <div className="space-y-3">
                            <div><label className="block text-sm font-bold">Who was at fault?</label>
                                <select name="faultBelief" value={formData.faultBelief} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                    <option value="other_driver">Other Driver (Clearly)</option>
                                    <option value="me">Me (My Fault)</option>
                                    <option value="shared">Shared / Unsure</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="text-sm block">Did they admit fault? <select name="admitFault" value={formData.admitFault} onChange={handleChange} className="border p-1 w-full rounded mt-1"><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Unsure</option></select></label>
                                <label className="text-sm block">Other Driver Insured? <select name="otherInsurance" value={formData.otherInsurance} onChange={handleChange} className="border p-1 w-full rounded mt-1"><option value="yes">Yes</option><option value="no">No</option><option value="unsure">Unsure</option></select></label>
                            </div>
                            <input name="myInsurance" placeholder="Your Insurance Company" value={formData.myInsurance} onChange={handleChange} className="p-3 border rounded w-full" />
                            <div className="p-3 bg-yellow-50 text-sm text-yellow-800 rounded">
                                Did you give a recorded statement?
                                <select name="recordedStatement" value={formData.recordedStatement} onChange={handleChange} className="ml-2 border p-1 rounded bg-white"><option value="no">No</option><option value="yes">Yes</option><option value="unsure">Unsure</option></select>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Injury
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">4. Injury Assessment</h3>
                        <div>
                            <label className="block text-sm font-bold mb-2">Were you injured?</label>
                            <select name="isInjured" value={formData.isInjured} onChange={handleChange} className="p-3 border rounded w-full bg-white mb-4">
                                <option value="yes">Yes, I was hurt</option>
                                <option value="no">No, I am fine</option>
                                <option value="unsure">Not sure / Pain started later</option>
                            </select>
                        </div>
                        {formData.isInjured !== 'no' && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Pain Level (0-10): {formData.painLevel}</label>
                                    <input type="range" min="0" max="10" name="painLevel" value={formData.painLevel} onChange={handleChange} className="w-full accent-red-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Where do you hurt? (Select all)</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Neck', 'Back', 'Head', 'Shoulder', 'Knee', 'Arm', 'Leg'].map(part => (
                                            <button
                                                key={part}
                                                onClick={() => toggleArrayItem('bodyParts', part)}
                                                className={`px-3 py-1 rounded-full text-sm border ${formData.bodyParts.includes(part) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                            >
                                                {part}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold block mb-1">Treatment So Far</label>
                                        <select name="treatmentStatus" value={formData.treatmentStatus} onChange={handleChange} className="p-2 border rounded w-full bg-white text-sm">
                                            <option value="none_yet">None Yet</option>
                                            <option value="er">ER / Hospital</option>
                                            <option value="urgent_care">Urgent Care</option>
                                            <option value="chiro">Chiropractor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold block mb-1">Need help finding a Dr?</label>
                                        <select name="needDoctor" value={formData.needDoctor} onChange={handleChange} className="p-2 border rounded w-full bg-white text-sm">
                                            <option value="yes">Yes, please</option>
                                            <option value="no">No, I have one</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 5: // Prior Rep
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">5. Legal Status</h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 bg-white">
                                <span className="font-medium">Have you already hired a lawyer for THIS accident?</span>
                                <select name="hiredLawyer" value={formData.hiredLawyer} onChange={handleChange} className="border p-2 rounded"><option value="no">No</option><option value="yes">Yes</option></select>
                            </label>
                            {formData.hiredLawyer === 'yes' && (
                                <label className="flex items-center justify-between p-3 border rounded bg-yellow-50">
                                    <span className="font-medium text-sm">Are you looking to change lawyers?</span>
                                    <select name="changeLawyer" value={formData.changeLawyer} onChange={handleChange} className="border p-2 rounded"><option value="no">No</option><option value="yes">Yes</option></select>
                                </label>
                            )}
                            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 bg-white">
                                <span className="font-medium">Any other injury claims in last 5 years?</span>
                                <select name="priorClaims" value={formData.priorClaims} onChange={handleChange} className="border p-2 rounded"><option value="no">No</option><option value="yes">Yes</option></select>
                            </label>
                        </div>
                    </div>
                );
            case 6: // Work & Impact
            case 7: // Review (Combined for brevity or split if needed. Doing split to follow user structure)
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">6. Impact & Work</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block p-3 border rounded bg-white">
                                    <span className="block text-sm font-bold mb-2">Were you working?</span>
                                    <select name="wasWorking" value={formData.wasWorking} onChange={handleChange} className="w-full p-2 border rounded"><option value="no">No</option><option value="yes">Yes</option></select>
                                </label>
                                <label className="block p-3 border rounded bg-white">
                                    <span className="block text-sm font-bold mb-2">Missed Work?</span>
                                    <select name="missedWork" value={formData.missedWork} onChange={handleChange} className="w-full p-2 border rounded"><option value="no">No</option><option value="yes">Yes</option></select>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">Biggest Concerns (Select all)</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Pain/Health', 'Medical Bills', 'Lost Income', 'Car Repair', 'Insurance Calls'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => toggleArrayItem('biggestConcern', c)}
                                            className={`px-3 py-1 rounded-full text-sm border ${formData.biggestConcern.includes(c) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 text-sm text-gray-600 rounded">
                                <p>By clicking "Get AI Analysis", I agree to the <a href="#" className="underline">Terms</a> and understand this is an automated preliminary review.</p>
                            </div>
                        </div>
                    </div>
                );
            case 8: // Success / Score
                return (
                    <div className="text-center animate-fade-in py-8">
                        {score !== null && score > 70 ? (
                            <>
                                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">HIGH ACCEPTANCE CHANCE</h3>
                                <div className="text-5xl font-black text-green-600 mb-6">{score}% Match</div>
                                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">Based on your answers (Liability: Clear, Injury: Present), this case matches our firm's criteria appropriately.</p>
                                <button onClick={() => window.open('tel:1-800-555-0199')} className="bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg text-xl hover:scale-105 transition">Call Attorney Now</button>
                            </>
                        ) : (
                            <>
                                <AlertTriangleIcon className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Review Recommended</h3>
                                <div className="text-5xl font-black text-yellow-600 mb-6">{score || 50}% Match</div>
                                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">There are some complexities in your answers that require a human review. We have sent your report to a specialist.</p>
                                <p className="text-gray-500 mb-4">A representative will call you at <strong>{formData.phone}</strong> shortly.</p>
                            </>
                        )}
                        <button onClick={closeReview} className="block mt-8 text-gray-400 mx-auto hover:underline">Close</button>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-500/20 p-2 rounded-full"><span className="animate-pulse">⚡</span></span>
                        <div>
                            <h2 className="font-bold text-lg">Instant AI Case Evaluator</h2>
                            <p className="text-xs text-blue-200">Analyzing Texas Regulations & Liability Rules</p>
                        </div>
                    </div>
                    <button onClick={closeReview} className="p-2 hover:bg-blue-800 rounded"><XIcon size={20} /></button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {renderStep()}
                </div>

                {/* Footer */}
                {step < 8 && (
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                        {step > 1 ? (
                            <button onClick={prevStep} className="flex items-center gap-1 text-gray-600 font-medium hover:text-gray-900 px-4 py-2">
                                <ChevronLeftIcon size={16} /> Back
                            </button>
                        ) : <div></div>}

                        {step < 6 ? (
                            <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow flex items-center gap-2">
                                Next <ChevronRightIcon size={16} />
                            </button>
                        ) : (
                            <button onClick={submitReview} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow flex items-center gap-2">
                                {isSubmitting ? 'Analyzing...' : 'Get AI Result'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
