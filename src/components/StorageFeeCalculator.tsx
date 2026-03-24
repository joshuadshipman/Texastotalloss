'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, ShieldAlert, FileText, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StorageFeeCalculator() {
    const [towDate, setTowDate] = useState('');
    const [isOversized, setIsOversized] = useState(false);
    const [days, setDays] = useState(0);
    const [totals, setTotals] = useState({
        storage: 0,
        impound: 22.85,
        notification: 50.00,
        total: 0
    });

    const DAILY_RATE = isOversized ? 39.99 : 22.85;
    const IMPOUND_FEE = 22.85;
    const NOTIFICATION_FEE = 50.00;

    useEffect(() => {
        if (towDate) {
            const start = new Date(towDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDays(diffDays);

            const storageTotal = diffDays * DAILY_RATE;
            setTotals({
                storage: storageTotal,
                impound: IMPOUND_FEE,
                notification: NOTIFICATION_FEE,
                total: storageTotal + IMPOUND_FEE + NOTIFICATION_FEE
            });
        }
    }, [towDate, isOversized]);

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 mb-12">
            <div className="bg-slate-900 p-8 text-white relative flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="z-10">
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <Calculator className="text-accent" />
                        Storage Fee Facilitator
                    </h2>
                    <p className="text-slate-400 font-medium">Calculate your leverage under TX Occupations Code § 2303.156.</p>
                </div>
                <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">2023 Statutory Rates</span>
                </div>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <section>
                        <label className="block text-sm font-black text-slate-700 uppercase tracking-widest mb-4">When was your car towed?</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                            <input 
                                type="date" 
                                value={towDate}
                                onChange={(e) => setTowDate(e.target.value)}
                                className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-bold text-slate-700"
                            />
                        </div>
                    </section>

                    <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <label className="flex items-center gap-4 cursor-pointer">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    checked={isOversized}
                                    onChange={(e) => setIsOversized(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-all shadow-inner"></div>
                                <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all peer-checked:translate-x-6 shadow-md"></div>
                            </div>
                            <div>
                                <span className="font-bold text-slate-800">Vehicle exceeds 25 feet?</span>
                                <p className="text-xs text-slate-500">Commercial vehicles, trailers, or large RVs.</p>
                            </div>
                        </label>
                    </section>

                    {days > 3 && (
                        <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ShieldAlert className="text-amber-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-black text-amber-800 text-lg mb-1">High-Priority Alert</h4>
                                <p className="text-sm text-amber-700 leading-relaxed font-medium">
                                    Your vehicle has been in storage for <strong>{days} days</strong>. Under Texas Law, the insurance company is liable for these fees if the vehicle is a total loss.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between">
                    <div className="space-y-6">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm mb-6 border-b pb-4 border-slate-200">Fee Breakdown</h3>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-bold">Daily Storage ({days} days)</span>
                            <span className="font-mono font-bold">${totals.storage.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-bold">Impound Fee</span>
                            <span className="font-mono font-bold">${totals.impound.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-bold">Admin/Notification</span>
                            <span className="font-mono font-bold">${totals.notification.toFixed(2)}</span>
                        </div>
                        <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-slate-900 font-black text-xl">Total Estimate</span>
                            <span className="text-primary font-black text-3xl font-mono">${totals.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <button className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2 group">
                            GENERATE RELEASE NOTICE
                            <FileText size={18} className="group-hover:rotate-12 transition-transform" />
                        </button>
                        <p className="text-[10px] text-center text-slate-400 font-medium px-4">
                            Proceeding generates a statutory notice citing Texas occupations code 2303.156(b) for your insurance adjuster.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50 p-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900">Carrier Liability Mandate</p>
                        <p className="text-xs text-slate-500">Statutory authority verified for the State of Texas.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-accent w-3/4 animate-pulse"></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AEO Optimized Asset</span>
                </div>
            </div>
        </div>
    );
}
