'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import {
    SearchIcon, FilterIcon, RefreshCwIcon, DownloadIcon,
    CheckCircleIcon, AlertTriangleIcon, FileTextIcon,
    MessageSquareIcon, MapPinIcon
} from 'lucide-react';

// Type definition matches our SQL schema
type Lead = {
    id: string;
    created_at: string;
    full_name: string;
    phone: string;
    language: 'en' | 'es';
    score: number;
    pain_level: number;
    city: string;
    injury_summary: string;
    status: string;
    description: string;
    files_count: number;
    dialogflow_session_id: string; // link to chat
    preferred_contact_time?: string;
    liability_summary?: string;
    accident_date?: string;
};

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    // Filters
    const [filterLang, setFilterLang] = useState<'all' | 'en' | 'es'>('all');
    const [filterScore, setFilterScore] = useState<'all' | 'high' | 'prospect'>('all');

    // Selected Lead for Modal
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const handleLogin = () => {
        if (pin === '1234') setIsAuthenticated(true);
        else alert('Invalid PIN');
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabaseClient
                .from('total_loss_leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setLeads(data);
        } catch (e) {
            console.error('Error fetching leads:', e);
            alert('Failed to load leads from database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchLeads();
    }, [isAuthenticated]);

    // Derived States
    const filteredLeads = leads.filter(l => {
        if (filterLang !== 'all' && l.language !== filterLang) return false;
        if (filterScore === 'high' && l.score <= 70) return false;
        if (filterScore === 'prospect' && l.score > 70) return false;
        return true;
    });

    const stats = {
        total: leads.length,
        highValue: leads.filter(l => l.score > 70).length,
        spanish: leads.filter(l => l.language === 'es').length,
        newToday: leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length
    };

    if (!isAuthenticated) return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-xl font-bold mb-4 text-blue-900">Texas Total Loss Admin</h1>
                <p className="text-sm text-gray-500 mb-4">Enter secure PIN to access dashboard.</p>
                <input
                    type="password"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                    placeholder="PIN"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button onClick={handleLogin} className="bg-blue-900 text-white p-2 rounded w-full font-bold">Access Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white p-1 rounded font-bold text-xs">TTL</span>
                        <h1 className="font-bold text-lg text-gray-800">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchLeads} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Refresh">
                            <RefreshCwIcon size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Leads" value={stats.total} />
                    <StatCard label="Actionable (>70%)" value={stats.highValue} color="text-green-600" />
                    <StatCard label="Spanish Leads" value={stats.spanish} color="text-orange-600" />
                    <StatCard label="New Today" value={stats.newToday} color="text-blue-600" />
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative">
                            <FilterIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                            <select
                                value={filterLang}
                                onChange={e => setFilterLang(e.target.value as any)}
                                className="pl-10 pr-8 py-2 border rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">All Languages</option>
                                <option value="en">English (EN)</option>
                                <option value="es">Spanish (ES)</option>
                            </select>
                        </div>
                        <div className="relative">
                            <select
                                value={filterScore}
                                onChange={e => setFilterScore(e.target.value as any)}
                                className="pl-4 pr-8 py-2 border rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="all">All Scores</option>
                                <option value="high">High Value (70+)</option>
                                <option value="prospect">Prospects (&lt;70)</option>
                            </select>
                        </div>
                    </div>
                    {/* Placeholder for Search - implement if needed */}
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Name / Contact</th>
                                    <th className="px-6 py-4">Status / Score</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Injury Summary</th>
                                    <th className="px-6 py-4">Lang</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-blue-50/50 transition">
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(lead.created_at).toLocaleDateString()}<br />
                                            <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{lead.full_name}</div>
                                            <div className="text-gray-500">{lead.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <ScoreBadge score={lead.score} />
                                            {lead.files_count > 0 && (
                                                <div className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    <FileTextIcon size={12} /> {lead.files_count} Files
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <MapPinIcon size={14} className="text-gray-400" />
                                                {lead.city || 'Unknown'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-gray-600" title={lead.injury_summary}>
                                            {lead.injury_summary || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.language === 'es' ? (
                                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-bold">ES</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">EN</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedLead(lead)}
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400">
                                            No leads found matching current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLead(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b flex justify-between items-start bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold">{selectedLead.full_name}</h2>
                                <p className="text-sm text-gray-500">ID: {selectedLead.id} | Session: {selectedLead.dialogflow_session_id}</p>
                            </div>
                            <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-light">&times;</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Contact</label>
                                    <p className="font-medium">{selectedLead.phone}</p>
                                    <p className="text-sm text-gray-600">Best Time: {selectedLead.preferred_contact_time || 'Anytime'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Score Analysis</label>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-black">{selectedLead.score}%</div>
                                        <ScoreBadge score={selectedLead.score} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg border">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Pain Level</label>
                                        <div className={`mt-1 font-bold ${selectedLead.pain_level > 6 ? 'text-red-600' : 'text-gray-700'}`}>
                                            {selectedLead.pain_level}/10
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Accident Date</label>
                                        <div className="mt-1">{selectedLead.accident_date || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Injuries</label>
                                        <p className="text-gray-800">{selectedLead.injury_summary || "None reported"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Liability Note</label>
                                        <p className="text-gray-800">{selectedLead.liability_summary || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Incident Description</label>
                                        <p className="text-sm text-gray-600 italic whitespace-pre-wrap">{selectedLead.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Files Section could go here if we had link data stored, currently files_count is int */}
                            {selectedLead.files_count > 0 && (
                                <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg flex items-center gap-3">
                                    <FileTextIcon className="text-blue-500" />
                                    <div>
                                        <p className="font-bold text-blue-900">{selectedLead.files_count} Documents Uploaded</p>
                                        <p className="text-xs text-blue-700">Check Supabase Storage bucket 'vehicle-photos' under folder associated with this session.</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <a href={`tel:${selectedLead.phone}`} className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700">Call Now</a>
                                <button onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, color = 'text-gray-900' }: { label: string, value: number, color?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center hover:shadow-md transition">
            <div className={`text-4xl font-extrabold ${color} mb-1`}>{value}</div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
        </div>
    );
}

function ScoreBadge({ score }: { score: number }) {
    if (score >= 80) return <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold"><CheckCircleIcon size={12} /> High ({score})</span>;
    if (score >= 50) return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold"><AlertTriangleIcon size={12} /> Med ({score})</span>;
    return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Low ({score})</span>;
}
