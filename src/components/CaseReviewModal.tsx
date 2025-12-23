'use client';

import React, { useState } from 'react';
import { useChat } from './ChatContext';
import { XIcon, CheckCircleIcon, AlertTriangleIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Dictionary } from '@/dictionaries/en';

interface CaseReviewModalProps {
    dict?: Dictionary | null;
    lang?: string;
}

export default function CaseReviewModal({ dict, lang }: CaseReviewModalProps) {
    const { isReviewOpen, closeReview } = useChat();
    const [step, setStep] = useState(1);

    if (!isReviewOpen) return null;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        // 1. Contact
        fullName: '',
        phone: '',
        permissionText: false,
        email: '',
        contactMethod: 'text',
        language: lang === 'es' ? 'Spanish' : 'English',
        bestTime: '',
        // 2. Accident
        dateOfAccident: '',
        cityState: 'Texas',
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
        // 7. Internal Flags
        leadSource: 'AI_Case_Review_Web',
        severityFlag: false,
        liabilityFlag: 'clear',
        uploadedFiles: [] as string[]
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic UI update
        const fileName = file.name;
        setFormData(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, `(Uploading) ${fileName}`] }));

        try {
            const storagePath = `case-review/${Date.now()}-${fileName}`;
            const { error } = await supabaseClient.storage
                .from('vehicle-photos') // Reusing existing bucket
                .upload(storagePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabaseClient.storage
                .from('vehicle-photos')
                .getPublicUrl(storagePath);

            // Update with actual link or just mark complete
            setFormData(prev => ({
                ...prev,
                uploadedFiles: prev.uploadedFiles.map(f => f.includes(fileName) ? `[LINK] ${publicUrl}` : f)
            }));

        } catch (error) {
            console.error('Upload failed', error);
            setFormData(prev => ({
                ...prev,
                uploadedFiles: prev.uploadedFiles.map(f => f.includes(fileName) ? `(Failed) ${fileName}` : f)
            }));
        }
    };

    if (!isReviewOpen) return null;
    if (!dict) return null; // Wait for dict

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
        let s = 10;
        if (formData.faultBelief === 'other_driver') s += 40;
        else if (formData.faultBelief === 'shared') s += 10;
        else if (formData.faultBelief === 'me') s -= 50;

        if (formData.isInjured === 'yes') s += 30;
        if (formData.painLevel >= 6) s += 10;
        if (formData.otherInsurance === 'yes') s += 10;

        if (formData.hiredLawyer === 'yes' && formData.changeLawyer === 'no') s = 0;
        if (s > 95) s = 95;
        if (s < 0) s = 0;
        return s;
    };

    const submitReview = async () => {
        setIsSubmitting(true);
        const finalScore = calculateScore();
        setScore(finalScore);

        // Keeping Admin Report in English for consistency, or we could localize it too.
        // For now, English is safer for the backend team.
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

🏥 INJURY (Pain: ${formData.painLevel}/10):
Injured: ${formData.isInjured} | Parts: ${formData.bodyParts.join(', ')}
Treatment: ${formData.treatmentStatus} | Need Doc: ${formData.needDoctor}

📂 DOCUMENTS:
${formData.uploadedFiles.length > 0 ? formData.uploadedFiles.join('\n') : 'None Uploaded'}

⚠️ FLAGS:
Represented: ${formData.hiredLawyer}
Missed Work: ${formData.missedWork}
Prior Claims: ${formData.priorClaims}
Concerns: ${formData.biggestConcern.join(', ')}
===========================
        `.trim();

        try {
            // 1. Submit Structured Lead
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: `review-${Date.now()}`,
                    full_name: formData.fullName,
                    phone: formData.phone,
                    contact_pref: formData.contactMethod,
                    best_time: formData.bestTime,
                    incident_details: `Type: ${formData.incidentType}. Vehicle: ${formData.vehicle}`,
                    role: formData.role,
                    has_injury: formData.isInjured === 'yes',
                    // New Fields
                    language: 'en', // TODO: pass from prop or infer? defaulting en for now, or use formData.language if exists
                    score: finalScore,
                    pain_level: formData.painLevel,
                    accident_date: formData.dateOfAccident,
                    city: formData.cityState,
                    injury_summary: formData.bodyParts.join(', '),
                    liability_summary: formData.faultBelief,
                    files_count: formData.uploadedFiles.length
                })
            });

            // 2. Add Chat Log (Optional, for continuity)
            const sessionId = `review-${Date.now()}`; // This might duplicate session IDs if we aren't careful. 
            // Ideally use same ID. For now let's just log.
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
        setStep(8);
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const renderStep = () => {
        const d = dict.caseReview; // Shortcut
        const o = dict.caseReview.options;

        switch (step) {
            case 1: // Contact
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.contact.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="fullName" placeholder={d.steps.contact.name} value={formData.fullName} onChange={handleChange} className="p-3 border rounded w-full" />
                            <input name="phone" placeholder={d.steps.contact.phone} value={formData.phone} onChange={handleChange} className="p-3 border rounded w-full" />
                            <input name="email" placeholder={d.steps.contact.email} value={formData.email} onChange={handleChange} className="p-3 border rounded w-full" />
                            <select name="contactMethod" value={formData.contactMethod} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="text">{o.text}</option>
                                <option value="call">{o.call}</option>
                                <option value="email">{o.email}</option>
                            </select>
                            <input name="bestTime" placeholder={d.steps.contact.time} value={formData.bestTime} onChange={handleChange} className="p-3 border rounded w-full" />
                            <select name="language" value={formData.language} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="English">English</option>
                                <option value="Spanish">Español</option>
                            </select>
                            <label className="flex items-center gap-2 md:col-span-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <input type="checkbox" name="permissionText" checked={formData.permissionText} onChange={handleChange} />
                                {d.steps.contact.permission}
                            </label>
                        </div>
                    </div>
                );
            case 2: // Accident
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.accident.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold">{d.steps.accident.date}</label><input type="date" name="dateOfAccident" value={formData.dateOfAccident} onChange={handleChange} className="p-3 border rounded w-full" /></div>
                            <div><label className="text-xs font-bold">{d.steps.accident.location}</label><input name="cityState" value={formData.cityState} onChange={handleChange} placeholder="e.g. Houston, TX" className="p-3 border rounded w-full" /></div>
                            <select name="incidentType" value={formData.incidentType} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="auto_auto">Car vs Car</option>
                                <option value="auto_truck">Car vs Truck/Commercial</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="pedestrian">Pedestrian</option>
                                <option value="other">Other</option>
                            </select>
                            <select name="role" value={formData.role} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                <option value="driver">{d.options.driver}</option>
                                <option value="passenger">{d.options.passenger}</option>
                                <option value="pedestrian">{d.options.pedestrian}</option>
                            </select>
                            <input name="vehicle" placeholder={d.steps.accident.vehicle} value={formData.vehicle} onChange={handleChange} className="p-3 border rounded w-full md:col-span-2" />
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <label className="text-sm">{d.steps.accident.police} <select name="policeReport" value={formData.policeReport} onChange={handleChange} className="border p-1 rounded ml-2"><option value="yes">{o.yes}</option><option value="no">{o.no}</option><option value="unsure">{o.unsure}</option></select></label>
                                <label className="text-sm">{d.steps.accident.tickets} <select name="tickets" value={formData.tickets} onChange={handleChange} className="border p-1 rounded ml-2"><option value="yes">{o.yes}</option><option value="no">{o.no}</option><option value="unsure">{o.unsure}</option></select></label>
                            </div>
                        </div>
                    </div>
                );
            case 3: // Fault
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.fault.title}</h3>
                        <div className="space-y-3">
                            <div><label className="block text-sm font-bold">{d.steps.fault.who_fault}</label>
                                <select name="faultBelief" value={formData.faultBelief} onChange={handleChange} className="p-3 border rounded w-full bg-white">
                                    <option value="other_driver">Other Driver</option>
                                    <option value="me">Me</option>
                                    <option value="shared">Shared / Unsure</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="text-sm block">{d.steps.fault.admit} <select name="admitFault" value={formData.admitFault} onChange={handleChange} className="border p-1 w-full rounded mt-1"><option value="yes">{o.yes}</option><option value="no">{o.no}</option><option value="unsure">{o.unsure}</option></select></label>
                                <label className="text-sm block">{d.steps.fault.insured} <select name="otherInsurance" value={formData.otherInsurance} onChange={handleChange} className="border p-1 w-full rounded mt-1"><option value="yes">{o.yes}</option><option value="no">{o.no}</option><option value="unsure">{o.unsure}</option></select></label>
                            </div>
                            <input name="myInsurance" placeholder={d.steps.fault.my_insurance} value={formData.myInsurance} onChange={handleChange} className="p-3 border rounded w-full" />
                            <div className="p-3 bg-yellow-50 text-sm text-yellow-800 rounded">
                                {d.steps.fault.recorded}
                                <select name="recordedStatement" value={formData.recordedStatement} onChange={handleChange} className="ml-2 border p-1 rounded bg-white"><option value="no">{o.no}</option><option value="yes">{o.yes}</option><option value="unsure">{o.unsure}</option></select>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Injury
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.injury.title}</h3>
                        <div>
                            <label className="block text-sm font-bold mb-2">{d.steps.injury.were_injured}</label>
                            <select name="isInjured" value={formData.isInjured} onChange={handleChange} className="p-3 border rounded w-full bg-white mb-4">
                                <option value="yes">{o.yes}</option>
                                <option value="no">{o.no}</option>
                                <option value="unsure">{o.unsure}</option>
                            </select>
                        </div>
                        {formData.isInjured !== 'no' && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold mb-2">{d.steps.injury.pain_level}: {formData.painLevel}</label>
                                    <input type="range" min="0" max="10" name="painLevel" value={formData.painLevel} onChange={handleChange} className="w-full accent-red-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">{d.steps.injury.parts}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['Neck', 'Back', 'Head', 'Shoulder', 'Knee', 'Arm', 'Leg'].map(part => (
                                            <button
                                                key={part}
                                                onClick={() => toggleArrayItem('bodyParts', part)}
                                                className={`px - 3 py - 1 rounded - full text - sm border ${formData.bodyParts.includes(part) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                            >
                                                {part}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold block mb-1">{d.steps.injury.treatment}</label>
                                        <select name="treatmentStatus" value={formData.treatmentStatus} onChange={handleChange} className="p-2 border rounded w-full bg-white text-sm">
                                            <option value="none_yet">None Yet</option>
                                            <option value="er">ER / Hospital</option>
                                            <option value="urgent_care">Urgent Care</option>
                                            <option value="chiro">Chiropractor</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold block mb-1">{d.steps.injury.need_doc}</label>
                                        <select name="needDoctor" value={formData.needDoctor} onChange={handleChange} className="p-2 border rounded w-full bg-white text-sm">
                                            <option value="yes">{o.yes}</option>
                                            <option value="no">{o.no}</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 5: // Legal
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.legal.title}</h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 bg-white">
                                <span className="font-medium">{d.steps.legal.hired}</span>
                                <select name="hiredLawyer" value={formData.hiredLawyer} onChange={handleChange} className="border p-2 rounded"><option value="no">{o.no}</option><option value="yes">{o.yes}</option></select>
                            </label>
                            {formData.hiredLawyer === 'yes' && (
                                <label className="flex items-center justify-between p-3 border rounded bg-yellow-50">
                                    <span className="font-medium text-sm">{d.steps.legal.change}</span>
                                    <select name="changeLawyer" value={formData.changeLawyer} onChange={handleChange} className="border p-2 rounded"><option value="no">{o.no}</option><option value="yes">{o.yes}</option></select>
                                </label>
                            )}
                            <label className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 bg-white">
                                <span className="font-medium">{d.steps.legal.prior}</span>
                                <select name="priorClaims" value={formData.priorClaims} onChange={handleChange} className="border p-2 rounded"><option value="no">{o.no}</option><option value="yes">{o.yes}</option></select>
                            </label>
                        </div>
                    </div>
                );
            case 6: // Impact
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.impact.title}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block p-3 border rounded bg-white">
                                    <span className="block text-sm font-bold mb-2">{d.steps.impact.working}</span>
                                    <select name="wasWorking" value={formData.wasWorking} onChange={handleChange} className="w-full p-2 border rounded"><option value="no">{o.no}</option><option value="yes">{o.yes}</option></select>
                                </label>
                                <label className="block p-3 border rounded bg-white">
                                    <span className="block text-sm font-bold mb-2">{d.steps.impact.missed}</span>
                                    <select name="missedWork" value={formData.missedWork} onChange={handleChange} className="w-full p-2 border rounded"><option value="no">{o.no}</option><option value="yes">{o.yes}</option></select>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2">{d.steps.impact.concerns}</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'Pain/Health', label: d.concerns.pain },
                                        { key: 'Medical Bills', label: d.concerns.bills },
                                        { key: 'Lost Income', label: d.concerns.income },
                                        { key: 'Car Repair', label: d.concerns.repair },
                                        { key: 'Insurance Calls', label: d.concerns.calls }
                                    ].map(c => (
                                        <button
                                            key={c.key}
                                            onClick={() => toggleArrayItem('biggestConcern', c.key)}
                                            className={`px - 3 py - 1 rounded - full text - sm border ${formData.biggestConcern.includes(c.key) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'}`}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 7: // Documents
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-blue-900 border-b pb-2">{d.steps.docs.title}</h3>
                        <p className="text-sm text-gray-600">{d.steps.docs.desc}</p>
                        <ul className="text-sm text-gray-500 list-disc ml-5 space-y-1">
                            {d.steps.docs.list.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>

                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <p className="font-bold text-blue-700">{d.steps.docs.cta}</p>
                            <p className="text-xs text-blue-400">{d.upload.secure}</p>
                        </div>

                        {formData.uploadedFiles.length > 0 && (
                            <div className="bg-white p-4 rounded border">
                                <h4 className="font-bold text-xs mb-2">{d.upload.attached}</h4>
                                {formData.uploadedFiles.map((f, i) => (
                                    <div key={i} className="text-xs text-gray-600 truncate">📄 {f}</div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 8: // Success / Score
                return (
                    <div className="text-center animate-fade-in py-8">
                        {score !== null && score > 70 ? (
                            <>
                                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{d.steps.result.high_chance}</h3>
                                <div className="text-5xl font-black text-green-600 mb-6">{score}% {d.steps.result.match}</div>
                                <button onClick={() => window.open('tel:1-800-555-0199')} className="bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg text-xl hover:scale-105 transition">{d.steps.result.call_btn}</button>
                            </>
                        ) : (
                            <>
                                <AlertTriangleIcon className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{d.steps.result.review_needed}</h3>
                                <div className="text-5xl font-black text-yellow-600 mb-6">{score || 50}% {d.steps.result.match}</div>
                                <p className="text-gray-500 mb-4">A representative will call you at <strong>{formData.phone}</strong> shortly.</p>
                            </>
                        )}
                        <button onClick={closeReview} className="block mt-8 text-gray-400 mx-auto hover:underline">{d.steps.result.close_btn}</button>
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
                            <h2 className="font-bold text-lg">{dict.caseReview.banner.title}</h2>
                            <p className="text-xs text-blue-200">{dict.caseReview.banner.subtitle}</p>
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

                        {step < 7 ? (
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
