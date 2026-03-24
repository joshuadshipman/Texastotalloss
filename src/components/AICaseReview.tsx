'use client';

import { Shield, FileText, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import EvidenceUploader from './EvidenceUploader';
import { Dictionary } from '@/dictionaries/en';

interface AICaseReviewProps {
  leadId: string | number;
  userName: string;
  dict: Dictionary;
}

export default function AICaseReview({ leadId, userName, dict }: AICaseReviewProps) {
  const t = dict.ai_review;
  if (!t) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header with Authority Branding */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Shield className="h-32 w-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {t.active}
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight">
              {t.greeting.replace('{name}', userName.split(' ')[0])}
            </h1>
            <p className="text-slate-400 mt-4 max-w-md font-medium">
              {t.subtitle}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
            <div className="text-center">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{t.integrity}</div>
              <div className="text-4xl font-black text-blue-400">92%</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase font-black">{t.needs_evidence}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Evidence Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100 transition-all hover:bg-slate-50">
          <EvidenceUploader 
            leadId={leadId} 
            category="vin" 
            label={t.categories.vin} 
          />
        </div>

        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100 transition-all hover:bg-slate-50">
          <EvidenceUploader 
            leadId={leadId} 
            category="front" 
            label={t.categories.front} 
          />
        </div>
        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-100 transition-all hover:bg-slate-50">
          <EvidenceUploader 
            leadId={leadId} 
            category="side" 
            label={t.categories.side} 
          />
        </div>
      </div>

      {/* Document & Injury Suite */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-none">{t.categories.police_report}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">Critical for 3rd-party liability</p>
            </div>
          </div>
          <EvidenceUploader 
            leadId={leadId} 
            category="police_report" 
          />
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:bg-slate-50 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-none">{t.categories.injury}</h3>
              <p className="text-xs text-slate-400 mt-2 font-medium">Confidentially stored for counsel</p>
            </div>
          </div>
          <EvidenceUploader 
            leadId={leadId} 
            category="injury" 
          />
        </div>
      </div>

      {/* Commitments & Trust */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-4 text-slate-400 text-sm font-bold">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <span>Trusted by 1,200+ Texas Claimants</span>
        </div>
      </div>
    </div>
  );
}
