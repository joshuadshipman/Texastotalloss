
"use client";

import React, { useState, ChangeEvent } from 'react';
import { useChat } from './ChatContext';
import { XIcon, CheckCircleIcon, AlertTriangleIcon, ChevronRightIcon, ChevronLeftIcon, InfoIcon, TrendingUpIcon } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Dictionary } from '@/dictionaries/en';

interface CaseReviewModalProps {
    dict?: Dictionary | null;
    lang?: string;
}

export default function CaseReviewModal({ dict, lang }: CaseReviewModalProps) {
    const { isReviewOpen, closeReview, openChat } = useChat();

    if (!isReviewOpen) return null;

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
        uploadedFiles: [] as string[],
        caseInsights: "" as string
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
        let insight = "";

        // Liability
        if (formData.faultBelief === 'other_driver') {
            s += 30;
            insight = "✅ Other driver fault significantly increases your settlement probability.";
        }
        if (formData.policeReport === 'yes_report') s += 10;
        if (formData.tickets === 'no') s += 5;

        // Injury Severity
        if (formData.isInjured === 'yes') {
            s += 20;
            if (formData.painLevel >= 7) {
                s += 10;
                severity = 'medium';
                insight += " | High pain level cases are prioritized for expedited legal review.";
            }
            if (formData.treatmentStatus === 'er' || formData.treatmentStatus === 'surgery') {
                s += 15;
                severity = 'high';
                insight += " | Documented ER/Surgery treatment maximizes claim viability.";
            }
        }

        // Coverage
        if (formData.otherInsurance === 'yes') s += 10;
        if (formData.incidentType === 'auto_truck') {
            s += 20;
            severity = 'high';
            insight += " | Commercial truck accidents in Texas often involve multi-million dollar policies.";
        }

        // Adjusters
        if (formData.hiredLawyer === 'yes' && formData.changeLawyer === 'no') s = 0;

        if (s > 95) s = 95;
        if (s < 0) s = 0;

        return { score: s, severity, insight };
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
            await addDoc(collection(db, 'chat_messages'), {
                session_id: sessionId,
                sender: 'system',
                content: formattedReport,
                created_at: new Date().toISOString()
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                             <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.accident.title}</h3>
                             <p className="text-sm text-slate-500 font-medium">Please provide the core details of the strategic incident environment.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.accident.date}</label>
                                <input type="date" name="dateOfAccident" value={formData.dateOfAccident} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.accident.location}</label>
                                <input name="cityState" value={formData.cityState} onChange={handleChange} placeholder="e.g. Houston, TX" className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm" />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d?.steps?.incident_details?.collision_type_label || "Collision Type"}</label>
                                <div className="relative group">
                                    <select name="collisionType" value={formData.collisionType} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                                        <option value="rear_end">{d?.steps?.incident_details?.options?.rear_end || "Rear End"}</option>
                                        <option value="t_bone">{d?.steps?.incident_details?.options?.t_bone || "Side Impact / T-Bone"}</option>
                                        <option value="head_on">{d?.steps?.incident_details?.options?.head_on || "Head On"}</option>
                                        <option value="sideswipe">{d?.steps?.incident_details?.options?.sideswipe || "Sideswipe"}</option>
                                        <option value="multi">{d?.steps?.incident_details?.options?.multi || "Multi-Vehicle Pileup"}</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                                        <ChevronRightIcon size={20} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2: // Injury
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.injury.title}</h3>
                            <p className="text-sm text-slate-500 font-medium italic">Your physical recovery is our primary strategic objective.</p>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.injury.were_injured}</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['yes', 'no', 'unsure'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData(prev => ({ ...prev, isInjured: val }))}
                                            className={`py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${formData.isInjured === val ? 'bg-primary text-white border-primary shadow-xl scale-[1.02]' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
                                        >
                                            {val === 'yes' ? o?.yes : val === 'no' ? o?.no : o?.unsure}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {formData.isInjured !== 'no' && (
                            <div className="animate-in fade-in slide-in-from-top-6 duration-700 space-y-10">
                                <div className="space-y-4 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                                    <div className="flex justify-between items-end mb-2">
                                        <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block">{d.steps.injury.pain_level}</label>
                                        <span className="text-4xl font-black text-primary leading-none tabular-nums">{formData.painLevel}<span className="text-sm font-bold text-slate-300 ml-1">/ 10</span></span>
                                    </div>
                                    <input type="range" min="0" max="10" name="painLevel" value={formData.painLevel} onChange={handleChange} className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary transition-all active:scale-[0.98]" />
                                    <div className="flex justify-between text-[10px] uppercase font-black tracking-[0.15em] text-slate-400 px-1">
                                        <span>{ui?.pain_scale?.none || "Comfortable"}</span>
                                        <span>{ui?.pain_scale?.severe || "Extreme"}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.injury.parts}</label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {(Object.keys(bodyParts || {})).map((key) => {
                                            const label = bodyParts ? (bodyParts as any)[key] : key;
                                            const isSelected = formData.bodyParts.includes(key);
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => toggleArrayItem('bodyParts', key)}
                                                    className={`px-6 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all transform active:scale-95 border-2 ${isSelected ? 'bg-primary text-white shadow-2xl border-primary -translate-y-1' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 shadow-sm'}`}
                                                >
                                                    {label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.injury.treatment}</label>
                                        <select name="treatmentStatus" value={formData.treatmentStatus} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm appearance-none">
                                            <option value="none_yet">{treatments?.none_yet || "None"}</option>
                                            <option value="er">{treatments?.er || "ER"}</option>
                                            <option value="urgent_care">{treatments?.urgent_care || "Urgent Care"}</option>
                                            <option value="surgery">{treatments?.surgery || "Surgery"}</option>
                                            <option value="chiro">{treatments?.chiro || "Chiro/PT"}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d?.steps?.injury?.need_doc}</label>
                                        <select name="needDoctor" value={formData.needDoctor} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm appearance-none">
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.fault.title}</h3>
                            <p className="text-sm text-slate-500 font-medium">Determining the liability matrix to maximize your claim leverage.</p>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.fault.who_fault}</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {['other_driver', 'me', 'shared'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData(prev => ({ ...prev, faultBelief: val }))}
                                            className={`p-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-2 text-left flex items-center justify-between group ${formData.faultBelief === val ? 'bg-primary text-white border-primary shadow-xl translate-x-1' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                                        >
                                            <span>
                                                {val === 'other_driver' ? faultOpts?.other_driver : val === 'me' ? faultOpts?.me : faultOpts?.shared}
                                            </span>
                                            <ChevronRightIcon size={18} className={`transition-transform duration-300 ${formData.faultBelief === val ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d?.steps?.fault?.admit}</label>
                                    <select name="admitFault" value={formData.admitFault} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm appearance-none cursor-pointer">
                                        <option value="yes">{o?.yes || "Yes"}</option>
                                        <option value="no">{o?.no || "No"}</option>
                                        <option value="unsure">{o?.unsure || "Unsure"}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d?.steps?.fault?.insured}</label>
                                    <select name="otherInsurance" value={formData.otherInsurance} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm appearance-none cursor-pointer">
                                        <option value="yes">{o?.yes || "Yes"}</option>
                                        <option value="no">{o?.no || "No"}</option>
                                        <option value="unsure">{o?.unsure || "Unsure"}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4: // Legal
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.legal.title}</h3>
                            <p className="text-sm text-slate-500 font-medium italic">Confidentiality and legal standing assessment.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d?.steps?.legal?.hired}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['yes', 'no'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData(prev => ({ ...prev, hiredLawyer: val }))}
                                            className={`py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${formData.hiredLawyer === val ? 'bg-primary text-white border-primary shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                        >
                                            {val === 'yes' ? o?.yes : o?.no}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {formData.hiredLawyer === 'yes' && (
                                <div className="p-8 border-2 border-amber-100 rounded-[2.5rem] bg-amber-50/50 animate-in zoom-in-95 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-amber-100 p-2 rounded-xl">
                                            <AlertTriangleIcon className="text-amber-600 w-5 h-5" />
                                        </div>
                                        <p className="font-bold text-amber-900 text-sm leading-relaxed">{d.steps.legal.change}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['yes', 'no'].map((val) => (
                                            <button
                                                key={val}
                                                onClick={() => setFormData(prev => ({ ...prev, changeLawyer: val }))}
                                                className={`py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${formData.changeLawyer === val ? 'bg-amber-600 text-white border-amber-600 shadow-lg' : 'bg-white text-amber-400 border-amber-100'}`}
                                            >
                                                {val === 'yes' ? o?.yes : o?.no}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2 pt-4">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d?.steps?.legal?.prior}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['yes', 'no'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData(prev => ({ ...prev, priorClaims: val }))}
                                            className={`py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${formData.priorClaims === val ? 'bg-primary text-white border-primary shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                        >
                                            {val === 'yes' ? o?.yes : o?.no}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5: // Impact
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.impact.title}</h3>
                            <p className="text-sm text-slate-500 font-medium">Measuring the financial and life impact for maximum damages.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.impact.working}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['yes', 'no'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData(prev => ({ ...prev, wasWorking: val }))}
                                            className={`py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${formData.wasWorking === val ? 'bg-primary text-white border-primary shadow-lg' : 'bg-slate-50 text-slate-300 border-slate-100'}`}
                                        >
                                            {val === 'yes' ? o?.yes : o?.no}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.impact.missed}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['yes', 'no'].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setFormData(prev => ({ ...prev, missedWork: val }))}
                                            className={`py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-2 ${formData.missedWork === val ? 'bg-primary text-white border-primary shadow-lg' : 'bg-slate-50 text-slate-300 border-slate-100'}`}
                                        >
                                            {val === 'yes' ? o?.yes : o?.no}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.impact.concerns}</label>
                            <div className="flex flex-wrap gap-2.5">
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
                                        className={`px-6 py-4 rounded-[1.5rem] text-[12px] font-black uppercase tracking-wider transition-all transform active:scale-95 border-2 ${formData.biggestConcern.includes(c.key) ? 'bg-primary text-white shadow-2xl border-primary -translate-y-1' : 'bg-white text-slate-400 border-slate-100 hover:border-primary/20 shadow-sm'}`}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 6: // Contact
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.contact.title}</h3>
                            <p className="text-sm text-slate-500 font-medium">Finalizing the secure communication channel for your evaluation results.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.contact.name}</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Legal Name" className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.contact.phone}</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.contact.email}</label>
                                <input name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">Communication Preference</label>
                                <select name="contactMethod" value={formData.contactMethod} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all appearance-none shadow-sm cursor-pointer">
                                    <option value="text">{o.text}</option>
                                    <option value="call">{o.call}</option>
                                    <option value="email">{o.email}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">{d.steps.contact.time}</label>
                                <input name="bestTime" value={formData.bestTime} onChange={handleChange} placeholder="e.g. Afternoon, ASAP" className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black font-sans text-primary uppercase tracking-[0.2em] block pl-1">Preferred Language</label>
                                <select name="language" value={formData.language} onChange={handleChange} className="h-[64px] px-6 border-2 border-slate-100 rounded-[1.25rem] w-full text-[16px] font-bold text-slate-900 bg-slate-50 focus:bg-white focus:border-primary focus:ring-8 focus:ring-primary/5 outline-none transition-all appearance-none shadow-sm cursor-pointer">
                                    <option value="English">English</option>
                                    <option value="Spanish">Español</option>
                                </select>
                            </div>
                            <label className="flex items-start gap-4 md:col-span-2 bg-slate-50 p-6 rounded-[1.5rem] cursor-pointer hover:bg-slate-100 transition-colors border-2 border-slate-100 group">
                                <div className="relative pt-1">
                                    <input type="checkbox" name="permissionText" checked={formData.permissionText} onChange={handleChange} className="peer hidden" />
                                    <div className="w-6 h-6 border-2 border-slate-300 rounded-lg group-hover:border-primary transition-colors peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                                <span className="flex-1 font-bold text-slate-500 text-sm leading-snug group-hover:text-slate-700 transition-colors">{d.steps.contact.permission}</span>
                            </label>
                        </div>
                    </div>
                );
            case 7: // Documents
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 font-serif tracking-tight leading-tight">{d.steps.docs.title}</h3>
                            <p className="text-sm text-slate-500 font-medium">{d.steps.docs.desc}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {d.steps.docs.list.map((item: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-600">
                                    <InfoIcon size={14} className="text-primary/40" /> {item}
                                </div>
                            ))}
                        </div>
                        <div className="border-4 border-dashed border-primary/10 rounded-[3rem] p-12 text-center bg-primary/[0.02] hover:bg-primary/[0.04] transition-all cursor-pointer relative group border-spacing-8">
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-primary/5 group-hover:scale-110 transition-transform duration-500">
                                <span className="text-4xl">📄</span>
                            </div>
                            <p className="text-lg font-black text-primary group-hover:text-blue-700 transition-colors uppercase tracking-[0.2em]">{d.steps.docs.cta}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-4">{d.upload.secure}</p>
                        </div>

                        {formData.uploadedFiles.length > 0 && (
                            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                                <h4 className="font-black text-[11px] mb-4 text-primary uppercase tracking-[0.25em] pl-1">{d.upload.attached}</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {formData.uploadedFiles.map((f, i) => (
                                        <div key={i} className="text-sm font-bold text-slate-900 truncate flex items-center gap-4 bg-slate-50 p-4 rounded-[1.25rem] border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                                            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-200">
                                                <CheckCircleIcon size={16} className="text-white" />
                                            </div>
                                            <span className="truncate flex-1 font-black uppercase tracking-tight text-xs">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 8: // Success / Score
                return (
                    <div className="text-center animate-in fade-in zoom-in-95 duration-1000 py-12 px-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05),transparent)] pointer-events-none"></div>
                        {score !== null && score.score > 70 ? (
                            <>
                                <div className="mb-10 relative inline-block">
                                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 duration-[2000ms]"></div>
                                    <div className="relative z-10 w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center border-2 border-green-100 shadow-2xl shadow-green-100/50">
                                        <CheckCircleIcon className="w-16 h-16 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="text-4xl font-serif font-black text-slate-900 mb-4 tracking-tight leading-tight">{d.steps.result.high_chance}</h3>
                                <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-600 via-emerald-600 to-primary mb-4 drop-shadow-sm">
                                    {score.score}%
                                </div>
                                <div className="inline-flex items-center gap-3 bg-green-100/50 text-green-800 px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-12 border border-green-200 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    {(d.steps.result.case_detected || "{severity} Case Detected").replace('{severity}', score.severity.toUpperCase())}
                                </div>
                                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                                    <button 
                                        onClick={() => { closeReview(); openChat('high_value_lead', { score, ...formData }); }} 
                                        className="w-full bg-gradient-to-br from-primary via-blue-700 to-primary text-white font-black py-6 px-10 rounded-2xl shadow-2xl text-lg hover:scale-[1.03] active:scale-95 transition-all uppercase tracking-[0.15em] border-b-4 border-black/20 group"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            {d.steps.result.call_btn} <ChevronRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-10 relative inline-block">
                                    <div className="relative z-10 w-32 h-32 bg-amber-50 rounded-[2.5rem] flex items-center justify-center border-2 border-amber-100 shadow-2xl shadow-amber-100/50">
                                        <AlertTriangleIcon className="w-16 h-16 text-amber-500" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-serif font-black text-slate-900 mb-4 tracking-tight leading-tight">{d.steps.result.review_needed}</h3>
                                <div className="text-7xl font-black text-amber-600 mb-6 drop-shadow-sm">{score?.score || 50}%</div>
                                <p className="text-slate-500 mb-12 max-w-sm mx-auto font-medium leading-relaxed">
                                    {(d.steps.result.review_desc || "A specialized attorney needs to manually review your details. We will contact you at {phone} shortly.").replace('{phone}', formData.phone)}
                                </p>
                                <button 
                                    onClick={closeReview} 
                                    className="w-full md:w-auto bg-slate-900 text-white font-black py-5 px-12 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 mx-auto uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95"
                                >
                                    {d.steps.result.close_btn} <XIcon size={18} />
                                </button>
                            </>
                        )}
                    </div>
                );
            default: return null;
        }
    }


    const currentInsight = calculateScore().insight;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl md:rounded-[3rem] shadow-4xl overflow-hidden flex flex-col h-full md:h-auto md:max-h-[92vh] border border-white/10 relative">
                
                {/* Visual Progress Bar (Refined) */}
                <div className="h-1.5 w-full bg-slate-100/50 flex overflow-hidden relative z-50">
                    <div 
                        className="h-full bg-gradient-to-r from-primary via-blue-600 to-gold-500 transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(30,58,138,0.5)] relative overflow-hidden" 
                        style={{ width: `${(step / 8) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                    </div>
                </div>

                {/* Header (Pro Max) */}
                <header className="bg-slate-900 text-white p-6 md:p-8 flex items-center justify-between border-b border-white/5 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full translate-x-32 -translate-y-32"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-x-16 translate-y-16"></div>
                    
                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-white/5 rounded-[1.25rem] flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md group-hover:scale-110 transition-transform">
                            <span className="text-3xl filter drop-shadow-lg">⚖️</span>
                        </div>
                        <div>
                            <h2 className="font-serif font-black text-2xl md:text-3xl tracking-tight leading-none mb-1.5">
                                {dict?.caseReview?.banner?.title || "Legal Case Strategy"}
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <div className="w-2 h-2 bg-green-500/40 rounded-full"></div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500/80">
                                    {dict?.caseReview?.banner?.subtitle || "SECURE AI ANALYSIS ACTIVE"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={closeReview} 
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all active:scale-90 relative z-10 border border-white/10 group"
                    >
                        <XIcon size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </header>

                {/* AI Insight Bar (Enhanced) */}
                {step > 1 && step < 8 && (
                    <div className="bg-slate-50 border-b border-slate-100 px-6 md:px-10 py-5 animate-in slide-in-from-top-6 duration-500 relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none"></div>
                        <div className="flex gap-6 items-center relative z-10">
                            <div className="bg-primary/5 p-3 rounded-2xl border border-primary/10 shadow-sm">
                                <TrendingUpIcon className="text-primary w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">STRATEGIC INSIGHT</span>
                                    <span className="w-1.5 h-1.5 bg-primary/20 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-slate-400">REAL-TIME EVALUATION</span>
                                </div>
                                <p className="text-base font-black text-slate-900 leading-tight italic decoration-primary underline-offset-4 decoration-2">
                                    {currentInsight || "Calibrating jurisdictional metrics for Texas liability standards..."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                <main className="p-6 md:p-8 overflow-y-auto flex-1 bg-white scroll-smooth custom-scrollbar">
                    {renderStep()}
                </main>

                {/* Footer Navigation */}
                {step < 8 && (
                    <footer className="p-6 md:p-8 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 safe-bottom">
                        {step > 1 ? (
                            <button 
                                onClick={prevStep} 
                                className="flex items-center gap-2 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-primary transition-all px-4 py-3 active:scale-90"
                            >
                                <ChevronLeftIcon size={18} /> {ui?.back || "Previous"}
                            </button>
                        ) : <div className="w-10"></div>}

                        <div className="flex items-center gap-2">
                             {/* Step dots for mobile */}
                             <div className="flex md:hidden gap-1 mr-4">
                                {[1,2,3,4,5,6,7].map(s => (
                                    <div key={s} className={`w-1.5 h-1.5 rounded-full ${s === step ? 'bg-primary' : 'bg-slate-200'}`}></div>
                                ))}
                             </div>

                            {step < 7 ? (
                                <button 
                                    onClick={nextStep} 
                                    className="bg-primary hover:bg-secondary text-white font-black py-5 px-10 rounded-2xl shadow-xl flex items-center gap-3 transform active:scale-95 transition-all text-sm uppercase tracking-widest border-b-4 border-black/20"
                                >
                                    {ui?.next || "Continue"} <ChevronRightIcon size={20} />
                                </button>
                            ) : (
                                <button 
                                    onClick={submitReview} 
                                    disabled={isSubmitting} 
                                    className="bg-green-600 hover:bg-green-700 text-white font-black py-5 px-10 rounded-2xl shadow-2xl flex items-center gap-3 transform hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest border-b-4 border-black/20"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {ui?.analyzing || "VETTING..."}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {ui?.analyze || "Finalize & Submit"} <CheckCircleIcon size={20} />
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
}
