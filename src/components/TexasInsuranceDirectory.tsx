'use client';

import React, { useState } from 'react';
import { Search, Phone, ExternalLink, ShieldCheck, HelpCircle, MapPin } from 'lucide-react';

const INSURANCE_COMPANIES = [
    { name: "State Farm", phone: "1-800-782-8332", site: "statefarm.com", totalLossDept: "877-627-5757", rating: "A+" },
    { name: "Allstate", phone: "1-800-255-7828", site: "allstate.com", totalLossDept: "800-478-2950", rating: "A" },
    { name: "Progressive", phone: "1-800-776-4737", site: "progressive.com", totalLossDept: "877-272-3580", rating: "A+" },
    { name: "GEICO", phone: "1-800-841-3000", site: "geico.com", totalLossDept: "800-521-2748", rating: "A++" },
    { name: "Liberty Mutual", phone: "1-800-290-8711", site: "libertymutual.com", totalLossDept: "800-225-2467", rating: "A" },
    { name: "Texas Farm Bureau", phone: "1-800-266-5458", site: "txfb-ins.com", totalLossDept: "1-800-224-7936", rating: "A" },
    { name: "USAA", phone: "1-800-531-8722", site: "usaa.com", totalLossDept: "800-531-8222", rating: "A++" },
    { name: "Farmers Insurance", phone: "1-800-435-7637", site: "farmers.com", totalLossDept: "800-435-7637", rating: "A" },
    { name: "AAA Texas", phone: "1-800-222-7623", site: "aaa.com", totalLossDept: "800-222-7623", rating: "A" }
];

export default function TexasInsuranceDirectory() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCompanies = INSURANCE_COMPANIES.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-6">
                            <MapPin className="w-4 h-4" />
                            Official Texas Claims Directory
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            Fighting your insurance company? <span className="text-primary italic">Start here.</span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Access verified contact details for every major insurer operating in Texas. Optimized for compliance with <strong>Texas Insurance Code 542.003</strong>.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text"
                            placeholder="Search your insurance company..."
                            className="w-full pl-12 pr-6 py-5 bg-white border-2 border-slate-200 rounded-[1.5rem] focus:border-primary outline-none shadow-sm transition-all font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {filteredCompanies.map((company, idx) => (
                        <div key={idx} className="group bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-primary/20 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full border border-slate-100">
                                    AM BEST: {company.rating}
                                </span>
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-6 group-hover:text-primary transition-colors">{company.name}</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Claims Line</p>
                                        <p className="font-bold text-slate-700">{company.phone}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover/item:bg-accent/10 group-hover/item:text-accent transition-colors">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Loss Dept</p>
                                        <p className="font-bold text-slate-700">{company.totalLossDept}</p>
                                    </div>
                                </div>
                            </div>

                            <a 
                                href={`https://${company.site}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 hover:bg-primary text-slate-600 hover:text-white rounded-xl font-bold transition-all border border-slate-100 hover:border-primary"
                            >
                                {company.site}
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="bg-primary p-12 rounded-[3rem] text-white text-center relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
                        <HelpCircle className="w-16 h-16 text-white/20 mb-8" />
                        <h3 className="text-3xl font-black mb-6 leading-tight">Can't find your insurer or facing a delay?</h3>
                        <p className="text-lg text-white/80 mb-10 leading-relaxed font-medium">
                            Texas Law requires insurers to acknowledge your claim within 15 days of notification. If they are silent, they may be in violation of <strong>Statute 542.003</strong>.
                        </p>
                        <button className="bg-accent text-white font-black px-12 py-5 rounded-[1.5rem] shadow-3xl hover:brightness-110 transition-all text-lg active:scale-95">
                            REPORT STATUTORY VIOLATION »
                        </button>
                    </div>
                    {/* Background SVG Decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-full h-full flex items-center justify-center text-[30rem] font-black">
                        542
                    </div>
                </div>
            </div>
        </section>
    );
}
