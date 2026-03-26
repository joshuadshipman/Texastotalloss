'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Phone, Shield, ArrowLeft, Calculator, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import RightsGuide from '@/components/RightsGuide';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

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

export default function VsfDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const lang = params.lang as string;

    const [vsf, setVsf] = useState<VsfLocation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVsf() {
            try {
                const vsfDoc = doc(db, 'vsf_locations', id);
                const snapshot = await getDoc(vsfDoc);
                
                if (snapshot.exists()) {
                    setVsf({ id: snapshot.id, ...snapshot.data() } as VsfLocation);
                } else {
                    // Fallback to mock search if not in DB
                    setVsf(MOCK_VSF_DATA.find(v => v.id === id) || null);
                }
            } catch (err) {
                // Silent fallback to mock
                setVsf(MOCK_VSF_DATA.find(v => v.id === id) || null);
            } finally {
                setLoading(false);
            }
        }
        fetchVsf();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!vsf) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Facility Not Found</h1>
                    <p className="text-slate-600 mb-8">We couldn't locate the storage facility you're looking for.</p>
                    <Link href={`/${lang}/vsf`} className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <Link href={`/${lang}/vsf`} className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-bold mb-6 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        BACK TO VSF DIRECTORY
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full tracking-widest uppercase">
                                    TDLR LICENSE: {vsf.tdlr_license}
                                </span>
                                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full tracking-widest uppercase">
                                    VERIFIED STATUS
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
                                {vsf.name}
                            </h1>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin size={20} className="text-blue-500" />
                                    <span className="font-medium">{vsf.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone size={20} className="text-blue-500" />
                                    <span className="font-bold">{vsf.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex flex-col gap-4">
                            <div className="bg-blue-600 text-white p-6 rounded-[2rem] shadow-xl shadow-blue-600/20">
                                <div className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Capped Storage Rate</div>
                                <div className="text-4xl font-black">${vsf.daily_rate}<span className="text-lg opacity-60">/day</span></div>
                                <p className="text-[10px] mt-2 opacity-80 leading-tight">
                                    *Statutory maximum for light-duty vehicles in Texas.
                                </p>
                            </div>
                            <Link 
                                href={`/${lang}/tools/storage-calculator?vsf=${vsf.id}`}
                                className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all active:scale-[0.98]"
                            >
                                <Calculator size={20} />
                                CALCULATE TOTAL FEES
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Rights Guide */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Your Legal Protection at this Facility</h2>
                            <p className="text-slate-500">Know the laws {vsf.name} must follow regarding your vehicle release.</p>
                        </div>
                        <RightsGuide />
                    </div>

                    {/* Right: Sidebar / Quick Actions */}
                    <div className="space-y-8">
                        {/* Statutory Warning */}
                        <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="text-amber-600" />
                                <h3 className="font-black text-amber-900 uppercase tracking-tight">Carrier Liability</h3>
                            </div>
                            <p className="text-sm text-amber-800 leading-relaxed mb-6">
                                If your vehicle is a <strong>Total Loss</strong>, the insurance company is responsible for these fees under <strong>TX Occ. Code § 2303.156</strong>.
                            </p>
                            <button className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-colors">
                                AUTO-NOTIFY CARRIER
                            </button>
                        </div>

                        {/* TDLR Quick Search */}
                        <div className="bg-slate-900 text-white p-6 rounded-[2rem]">
                            <h3 className="font-black uppercase tracking-wider text-xs text-slate-400 mb-4">Facility Verification</h3>
                            <a 
                                href="https://www.tdlr.texas.gov/vsf/vsf.htm" 
                                target="_blank" 
                                className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group"
                            >
                                <div className="text-sm">
                                    <div className="font-bold">Check Status on TDLR</div>
                                    <div className="text-[10px] opacity-60 uppercase tracking-widest">Official Texas Govt Site</div>
                                </div>
                                <ExternalLink size={20} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
