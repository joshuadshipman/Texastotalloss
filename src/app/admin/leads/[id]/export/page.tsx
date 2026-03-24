'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Car, 
  Camera, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Activity,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

export default function LeadExportPage() {
    const params = useParams();
    const id = params.id as string;
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'total_loss_leads', id));
                if (docSnap.exists()) {
                    setLead(docSnap.data());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Generating Sales Sheet...</div>;
    if (!lead) return <div className="p-20 text-center text-red-500 font-bold">Lead Not Found</div>;

    const vehicle = lead.vehicle_info || {};
    const valuation = lead.valuation || {};

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
                        <ArrowLeft size={18} /> BACK TO ADMIN
                    </button>
                    <div className="flex gap-3 text-slate-900">
                        <button className="bg-white border text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all">
                            <Download size={16} /> DOWNLOAD PDF
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg hover:shadow-blue-200 transition-all">
                            <Share2 size={16} /> SHARE WITH BUYER
                        </button>
                    </div>
                </div>

                {/* Main Sales Sheet */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none">
                    
                    {/* Top Banner: Hero Data */}
                    <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                            <Car size={300} className="rotate-12" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase">
                                    {lead.status || 'NEW LEAD'}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-bold opacity-80">
                                    <Calendar size={14} /> {new Date(lead.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-lg font-medium opacity-90">
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} className="text-blue-400" /> {lead.zip || 'Texas'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity size={20} className="text-blue-400" /> {vehicle.mileage?.toLocaleString() || 'N/A'} Miles
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <ShieldCheck size={20} className="text-blue-400" /> VIN: <span className="font-mono">{vehicle.vin || 'PENDING'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-slate-100">
                        {/* Left Column: Evidence Gallery */}
                        <div className="lg:col-span-2 border-r border-slate-100 p-8 md:p-12">
                            <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <Camera className="text-blue-600" /> LOSS EVIDENCE GALLERY
                            </h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {lead.evidence_urls?.length > 0 ? (
                                    lead.evidence_urls.map((url: string, idx: number) => (
                                        <div key={idx} className={`rounded-3xl overflow-hidden shadow-sm border border-slate-100 group cursor-zoom-in ${idx === 0 ? 'col-span-2 h-80' : 'h-48'}`}>
                                            <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold uppercase tracking-tight">
                                        No Evidence Photos Provided
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100">
                                <h3 className="font-black text-blue-900 text-sm tracking-[0.2em] mb-4 uppercase">AI Case Sentiment</h3>
                                <p className="text-blue-800 leading-relaxed font-medium">
                                    {lead.ai_summary || "Automated case review pending for this lead. Preliminary analysis suggests a potential 'Total Loss Gap' based on vehicle age and damage patterns."}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Financials & Contact */}
                        <div className="bg-slate-50/50 p-8 md:p-12">
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-8">
                                <h3 className="text-xs font-black text-slate-400 tracking-[0.25em] mb-4 uppercase">Valuation Scope</h3>
                                <div className="text-3xl font-black text-blue-900 mb-2">
                                    ${valuation.min?.toLocaleString() || '---'} - ${valuation.max?.toLocaleString() || '---'}
                                </div>
                                <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                                    ACV RECOVERY TARGET
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 tracking-[0.25em] uppercase">Claim Details</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold">Insurance</span>
                                        <span className="text-slate-800 font-black uppercase tracking-tighter">{lead.insurance_type === 'mine' ? 'First Party' : 'Third Party'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold">Attorney Reg?</span>
                                        <span className="text-slate-800 font-black">{lead.has_attorney ? 'YES' : 'NO'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold">Injury Claim</span>
                                        <span className="text-red-600 font-black">{lead.has_injuries ? 'YES' : 'NO'}</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-200 text-slate-900">
                                    <h3 className="text-xs font-black text-slate-400 tracking-[0.25em] uppercase mb-6">Contact Authority</h3>
                                    <div className="space-y-4">
                                        <button className="w-full bg-white border-2 border-blue-900 text-blue-900 font-black py-4 rounded-2xl hover:bg-blue-900 hover:text-white transition-all shadow-sm">
                                            VIEW PHONE NUMBER
                                        </button>
                                        <button className="w-full bg-blue-950 text-white font-black py-4 rounded-2xl shadow-xl hover:brightness-110 transition-all">
                                            PURCHASE LEAD FULL ACCESS
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Authority */}
                    <footer className="bg-slate-900 p-8 text-center text-white/40 text-[10px] font-bold tracking-widest uppercase border-t border-white/5">
                        TexasTotalLoss.com Proprietary Lead Intelligence • (C) 2026 • Verified Property Loss Intake
                    </footer>
                </div>
            </div>
        </div>
    );
}
