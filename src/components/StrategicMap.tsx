'use client';

import React, { useEffect, useRef } from 'react';

interface StrategicMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

const StrategicMap: React.FC<StrategicMapProps> = ({ 
  center = { lat: 31.9686, lng: -99.9018 }, // Texas Center
  zoom = 6 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      // Mock for initial render - Real Google Maps logic will go here
      console.log("[StrategicMap] Initializing with Texas focus...");
    }
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-slate-950/20 to-transparent shadow-inner" />
      
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full grayscale-[0.5] contrast-[1.1] brightness-[0.9]">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                <p className="text-slate-500 font-mono tracking-widest text-xs uppercase animate-pulse">
                    Internal Map Initializing...
                </p>
            </div>
        </div>
      </div>

      {/* Dynamic Map HUD: Primary Stats */}
      <div className="absolute bottom-6 left-6 z-20 p-4 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-slate-900/90 group/hud cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">STATE SCAN: ACTIVE</span>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Live Insight Profile</p>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-[74%] animate-[progress_2s_ease-in-out_infinite]" />
          </div>
          <p className="text-[11px] text-slate-300 font-mono">254 COUNTIES ANALYZED</p>
        </div>
      </div>

      {/* Reactive Floating Data Card (Hover Triggered) */}
      <div className="absolute top-6 right-6 z-20 p-5 bg-blue-600/10 backdrop-blur-md border border-blue-500/20 rounded-2xl shadow-2xl transition-all duration-700 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Hot Zone Detected</span>
          <h3 className="text-lg font-bold text-white leading-tight">Harris County</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">124</span>
            <span className="text-[10px] text-blue-300 uppercase font-medium">Claims Found</span>
          </div>
          <p className="text-[10px] text-blue-200/60 mt-2 max-w-[140px] leading-relaxed italic">
            "High concentration of not-at-fault total losses in Houston metro area."
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategicMap;
