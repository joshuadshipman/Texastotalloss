'use client';

import React, { useState } from 'react';
import { Search, MapPin, Phone, ShieldCheck, Star, Activity, Warehouse } from 'lucide-react';

interface Provider {
    id: string;
    name: string;
    type: 'Medical' | 'Therapy' | 'Storage' | 'Imaging';
    address: string;
    city: string;
    zip: string;
    rating: number;
    specialty: string;
    acceptsLop: boolean;
    avgSettlement: number;
    costPerLead: number;
    conversionRate: string;
}

const MOCK_PROVIDERS: Provider[] = [
    { id: '1', name: 'North Texas Orthopedics', type: 'Medical', address: '123 Main St', city: 'Dallas', zip: '75201', rating: 4.9, specialty: 'Spinal / Ortho', acceptsLop: true, avgSettlement: 18500, costPerLead: 450, conversionRate: '32%' },
    { id: '2', name: 'Lone Star Physical Therapy', type: 'Therapy', address: '456 Oak Ln', city: 'Arlington', zip: '76010', rating: 4.8, specialty: 'Rehab', acceptsLop: true, avgSettlement: 9200, costPerLead: 220, conversionRate: '45%' },
    { id: '3', name: 'Elite Vehicle Storage & Recovery', type: 'Storage', address: '789 Industrial Way', city: 'Fort Worth', zip: '76102', rating: 4.7, specialty: 'Heavy Duty', acceptsLop: true, avgSettlement: 3500, costPerLead: 150, conversionRate: '88%' },
    { id: '4', name: 'Dallas Advanced Imaging', type: 'Imaging', address: '101 Medical Dr', city: 'Dallas', zip: '75235', rating: 4.9, specialty: 'MRI / CT', acceptsLop: true, avgSettlement: 2100, costPerLead: 95, conversionRate: '92%' },
    { id: '5', name: 'Southwest Trauma Rehab', type: 'Therapy', address: '202 Repair Rd', city: 'Houston', zip: '77002', rating: 4.6, specialty: 'Neurology', acceptsLop: true, avgSettlement: 24000, costPerLead: 600, conversionRate: '28%' },
];

export default function LopProviderPortal() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Medical' | 'Storage' | 'Therapy'>('All');
    const [preferences, setPreferences] = useState<Record<string, 'Preferred' | 'Excluded' | 'Normal'>>({});

    const togglePreference = (id: string, status: 'Preferred' | 'Excluded' | 'Normal') => {
        setPreferences(prev => ({ ...prev, [id]: status }));
    };

    const filtered = MOCK_PROVIDERS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.zip.includes(search);
        const matchesType = filterType === 'All' || p.type === filterType;
        const isExcluded = preferences[p.id] === 'Excluded';
        return matchesSearch && matchesType && !isExcluded;
    });

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">LOP Provider Portal</h2>
                            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">Verified Treatment & Storage Marketplace</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-slate-800 text-[10px] font-black uppercase rounded-lg border border-slate-700 hover:border-primary transition-all">
                            Export My List
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by Provider Name or Zip Code..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Medical', 'Therapy', 'Storage'].map(type => (
                            <button 
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(p => {
                        const status = preferences[p.id] || 'Normal';
                        return (
                            <div key={p.id} className={`p-4 border ${status === 'Preferred' ? 'border-primary bg-primary/5' : 'border-slate-100 bg-slate-50/50'} hover:border-primary/30 rounded-2xl transition-all group`}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${p.type === 'Medical' ? 'bg-blue-100 text-blue-600' : p.type === 'Storage' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                                            {p.type === 'Medical' || p.type === 'Imaging' ? <Activity size={16} /> : <Warehouse size={16} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">{p.name}</h3>
                                                {status === 'Preferred' && <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded uppercase">Preferred</span>}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                        <Star size={12} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-slate-700">{p.rating}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                    <MapPin size={12} className="text-slate-400" />
                                    <span>{p.address}, {p.city}, TX {p.zip}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-6 bg-white p-3 rounded-xl border border-slate-100">
                                    <div className="text-center border-r border-slate-50">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg. Settlement</p>
                                        <p className="text-xs font-black text-slate-900">${p.avgSettlement.toLocaleString()}</p>
                                    </div>
                                    <div className="text-center border-r border-slate-50">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Cost</p>
                                        <p className="text-xs font-black text-primary">${p.costPerLead}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                                        <p className="text-xs font-black text-green-600">{p.conversionRate}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                        Send Case Referral
                                    </button>
                                    <div className="flex border border-slate-200 rounded-xl overflow-hidden">
                                        <button 
                                            onClick={() => togglePreference(p.id, status === 'Preferred' ? 'Normal' : 'Preferred')}
                                            className={`px-3 transition-colors ${status === 'Preferred' ? 'bg-primary text-white' : 'hover:bg-primary/10 text-slate-400'}`}
                                            title="Mark as Preferred"
                                        >
                                            <ShieldCheck size={14} />
                                        </button>
                                        <button 
                                            onClick={() => togglePreference(p.id, 'Excluded')}
                                            className="px-3 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors border-l border-slate-200"
                                            title="Exclude Provider"
                                        >
                                            <Activity size={14} />
                                        </button>
                                    </div>
                                    <button className="px-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary hover:border-primary transition-all">
                                        <Phone size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-400 font-medium">No providers found in this area.</p>
                        <button onClick={() => {setSearch(''); setFilterType('All'); setPreferences({});}} className="text-primary font-bold text-xs mt-2 uppercase">Clear Filters & Preferences</button>
                    </div>
                )}
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-medium italic">
                    All listed providers have verified LOP acceptance policies for {new Date().getFullYear()}.
                </p>
            </div>
        </div>
    );
}

