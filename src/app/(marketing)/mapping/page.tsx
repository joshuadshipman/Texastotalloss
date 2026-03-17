import React from 'react';
import StrategicMap from '../../../components/StrategicMap';
export default function MappingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Texas Total Loss: Strategic Mapping UI
        </h1>
        <p className="mt-4 text-slate-400 text-lg max-w-2xl">
          Visualizing lead generation potential and competitor density across the Lone Star State.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 aspect-video bg-slate-900 rounded-2xl border border-slate-800 relative overflow-hidden group">
          <StrategicMap />
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Lead Intelligence</h3>
            <div className="space-y-4">
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-2/3 animate-pulse" />
              </div>
              <p className="text-sm text-slate-400">DeepScan active: Finding high-intent accident zones...</p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Market Controls</h3>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20">
              Refresh All Pins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
