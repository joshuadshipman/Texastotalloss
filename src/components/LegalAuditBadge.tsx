'use client';

import React from 'react';

/**
 * LegalAuditBadge (Internal Utility)
 * 
 * Shows a status badge for admin users to quickly verify 
 * if a page meets the Texas Bar ARC and identification requirements.
 */
export const LegalAuditBadge = ({
    responsibleAttorney = "Not Set",
    officeLocation = "Not Set",
    arcFiled = false
}) => {
    // Only visible in development or for logged-in admins
    if (process.env.NODE_ENV !== 'development') return null;

    const isReady = responsibleAttorney !== "Not Set" && officeLocation !== "Not Set" && arcFiled;

    return (
        <div className="fixed bottom-20 left-4 z-[9999] p-3 rounded-lg border shadow-xl bg-white flex flex-col gap-1 text-[10px] uppercase tracking-wider font-bold">
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>Legal Readiness</span>
            </div>
            <div className="text-slate-500">
                Atty: <span className={responsibleAttorney === "Not Set" ? "text-red-500" : "text-green-600"}>{responsibleAttorney}</span>
            </div>
            <div className="text-slate-500">
                Loc: <span className={officeLocation === "Not Set" ? "text-red-500" : "text-green-600"}>{officeLocation}</span>
            </div>
            <div className="text-slate-500">
                ARC: <span className={arcFiled ? "text-green-600" : "text-red-500"}>{arcFiled ? "FILED" : "PENDING"}</span>
            </div>
        </div>
    );
};
