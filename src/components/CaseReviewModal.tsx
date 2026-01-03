
"use client";

import React, { useState, ChangeEvent } from 'react';
import { useChat } from './ChatContext';
import { XIcon, CheckCircleIcon, AlertTriangleIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { Dictionary } from '@/dictionaries/en';

interface CaseReviewModalProps {
    dict?: Dictionary | null;
    lang?: string;
}

export default function CaseReviewModal({ dict, lang }: CaseReviewModalProps) {
    const { isReviewOpen, closeReview, openChat } = useChat();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState<{ score: number, severity: string } | null>(null);

    // Dictionary mappings (Safe Access)
    const d: any = dict?.caseReview;
    const o = d?.options;
    const incidentTypes = d?.incident_type_options;
    const bodyParts = d?.body_parts;
    const treatments = d?.treatment_options;
    const faultOpts = d?.fault_options;
    const ui = d?.ui;

    // Default to English if dict is missing to prevent crash
    if (!d || !o) {
        console.warn('[CaseReviewModal] Missing d or o', { d: !!d, o: !!o });
        return null;
    }

    const [formData, setFormData] = useState({
        // 1. Accident (Now First)
        dateOfAccident: '',
        cityState: '',
        incidentType: 'auto_auto',
        collisionType: 'rear_end',
        role: 'driver',
        vehicle: '',
        policeReport: 'unsure',
        tickets: 'unsure',
        // 2. Injury
        isInjured: 'yes',
        bodyParts: [] as string[],
        painLevel: 5,
        treatmentStatus: 'none_yet',
        needDoctor: 'yes',
        // 3. Fault
        faultBelief: 'other_driver',
        admitFault: 'unsure',
        otherInsurance: 'yes',
        myInsurance: '',
        recordedStatement: 'no',
        // 4. Impact / Legal
        hiredLawyer: 'no',
        changeLawyer: 'no',
        priorClaims: 'no',
        missedWork: 'no',
        wasWorking: 'no',
        biggestConcern: [] as string[],
        // 5. Contact (Now Last)
        fullName: '',
        phone: '',
        email: '',
        contactMethod: 'text',
        language: lang === 'es' ? 'Spanish' : 'English',
        bestTime: '',
        permissionText: false,
        // Flags
        uploadedFiles: [] as string[]
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
            if (list.includes(value)) {
                return { ...prev, [field]: list.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...list, value] };
            }
        });
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            setFormData(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, fileName] }));
            // Start upload simulation or logic here
        }
    };

    const calculateScore = () => {
        let s = 10;
        let severity = 'low';

        // Liability
        if (formData.faultBelief === 'other_driver') s += 30;
        if (formData.policeReport === 'yes_report') s += 10;
        if (formData.tickets === 'no') s += 5;

        // Injury Severity
        if (formData.isInjured === 'yes') {
            s += 20;
            if (formData.painLevel >= 7) { s += 10; severity = 'medium'; }
            if (formData.treatmentStatus === 'er' || formData.treatmentStatus === 'surgery') { s += 15; severity = 'high'; }
        }

        // Coverage
        if (formData.otherInsurance === 'yes') s += 10;
        if (formData.incidentType === 'auto_truck') { s += 20; severity = 'high'; }

        // Adjusters
        if (formData.hiredLawyer === 'yes' && formData.changeLawyer === 'no') s = 0; // Disqualified usually

        if (s > 95) s = 95;
        if (s < 0) s = 0;

        return { score: s, severity }; // Returning object now
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

        const d = dict?.caseReview; // Shortcut
        const o = dict?.options; // Was dict.caseReview.options but now global options in dict
        // Access new dictionaries
        const incidentTypes = dict?.incident_type_options;
        const bodyParts = dict?.body_parts;
        const treatments = dict?.treatment_options;
        const faultOpts = dict?.fault_options;
        const ui = dict?.ui;

        if (!d || !o) return null;

        switch (step) {
            case 1: // Accident
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.accident.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold font-sans text-gray-500 uppercase tracking-wide block mb-1">{d.steps.accident.date}</label>
                                <input type="date" name="dateOfAccident" value={formData.dateOfAccident} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold font-sans text-gray-500 uppercase tracking-wide block mb-1">{d.steps.accident.location}</label>
                                <input name="cityState" value={formData.cityState} onChange={handleChange} placeholder="e.g. Houston, TX" className="p-3 border border-gray-300 rounded-sm w-full text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-bold font-sans text-gray-500 uppercase tracking-wide block mb-1">{d?.steps?.incident_details?.collision_type_label || "Collision Type"}</label>
                                <select name="collisionType" value={formData.collisionType} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                    <option value="rear_end">{d?.steps?.incident_details?.options?.rear_end || "Rear End"}</option>
                                    <option value="t_bone">{d?.steps?.incident_details?.options?.t_bone || "Side Impact / T-Bone"}</option>
                                    <option value="head_on">{d?.steps?.incident_details?.options?.head_on || "Head On"}</option>
                                    <option value="sideswipe">{d?.steps?.incident_details?.options?.sideswipe || "Sideswipe"}</option>
                                    <option value="multi">{d?.steps?.incident_details?.options?.multi || "Multi-Vehicle Pileup"}</option>
                                </select>
                            </div>

                            <select name="incidentType" value={formData.incidentType} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                <option value="auto_auto">{incidentTypes?.auto_auto || "Car vs Car"}</option>
                                <option value="auto_truck">{incidentTypes?.auto_truck || "Car vs Truck"}</option>
                                <option value="motorcycle">{incidentTypes?.motorcycle || "Motorcycle"}</option>
                                <option value="pedestrian">{incidentTypes?.pedestrian || "Pedestrian"}</option>
                                <option value="other">{incidentTypes?.other || "Other"}</option>
                            </select>
                            <select name="role" value={formData.role} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                <option value="driver">{o?.driver || "Driver"}</option>
                                <option value="passenger">{o?.passenger || "Passenger"}</option>
                                <option value="pedestrian">{o?.pedestrian || "Pedestrian"}</option>
                            </select>
                            <input name="vehicle" placeholder={d.steps.accident.vehicle} value={formData.vehicle} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full md:col-span-2 text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />

                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold font-sans text-gray-500 uppercase tracking-wide block mb-1">{d?.steps?.official_record?.police_label || "Police Report?"}</label>
                                    <select name="policeReport" value={formData.policeReport} onChange={handleChange} className="border border-gray-300 p-3 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                        <option value="yes_report">{d?.steps?.official_record?.options?.yes_report || "Yes, Report Filed"}</option>
                                        <option value="yes_no_report">{d?.steps?.official_record?.options?.yes_no_report || "Police Came, No Report"}</option>
                                        <option value="no">{d?.steps?.official_record?.options?.no || "No Police Notified"}</option>
                                        <option value="unsure">{d?.steps?.official_record?.options?.unsure || "Unsure"}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold font-sans text-gray-500 uppercase tracking-wide block mb-1">{d.steps.accident.tickets}</label>
                                    <select name="tickets" value={formData.tickets} onChange={handleChange} className="border border-gray-300 p-3 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                        <option value="no">{o?.no || "No"}</option>
                                        {/* Swapped logic: No ticket is GOOD for user liability usually */}
                                        <option value="yes">{o?.yes || "Yes"}</option>
                                        <option value="unsure">{o?.unsure || "Unsure"}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Injury
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.injury.title}</h3>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-navy-900">{d.steps.injury.were_injured}</label>
                            <select name="isInjured" value={formData.isInjured} onChange={handleChange} className="p-3 border rounded-sm w-full bg-white mb-4 shadow-sm text-navy-900 focus:border-gold-500">
                                <option value="yes">{o?.yes || "Yes"}</option>
                                <option value="no">{o?.no || "No"}</option>
                                <option value="unsure">{o?.unsure || "Unsure"}</option>
                            </select>
                        </div>
                        {formData.isInjured !== 'no' && (
                            <div className="animate-fade-in space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-navy-900">{d.steps.injury.pain_level}: <span className="text-gold-600 font-black text-lg">{formData.painLevel}</span>/10</label>
                                    <input type="range" min="0" max="10" name="painLevel" value={formData.painLevel} onChange={handleChange} className="w-full accent-gold-500 cursor-pointer h-2 bg-gray-200 rounded-lg appearance-none" />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{ui?.pain_scale?.none || "No Pain"}</span>
                                        <span>{ui?.pain_scale?.severe || "Severe"}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-navy-900">{d.steps.injury.parts}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(Object.keys(bodyParts || {})).map((key) => {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            const label = bodyParts ? (bodyParts as any)[key] : key;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleArrayItem('bodyParts', key)}
                                                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${formData.bodyParts.includes(key) ? 'bg-navy-900 text-gold-500 border-navy-900 shadow-lg' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gold-500'}`}
                                                >
                                                    {label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold block mb-1 text-navy-900">{d.steps.injury.treatment}</label>
                                        <select name="treatmentStatus" value={formData.treatmentStatus} onChange={handleChange} className="p-3 border rounded-sm w-full bg-white text-sm text-navy-900 focus:border-gold-500">
                                            <option value="none_yet">{treatments?.none_yet || "None"}</option>
                                            <option value="er">{treatments?.er || "ER"}</option>
                                            <option value="urgent_care">{treatments?.urgent_care || "Urgent Care"}</option>
                                            <option value="surgery">{treatments?.surgery || "Surgery"}</option>
                                            <option value="chiro">{treatments?.chiro || "Chiro/PT"}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold block mb-1 text-navy-900">{d?.steps?.injury?.need_doc}</label>
                                        <select name="needDoctor" value={formData.needDoctor} onChange={handleChange} className="p-3 border rounded-sm w-full bg-white text-sm text-navy-900 focus:border-gold-500">
                                            <option value="yes">{o?.yes || "Yes"}</option>
                                            <option value="no">{o?.no || "No"}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 3: // Fault
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.fault.title}</h3>
                        <div className="space-y-3">
                            <div><label className="block text-sm font-bold text-navy-900 mb-1">{d.steps.fault.who_fault}</label>
                                <select name="faultBelief" value={formData.faultBelief} onChange={handleChange} className="p-3 border rounded-sm w-full bg-white text-navy-900 focus:border-gold-500">
                                    <option value="other_driver">{faultOpts?.other_driver || "Other Driver"}</option>
                                    <option value="me">{faultOpts?.me || "Me"}</option>
                                    <option value="shared">{faultOpts?.shared || "Shared"}</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="text-sm block text-navy-900 font-medium">{d?.steps?.fault?.admit} <select name="admitFault" value={formData.admitFault} onChange={handleChange} className="border p-2 w-full rounded-sm mt-1 bg-white text-navy-900 focus:border-gold-500"><option value="yes">{o?.yes || "Yes"}</option><option value="no">{o?.no || "No"}</option><option value="unsure">{o?.unsure || "Unsure"}</option></select></label>
                                <label className="text-sm block text-navy-900 font-medium">{d?.steps?.fault?.insured} <select name="otherInsurance" value={formData.otherInsurance} onChange={handleChange} className="border p-2 w-full rounded-sm mt-1 bg-white text-navy-900 focus:border-gold-500"><option value="yes">{o?.yes || "Yes"}</option><option value="no">{o?.no || "No"}</option><option value="unsure">{o?.unsure || "Unsure"}</option></select></label>
                            </div>
                            <input name="myInsurance" placeholder={d.steps.fault.my_insurance} value={formData.myInsurance} onChange={handleChange} className="p-3 border rounded-sm w-full text-navy-900 focus:border-gold-500" />
                            <div className="p-3 bg-yellow-50 text-sm text-yellow-800 rounded border border-yellow-100 flex items-center justify-between">
                                <span>{d?.steps?.fault?.recorded}</span>
                                <select name="recordedStatement" value={formData.recordedStatement} onChange={handleChange} className="ml-2 border p-1 rounded bg-white text-navy-900 text-xs"><option value="no">{o?.no || "No"}</option><option value="yes">{o?.yes || "Yes"}</option><option value="unsure">{o?.unsure || "Unsure"}</option></select>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Legal
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.legal.title}</h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 border rounded-sm hover:bg-gray-50 bg-white cursor-pointer transition-colors border-gray-200">
                                <span className="font-medium text-navy-900">{d?.steps?.legal?.hired}</span>
                                <select name="hiredLawyer" value={formData.hiredLawyer} onChange={handleChange} className="border p-2 rounded-sm bg-gray-50 text-navy-900 focus:border-gold-500"><option value="no">{o?.no || "No"}</option><option value="yes">{o?.yes || "Yes"}</option></select>
                            </label>
                            {formData.hiredLawyer === 'yes' && (
                                <label className="flex items-center justify-between p-3 border rounded-sm bg-yellow-50 animate-fade-in">
                                    <span className="font-medium text-sm text-yellow-900">{d.steps.legal.change}</span>
                                    <select name="changeLawyer" value={formData.changeLawyer} onChange={handleChange} className="border p-2 rounded-sm bg-white text-navy-900 focus:border-gold-500"><option value="no">{o?.no || "No"}</option><option value="yes">{o?.yes || "Yes"}</option></select>
                                </label>
                            )}
                            <label className="flex items-center justify-between p-3 border rounded-sm hover:bg-gray-50 bg-white cursor-pointer transition-colors border-gray-200">
                                <span className="font-medium text-navy-900">{d?.steps?.legal?.prior}</span>
                                <select name="priorClaims" value={formData.priorClaims} onChange={handleChange} className="border p-2 rounded-sm bg-gray-50 text-navy-900 focus:border-gold-500"><option value="no">{o?.no || "No"}</option><option value="yes">{o?.yes || "Yes"}</option></select>
                            </label>
                        </div>
                    </div>
                );
            case 5: // Impact
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.impact.title}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <label className="block p-3 border rounded-sm bg-white hover:border-gold-500 transition-colors">
                                    <span className="block text-sm font-bold mb-2 text-navy-900">{d.steps.impact.working}</span>
                                    <select name="wasWorking" value={formData.wasWorking} onChange={handleChange} className="w-full p-2 border rounded-sm bg-gray-50 text-navy-900 focus:border-gold-500"><option value="no">{o?.no || "No"}</option><option value="yes">{o?.yes || "Yes"}</option></select>
                                </label>
                                <label className="block p-3 border rounded-sm bg-white hover:border-gold-500 transition-colors">
                                    <span className="block text-sm font-bold mb-2 text-navy-900">{d.steps.impact.missed}</span>
                                    <select name="missedWork" value={formData.missedWork} onChange={handleChange} className="w-full p-2 border rounded-sm bg-gray-50 text-navy-900 focus:border-gold-500"><option value="no">{o?.no || "No"}</option><option value="yes">{o?.yes || "Yes"}</option></select>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-navy-900">{d.steps.impact.concerns}</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { key: 'Pain/Health', label: d?.concerns?.pain },
                                        { key: 'Medical Bills', label: d?.concerns?.bills },
                                        { key: 'Lost Income', label: d?.concerns?.income },
                                        { key: 'Car Repair', label: d?.concerns?.repair },
                                        { key: 'Insurance Calls', label: d?.concerns?.calls }
                                    ].map(c => (
                                        <button
                                            key={c.key}
                                            onClick={() => toggleArrayItem('biggestConcern', c.key)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${formData.biggestConcern.includes(c.key) ? 'bg-navy-900 text-gold-500 border-navy-900 shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:border-gold-500'}`}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 6: // Contact (New Step)
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.contact.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="fullName" placeholder={d.steps.contact.name} value={formData.fullName} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                            <input name="phone" placeholder={d.steps.contact.phone} value={formData.phone} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                            <input name="email" placeholder={d.steps.contact.email} value={formData.email} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                            <select name="contactMethod" value={formData.contactMethod} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                <option value="text">{o.text}</option>
                                <option value="call">{o.call}</option>
                                <option value="email">{o.email}</option>
                            </select>
                            <input name="bestTime" placeholder={d.steps.contact.time} value={formData.bestTime} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full text-navy-900 bg-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500" />
                            <select name="language" value={formData.language} onChange={handleChange} className="p-3 border border-gray-300 rounded-sm w-full bg-white text-navy-900 focus:border-gold-500 focus:ring-1 focus:ring-gold-500">
                                <option value="English">English</option>
                                <option value="Spanish">Español</option>
                            </select>
                            <label className="flex items-center gap-2 md:col-span-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-sm cursor-pointer hover:bg-gray-100">
                                <input type="checkbox" name="permissionText" checked={formData.permissionText} onChange={handleChange} className="accent-gold-500 w-4 h-4" />
                                <span className="flex-1">{d.steps.contact.permission}</span>
                            </label>
                        </div>
                    </div>
                );
            case 7: // Documents
                return (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-bold text-navy-900 border-b pb-2 font-serif">{d.steps.docs.title}</h3>
                        <p className="text-sm text-gray-600">{d.steps.docs.desc}</p>
                        <ul className="text-sm text-gray-500 list-disc ml-5 space-y-1">
                            {d.steps.docs.list.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>

                        <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer relative group">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <p className="font-bold text-navy-900 group-hover:text-blue-700 transition-colors uppercase tracking-wide">{d.steps.docs.cta}</p>
                            <p className="text-xs text-blue-400 mt-2 font-medium">{d.upload.secure}</p>
                        </div>

                        {formData.uploadedFiles.length > 0 && (
                            <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm animate-fade-in">
                                <h4 className="font-bold text-xs mb-2 text-gray-500 uppercase tracking-widest">{d.upload.attached}</h4>
                                {formData.uploadedFiles.map((f, i) => (
                                    <div key={i} className="text-sm text-navy-900 truncate flex items-center gap-2">
                                        <span className="text-green-500">✓</span> {f}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 8: // Success / Score
                return (
                    <div className="text-center animate-fade-in py-8">
                        {score !== null && score.score > 70 ? (
                            <>
                                <div className="mb-6 relative inline-block">
                                    <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-20"></div>
                                    <CheckCircleIcon className="w-24 h-24 text-green-600 relative z-10" />
                                </div>
                                <h3 className="text-3xl font-serif font-black text-navy-900 mb-2">{d.steps.result.high_chance}</h3>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                                    {score.score}%
                                </div>
                                <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-8 border border-green-200">
                                    {(d.steps.result.case_detected || "{severity} Case Detected").replace('{severity}', score.severity.toUpperCase())}
                                </div>
                                <button onClick={() => { closeReview(); openChat('high_value_lead', { score, ...formData }); }} className="w-full md:w-auto bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold py-4 px-12 rounded-sm shadow-xl text-xl hover:scale-105 transition transform uppercase tracking-widest border border-gold-400">
                                    {d.steps.result.call_btn}
                                </button>
                            </>
                        ) : (
                            <>
                                <AlertTriangleIcon className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-3xl font-serif font-bold text-navy-900 mb-2">{d.steps.result.review_needed}</h3>
                                <div className="text-5xl font-black text-yellow-600 mb-6">{score?.score || 50}%</div>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    {(d.steps.result.review_desc || "A specialized attorney needs to manually review your details. We will contact you at {phone} shortly.").replace('{phone}', formData.phone)}
                                </p>
                                <button onClick={closeReview} className="bg-navy-900 text-white font-bold py-3 px-8 rounded-sm hover:bg-navy-800 transition">
                                    {d.steps.result.close_btn}
                                </button>
                            </>
                        )}
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
                            <h2 className="font-bold text-lg">{dict?.caseReview?.banner?.title || "Case Review"}</h2>
                            <p className="text-xs text-blue-200">{dict?.caseReview?.banner?.subtitle || "AI Legal Assistant"}</p>
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
                                <ChevronLeftIcon size={16} /> {ui?.back || "Back"}
                            </button>
                        ) : <div></div>}

                        {step < 7 ? (
                            <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow flex items-center gap-2">
                                {ui?.next || "Next"} <ChevronRightIcon size={16} />
                            </button>
                        ) : (
                            <button onClick={submitReview} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow flex items-center gap-2">
                                {isSubmitting ? (ui?.analyzing || "Analyzing...") : (ui?.analyze || "Get AI Result")}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
