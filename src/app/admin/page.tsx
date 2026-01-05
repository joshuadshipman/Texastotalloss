'use client';

import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import {
    SearchIcon, FilterIcon, RefreshCwIcon, DownloadIcon,
    CheckCircleIcon, AlertTriangleIcon, FileTextIcon,
    MessageSquareIcon, MapPinIcon, LayoutGridIcon
} from 'lucide-react';
import AdminChatGrid from '@/components/admin/AdminChatGrid';
import BlogManagement from '@/components/admin/BlogManagement';
import ContentLibraryManager from '@/components/admin/ContentLibraryManager';

// Type definition matches our SQL schema
// Type definition matches our SQL schema
type Lead = {
    id: string;
    created_at: string;
    full_name: string;
    phone: string;
    email?: string; // New
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
    vehicle_info?: string; // New
    insurance_carrier?: string; // New
};

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'leads' | 'content'>('leads');


    // Filters
    const [filterLang, setFilterLang] = useState<'all' | 'en' | 'es'>('all');
    const [filterScore, setFilterScore] = useState<'all' | 'high' | 'prospect'>('all');

    // Selected Lead for Modal
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Active Chat Grid State (List of Session IDs)
    const [activeSessions, setActiveSessions] = useState<string[]>(['', '', '', '']); // 4 Fixed Slots

    // Handlers for Grid
    const handleOpenSlot = (sessionId: string) => {
        // Check if already active
        if (activeSessions.includes(sessionId)) return;

        // Find first empty slot
        const emptyIndex = activeSessions.findIndex(s => s === '');
        if (emptyIndex !== -1) {
            const newSessions = [...activeSessions];
            newSessions[emptyIndex] = sessionId;
            setActiveSessions(newSessions);
        } else {
            // If full, replace the First slot (Queue-like or ask user later) - For now simple FIFO replacement or alert
            const confirm = window.confirm("Slots full. Replace slot 1?");
            if (confirm) {
                const newSessions = [...activeSessions];
                newSessions[0] = sessionId;
                setActiveSessions(newSessions);
            }
        }
    };

    const handleMinimizeSlot = (sessionId: string) => {
        // Just visual minimization handled in child? Or effectively "close" from grid but keep state?
        // For now, let's treat minimize as "Close from Grid" to free up slot
        handleCloseSlot(sessionId);
    };

    const handleCloseSlot = (sessionId: string) => {
        const newSessions = activeSessions.map(s => s === sessionId ? '' : s);
        setActiveSessions(newSessions);
    };

    const handleLogin = () => {
        if (pin === '1234') setIsAuthenticated(true);
        else alert('Invalid PIN');
    };

    const fetchLeads = async () => {
        setLoading(true);
        try {
            // Fetch from Admin API (Bypasses RLS & gets all sessions, not just completed leads)
            const res = await fetch('/api/admin/get-chat-sessions', { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch sessions');

            const { sessions } = await res.json();

            // Map session data to Lead-like structure for the UI
            const mappedSessions = sessions.map((s: any) => ({
                id: s.id || s.session_id,
                created_at: s.created_at,
                dialogflow_session_id: s.session_id,
                status: s.status, // bot or live

                // Extract from user_data JSON
                full_name: s.user_data?.full_name || 'Anonymous Visitor',
                phone: s.user_data?.phone || 'No Phone',
                email: s.user_data?.email || '', // New
                language: s.user_data?.language || 'en',
                score: s.user_data?.score || 0,
                pain_level: s.user_data?.pain_level || 0,
                city: s.user_data?.city || 'Unknown',
                injury_summary: s.user_data?.injury_summary || '',
                description: s.user_data?.description || '',
                preferred_contact_time: s.user_data?.best_time || '',
                liability_summary: s.user_data?.fault === 'other' ? 'Not at fault' : (s.user_data?.fault === 'me' ? 'At fault' : ''),

                // Fix: Check for explicit accident_date first, then fallback or empty. Don't use 'year' as date.
                accident_date: s.user_data?.accident_date || '',

                vehicle_info: s.user_data?.vehicle_info || '', // New
                insurance_carrier: s.user_data?.insurance_carrier || '', // New

                files_count: 0 // TODO: Check storage buckets if needed
            }));

            setLeads(mappedSessions);
        } catch (e) {
            console.error('Error fetching leads:', e);
            alert('Failed to load sessions. Please try refreshing.');
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
        <div className="flex h-screen items-center justify-center bg-slate-50 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-96 border border-slate-200 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="bg-blue-900 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl shadow-md">TTL</div>
                </div>
                <h1 className="text-2xl font-black mb-2 text-slate-900">Admin Access</h1>
                <p className="text-sm text-slate-500 mb-6">Enter secure PIN to access dashboard.</p>
                <input
                    type="password"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none p-4 rounded-xl w-full mb-4 text-center text-3xl tracking-[1em] font-bold text-slate-800 placeholder:text-slate-200 transition-all"
                    placeholder="••••"
                    autoFocus
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-xl w-full font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                >
                    Unlock Dashboard
                </button>
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
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('leads')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'leads' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Leads & Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'content' ? 'bg-white shadow text-gold-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Video Library
                            </button>
                        </div>
                        <button onClick={fetchLeads} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" title="Refresh">
                            <RefreshCwIcon size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-4 space-y-8">

                {activeTab === 'content' && <ContentLibraryManager />}

                {activeTab === 'leads' && (
                    <>
                        {/* 1. Live Command Center (Grid) */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                                    <MessageSquareIcon className="text-blue-600" /> Live Command Center
                                </h2>
                                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {activeSessions.length} Active / 4 Slots
                                </span>
                            </div>
                            <AdminChatGrid
                                activeSessions={activeSessions}
                                onMinimize={handleMinimizeSlot}
                                onClose={handleCloseSlot}
                            />
                        </div>

                        {/* 2. Comprehensive Session Data */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                    <FileTextIcon size={18} /> All Sessions ({leads.length})
                                </h3>

                                {/* Filters */}
                                <div className="flex items-center gap-2">
                                    <select
                                        value={filterLang}
                                        onChange={e => setFilterLang(e.target.value as any)}
                                        className="text-sm border rounded-lg px-3 py-2 bg-white"
                                    >
                                        <option value="all">Every Language</option>
                                        <option value="en">English Only</option>
                                        <option value="es">Spanish Only</option>
                                    </select>
                                    <select
                                        value={filterScore}
                                        onChange={e => setFilterScore(e.target.value as any)}
                                        className="text-sm border rounded-lg px-3 py-2 bg-white"
                                    >
                                        <option value="all">All Scores</option>
                                        <option value="high">High Value (70+)</option>
                                        <option value="prospect">Prospects (&lt;70)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Session / Date</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Score</th>
                                            <th className="px-6 py-4">Last Activity</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredLeads.map((lead) => (
                                            <tr key={lead.id} className="hover:bg-blue-50/30 transition group">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs text-gray-400 block mb-1">#{lead.dialogflow_session_id?.substring(0, 8)}</span>
                                                    <div className="text-gray-900 font-medium">
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{lead.full_name || 'Anonymous'}</div>
                                                    <div className="text-gray-500 text-xs">{lead.phone || 'No Phone'}</div>
                                                    {lead.language === 'es' && <span className="inline-block mt-1 bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded font-bold">ES</span>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${activeSessions.includes(lead.dialogflow_session_id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {activeSessions.includes(lead.dialogflow_session_id) ? '● Live Now' : '○ Offline'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <ScoreBadge score={lead.score} />
                                                </td>
                                                <td className="px-6 py-4 max-w-xs truncate text-gray-500 italic">
                                                    {lead.injury_summary || "Start of conversation..."}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-100">
                                                        <button
                                                            onClick={() => handleOpenSlot(lead.dialogflow_session_id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-400 transition"
                                                            title="Open in Command Center"
                                                        >
                                                            <MessageSquareIcon size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedLead(lead)}
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded border border-gray-200 transition"
                                                            title="View Full Details"
                                                        >
                                                            <FileTextIcon size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
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
                                    {selectedLead.email && <p className="text-sm text-blue-600">{selectedLead.email}</p>}
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

                            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-3 text-sm uppercase">Vehicle & Insurance</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-blue-400 uppercase">Vehicle</label>
                                        <div className="font-mono text-sm font-medium text-slate-700">{selectedLead.vehicle_info || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-blue-400 uppercase">Insurance</label>
                                        <div className="text-sm font-medium text-slate-700">{selectedLead.insurance_carrier || 'N/A'}</div>
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
                                <button onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded hover:bg-gray-300">Close</button>
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
