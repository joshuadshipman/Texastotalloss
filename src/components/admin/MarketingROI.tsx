import React from 'react';
import { TrendingUpIcon } from 'lucide-react';

export type MarketingReport = {
    generated_at: string;
    total_spend: number;
    total_leads: number;
    cpa: number;
    roi: number;
    campaign_performance: Array<{
        name: string;
        spend: number;
        leads: number;
        cpa: number;
    }>;
};

interface MarketingROIProps {
    report: MarketingReport | null;
}

export default function MarketingROI({ report }: MarketingROIProps) {
    if (!report) return (
        <div className="flex items-center justify-center p-12 text-gray-500 italic">
            Gathering marketing data...
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Spend" value={report.total_spend} color="text-slate-900" isCurrency />
                <StatCard label="Total Leads" value={report.total_leads} color="text-blue-600" />
                <StatCard label="Avg CPA" value={report.cpa} color="text-red-600" isCurrency />
                <StatCard label="Est. ROI" value={report.roi * 100} color="text-emerald-600" isPercent />
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUpIcon className="text-emerald-500" /> Campaign Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.campaign_performance.map((c, i) => (
                        <div key={i} className="p-4 border rounded-lg hover:border-emerald-200 transition bg-slate-50/50">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-slate-800">{c.name}</div>
                                <div className="text-xs font-bold bg-slate-200 px-2 py-1 rounded">CPA: ${c.cpa.toFixed(0)}</div>
                            </div>
                            <div className="flex gap-4 text-sm text-slate-500">
                                <div>Spend: <span className="font-bold text-slate-700">${c.spend}</span></div>
                                <div>Leads: <span className="font-bold text-slate-700">{c.leads}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color = 'text-gray-900', isCurrency = false, isPercent = false }: { label: string, value: number, color?: string, isCurrency?: boolean, isPercent?: boolean }) {
    const displayValue = isCurrency 
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
        : isPercent 
            ? `${value.toFixed(1)}%`
            : value;

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition">
            <div className={`text-3xl font-extrabold ${color} mb-1`}>{displayValue}</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-tighter">{label}</div>
        </div>
    );
}
