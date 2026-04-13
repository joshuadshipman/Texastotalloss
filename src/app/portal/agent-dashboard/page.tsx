"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, TrendingUp, BrainCircuit, Activity, Target, Network, CheckCircle, Search, DollarSign } from 'lucide-react';

// Mock Data for Autonomous Goal Tracking
const performanceData = [
  { month: 'Jan', revenue: 4000, leads: 240 },
  { month: 'Feb', revenue: 6000, leads: 310 },
  { month: 'Mar', revenue: 11000, leads: 520 },
  { month: 'Apr', revenue: 18000, leads: 810 },
];

export default function AgenticDashboard() {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      
      {/* HEADER: Agentic Core Status */}
      <header className="mb-8 flex justify-between items-end border-b pb-6 border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <BrainCircuit className="text-indigo-600 h-8 w-8" />
            Autonomous Agent Strategy Core
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Objective: Maximize Revenue. Mitigate Legal Risk. Prioritize Independent Series Growth.
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
            <Activity className="h-4 w-4 animate-pulse" />
            Learning Agent: ACTIVE & OPTIMIZING
          </div>
        </div>
      </header>

      {/* TABS FOR WORKFLOWS vs METRICS */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('metrics')}
          className={`px-6 py-2 rounded-md font-bold transition-all ${activeTab === 'metrics' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}
        >
          Company Health & % To Goal
        </button>
        <button 
          onClick={() => setActiveTab('workflows')}
          className={`px-6 py-2 rounded-md font-bold transition-all ${activeTab === 'workflows' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}
        >
          Visual Processes & Agent Workflows
        </button>
      </div>

      {activeTab === 'metrics' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* COLUMN 1 & 2: KEY METRICS & PROGRESS */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-700 px-3 py-1 font-bold text-xs rounded-bl-lg">ON TRACK</div>
                <h3 className="text-slate-500 font-bold flex items-center gap-2 text-sm"><Target className="w-4 h-4"/> Q2 AEO DOMINANCE</h3>
                <p className="text-4xl font-black mt-2">68%</p>
                <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[68%]"></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 font-bold flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4"/> LEADS SOLD (MRR)</h3>
                <p className="text-4xl font-black mt-2">$24,500</p>
                <p className="text-sm text-emerald-600 font-bold mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3"/> +12% vs Last Month
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 px-3 py-1 font-bold text-xs rounded-bl-lg">FOCUS REQUIRED</div>
                <h3 className="text-slate-500 font-bold flex items-center gap-2 text-sm"><ShieldAlert className="w-4 h-4"/> UAT / QA PASS RATE</h3>
                <p className="text-4xl font-black mt-2">84%</p>
                <p className="text-sm text-amber-600 font-bold mt-2">Target: 95%+ Pass Rate</p>
              </div>
            </div>

            {/* Growth Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6 text-slate-800">Acquisition Velocity</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* COLUMN 3: AUTONOMOUS RESEARCH LIVE FEED */}
          <div className="bg-slate-900 rounded-xl p-6 text-slate-200 shadow-lg flex flex-col h-full border border-slate-700">
            <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-6">
              <Search className="w-5 h-5 text-indigo-400" />
              Live Autonomous Research
            </h3>
            <p className="text-sm text-slate-400 mb-6 border-b border-slate-700 pb-4">
              I am actively researching and adapting these parameters to ensure we hit our % goals legally and efficiently without your manual intervention.
            </p>
            
            <div className="space-y-6 flex-1">
              <div className="flex gap-4">
                <div className="mt-1"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div></div>
                <div>
                  <h4 className="font-bold text-white text-sm">AEO Schema Optimization</h4>
                  <p className="text-xs text-slate-400 mt-1">Researching Google's Q2 2026 AI Algorithm updates to ensure our Answer-First headers rank above competitors in zero-click spaces.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Lead Form Friction Removal</h4>
                  <p className="text-xs text-slate-400 mt-1">Analyzing drop-off rates on the "Coverage Eligibility Quiz". Drafting split tests to calculate if moving "Fault" question to step 2 increases conversions.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1"><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Legal Compliance / Series Firewalling</h4>
                  <p className="text-xs text-slate-400 mt-1">Scanning Texas State Bar latest guidelines to ensure our SMS "Case Handoff" language maintains strict liability separation between our LeadGen Series and the Partner Firms.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* VISUAL PROCESSES TAB */
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black mb-6 border-b pb-4 flex items-center gap-3">
               <Network className="text-indigo-600 w-6 h-6"/>
               The TTL Infographic Process 
            </h2>
            
            <div className="space-y-12">
              {/* FLOW 1 */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 bg-slate-100 p-3 rounded-lg flex items-center gap-2">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                  AEO Discovery to Monetization Funnel
                </h3>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex flex-col md:flex-row items-center justify-between text-center gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm w-full md:w-1/5 border border-indigo-100">
                      <p className="font-bold text-indigo-700 text-sm">AI Search Match</p>
                      <p className="text-xs text-slate-500 mt-1">Gemini / Perplexity</p>
                    </div>
                    <div className="text-slate-400 font-bold">→</div>
                    <div className="bg-white p-4 rounded-lg shadow-sm w-full md:w-1/5 border border-indigo-100">
                      <p className="font-bold text-indigo-700 text-sm">Calculators</p>
                      <p className="text-xs text-slate-500 mt-1">Valuation / ACV</p>
                    </div>
                    <div className="text-slate-400 font-bold">→</div>
                    <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-md w-full md:w-1/5">
                      <p className="font-bold text-sm">Coverage Quiz</p>
                      <p className="text-xs mt-1 text-indigo-200">Injury & Setup</p>
                    </div>
                    <div className="text-slate-400 font-bold">→</div>
                    <div className="bg-white p-4 rounded-lg shadow-sm w-full md:w-1/5 border border-emerald-200">
                      <p className="font-bold text-emerald-700 text-sm">Litify/CRM</p>
                      <p className="text-xs text-slate-500 mt-1">Lead Sold & Payload</p>
                    </div>
                  </div>
                </div>
              </div>

               {/* FLOW 2 */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 bg-slate-100 p-3 rounded-lg flex items-center gap-2">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
                  Quality Assurance & Code Deployment Loop (No Error Bottlenecks)
                </h3>
                <div className="bg-slate-50 p-6 rounded-xl border border-amber-200">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center font-black">1</div>
                      <div className="flex-1 bg-white p-4 border rounded-md shadow-sm">
                        <p className="font-bold">Autonomous Coding (Agent)</p>
                        <p className="text-sm text-slate-500">Writes feature code entirely behind the scenes without prompting terminal auths.</p>
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center font-black">2</div>
                      <div className="flex-1 bg-white p-4 border rounded-md shadow-sm border-l-4 border-l-amber-500">
                        <p className="font-bold">Silent Pre-Flight Check (SafeToAutoRun)</p>
                        <p className="text-sm text-slate-500">Agent runs Type Checks and Linting internally. Parses syntax errors instantly and rewrites own code.</p>
                      </div>
                    </div>
                     <div className="flex items-center gap-4">
                      <div className="bg-emerald-100 text-emerald-800 w-12 h-12 rounded-full flex items-center justify-center font-black"><CheckCircle className="w-6 h-6"/></div>
                      <div className="flex-1 bg-white p-4 border rounded-md shadow-sm border-l-4 border-l-emerald-500">
                        <p className="font-bold">Red Team UAT Pass</p>
                        <p className="text-sm text-slate-500">If code breaks existing money-flow, it deletes itself. If solid, it deploys to Vercel Staging.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
