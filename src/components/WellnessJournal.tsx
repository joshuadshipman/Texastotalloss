'use client';

import React, { useState } from 'react';
import { Plus, Save, Calendar, Activity, AlertCircle, CheckCircle2, ClipboardList } from 'lucide-react';

interface JournalEntry {
    date: string;
    painLevel: number;
    notes: string;
    treatment: string;
}

export default function WellnessJournal() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<JournalEntry>({
        date: new Date().toISOString().split('T')[0],
        painLevel: 5,
        notes: '',
        treatment: ''
    });

    const handleSave = () => {
        setEntries([formData, ...entries]);
        setShowForm(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            painLevel: 5,
            notes: '',
            treatment: ''
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto my-12 bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-white/10">
                        <Activity className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">Wellness Journal</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Daily Case Documentation</p>
                    </div>
                </div>
                {!showForm && (
                  <button 
                      onClick={() => setShowForm(true)}
                      className="bg-primary text-white p-3 rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20"
                  >
                      <Plus size={24} />
                  </button>
                )}
            </div>

            <div className="p-8">
                {showForm ? (
                    <div className="animate-in slide-in-from-top-4 duration-500 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Visit Date</label>
                                <input 
                                    type="date" 
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pain Level (1-10)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="10"
                                    value={formData.painLevel}
                                    onChange={(e) => setFormData({...formData, painLevel: parseInt(e.target.value)})}
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Treatment / Meds Today</label>
                            <input 
                                type="text" 
                                placeholder="Physical Therapy, MRI, Pain Meds..."
                                value={formData.treatment}
                                onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Symptoms & Impact Notes</label>
                            <textarea 
                                rows={3}
                                placeholder="Difficulty sleeping, missed work, radiating pain..."
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowForm(false)}
                                className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-2 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
                            >
                                <Save size={18} className="text-primary" />
                                Save Evidence
                            </button>
                        </div>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-medium">No journal entries yet.</p>
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">Start documenting your case today</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {entries.map((entry, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex gap-6 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-1 bg-primary h-full opacity-50" />
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2">
                                        <span className="text-lg font-black text-slate-900">{entry.painLevel}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">PAIN</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={14} className="text-primary" />
                                        <span className="text-sm font-black text-slate-900">{entry.date}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600 mb-1">{entry.treatment}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed italic">"{entry.notes}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
                    <p className="text-[10px] font-bold text-slate-500 leading-tight">
                        Daily documentation makes it SIGNIFICANTLY harder for insurance adjusters to fight your injury claim.
                    </p>
                </div>
            </div>
        </div>
    );
}
