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

  const mapsUrl = `https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_GOOGLE_MAPS_API_KEY&q=Texas+Total+Loss+Claim+Help+Pearland+TX`;
  const cidLink = `https://www.google.com/maps?cid=REPLACE_WITH_CID_IF_KNOWN`; // Falls back to search if unknown
  const fallbackSearch = `https://www.google.com/maps/search/?api=1&query=Texas+Total+Loss+Claim+Help+Pearland+TX`;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 group">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-tr from-slate-950/20 to-transparent shadow-inner" />
      
      {/* Map Container - Now with Real Embed */}
      <div className="w-full h-full grayscale-[0.5] contrast-[1.1] brightness-[0.9] transition-all group-hover:grayscale-0">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110900.5654321!2d-95.2860!3d29.5636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjlCsDMzJzQ5LjAiTiA5NcKwMTcnMDkuNiJX!5e0!3m2!1sen!2sus!4v1710892000000!5m2!1sen!2sus`}
        ></iframe>
      </div>

      {/* Dynamic Map HUD: Primary Stats */}
      <div className="absolute bottom-6 left-6 z-20 p-4 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-slate-900/90 group/hud">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/40" />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide uppercase">MEO Signal: Optimized</span>
        </div>
        <div className="mt-3 space-y-3">
            <a 
                href={fallbackSearch}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2 px-4 rounded-lg text-center transition-colors uppercase tracking-widest border border-white/10"
            >
                View on Google Maps
            </a>
          <p className="text-[11px] text-slate-300 font-mono text-center">PEARLAND HQ DETECTED</p>
        </div>
      </div>

      {/* Reactive Floating Data Card (Hover Triggered) */}
      <div className="absolute top-6 right-6 z-20 p-5 bg-blue-600/10 backdrop-blur-md border border-blue-500/20 rounded-2xl shadow-2xl transition-all duration-700 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Local Authority</span>
          <h3 className="text-lg font-bold text-white leading-tight">Texas Total Loss</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-white">PEARLAND, TX</span>
          </div>
          <p className="text-[10px] text-blue-200/60 mt-2 max-w-[140px] leading-relaxed italic">
            "Direct GBP integration optimized for 2026 local search rankings."
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategicMap;
