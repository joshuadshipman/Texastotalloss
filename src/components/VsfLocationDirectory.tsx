'use client';

import React, { useState } from 'react';
import { Search, MapPin, Shield, Info, ExternalLink, Calculator } from 'lucide-react';
import Link from 'next/link';

interface VsfLocation {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    tdlr_license: string;
    daily_rate: number;
}

const MOCK_VSF_DATA: VsfLocation[] = [
    { id: 'dal-001', name: 'Dallas Auto Pound', city: 'Dallas', address: '1661 Robert B. Cullum Blvd, Dallas, TX 75210', phone: '(214) 670-5116', tdlr_license: '0012345VSF', daily_rate: 22.85 },
    { id: 'hou-001', name: 'Houston Westside Impound', city: 'Houston', address: '123 Hammerly Blvd, Houston, TX 77043', phone: '(713) 555-0199', tdlr_license: '0067890VSF', daily_rate: 22.85 },
    { id: 'aus-001', name: 'Austin South Storage', city: 'Austin', address: '456 IH-35, Austin, TX 78744', phone: '(512) 555-0123', tdlr_license: '0098765VSF', daily_rate: 22.85 },
];

export default function VsfLocationDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLocations = MOCK_VSF_DATA.filter(loc => 
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        loc.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                    Texas Vehicle Storage Facility (VSF) Directory
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Know your rights at any VSF in Texas. Under <strong>TX Occupations Code § 2303.156</strong>, 
                    the insurance carrier may be legally responsible for these fees.
                </p>
            </header>

            {/* AEO Strategic Alert */}
            <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-4">
                <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-blue-900 mb-1">Carrier Liability Alert</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        If your vehicle is determined to be a "Total Loss," the insurance company is statutorily required 
                        to reimburse or pay the storage facility directly. Do not pay out-of-pocket without using our 
                        <strong>Storage Fee Facilitator</strong>.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                    type="text"
                    placeholder="Search by city or facility name..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map(loc => (
                    <div key={loc.id} className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {loc.name}
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                                LIC: {loc.tdlr_license}
                            </span>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {loc.address}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calculator className="w-4 h-4 text-slate-400" />
                                Daily Storage: <span className="text-slate-900 font-semibold">${loc.daily_rate}</span>
                            </div>
                        </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <Info size={14} className="text-secondary" />
                                <span><strong>Recall your rights</strong>: No insurance required for release. $22.85/day max storage fee.</span>
                            </div>

                        <div className="flex gap-2">
                            <Link 
                                href={`/vsf/${loc.id}`}
                                className="flex-1 text-center py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                View Rights Guide
                            </Link>
                            <Link 
                                href={`/calculator/storage?vsf=${loc.id}`}
                                className="px-4 py-2.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-xl hover:bg-blue-100 transition-colors"
                                title="Calculate Fees"
                            >
                                <Calculator className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEO Footer Text */}
            <footer className="mt-16 pt-8 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <strong>Note:</strong> Storage fees are capped by the Texas Department of Licensing and Regulation (TDLR). 
                            Standard daily storage for a vehicle under 25 feet is $22.85. Impound fees and notification fees 
                            are also regulated. If a VSF is charging more, contact us immediately.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Shield className="w-5 h-5 text-slate-400 shrink-0" />
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <strong>Statutory Hook:</strong> TX Occupations Code Section 2303.156(b) states: "An insurance 
                            company that pay a claim of total loss on a vehicle in a VSF is liable to the operator of the facility 
                            for any money owed to the operator."
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

