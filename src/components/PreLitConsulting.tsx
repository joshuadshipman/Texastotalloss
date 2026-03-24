'use client';

import React from 'react';
import { Brain, Zap, ClipboardCheck, BarChart3, Users, ChevronRight, Gavel, ShieldCheck } from 'lucide-react';

export default function PreLitConsulting() {
    return (
        <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] pointer-events-none" />
            
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black tracking-widest uppercase text-accent mb-8">
                        <Zap size={14} />
                        B2B Enterprise Solution
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                        Two Ways to <br />
                        <span className="text-primary italic">Scale Your Firm.</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed">
                        Whether you need high-conversion leads or a more efficient intake team, TTL provides the AI-first technology to dominate the Texas total loss market.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                            <Users size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">1. Premium Lead Gen</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Stop chasing bad phone numbers. Buy high-intent case files with VIN decoding and damage photos already processed.
                        </p>
                    </div>

                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group border-primary/30">
                        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform">
                            <Brain size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">2. Intake Training</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            We train your staff to use TTL tech to reduce overhead and determine case value weeks before the typical 60-day mark.
                        </p>
                    </div>

                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Evidence Mastery</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Lock in value instantly by capturing aftermarket items and police reports at the point of first contact.
                        </p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary to-secondary p-1 rounded-[3rem]">
                    <div className="bg-slate-900 rounded-[2.8rem] p-12 md:p-20 relative overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-4xl font-black mb-8 leading-tight">
                                    How Your Firm Wins <br />
                                    <span className="text-accent underline decoration-4 underline-offset-8">In the AI Era</span>
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                                            <ChevronRight size={14} className="text-accent" />
                                        </div>
                                        <p className="text-slate-300 font-medium">Empower staff with tools that handle 80% of data entry.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                                            <ChevronRight size={14} className="text-accent" />
                                        </div>
                                        <p className="text-slate-300 font-medium">Preserve "Best Case" evidence at the point of impact.</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-1">
                                            <ChevronRight size={14} className="text-accent" />
                                        </div>
                                        <p className="text-slate-300 font-medium">White-label specialized intake for your existing team.</p>
                                    </div>
                                </div>
                                <button className="mt-12 bg-white text-slate-900 font-black px-10 py-5 rounded-2xl hover:bg-accent hover:text-white transition-all text-lg flex items-center gap-3 active:scale-95">
                                    REQUEST FIRM AUDIT
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                                    <div className="text-4xl font-black text-primary mb-2">60%</div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-balance">Energy Saved</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                                    <div className="text-4xl font-black text-accent mb-2">100%</div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-balance">Evidence Capture</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                                    <div className="text-4xl font-black text-blue-400 mb-2">+22%</div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-balance">Avg Case Value</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                                    <div className="text-4xl font-black text-slate-200 mb-2">0</div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-balance">Friction Score</p>
                                </div>
                            </div>
                        </div>

                        {/* Authority Floaties */}
                        <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none rotate-12">
                            <Gavel size={300} />
                        </div>
                        <div className="absolute top-10 left-10 opacity-5 pointer-events-none -rotate-12">
                            <ShieldCheck size={200} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
