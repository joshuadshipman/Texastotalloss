'use client';

import { MapPinIcon, ExternalLinkIcon } from 'lucide-react';

interface ResourceLinkHelperProps {
    resourceType: 'towing' | 'auto repair' | 'hospital' | 'car rental' | 'collision center';
    city: string;
    className?: string;
}

export default function ResourceLinkHelper({ resourceType, city, className = '' }: ResourceLinkHelperProps) {
    const query = `${resourceType} near ${city} Texas`;
    const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

    return (
        <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg text-sm font-bold transition ${className}`}
        >
            <MapPinIcon size={16} />
            Find {resourceType === 'auto repair' ? 'Repair Shops' : resourceType.charAt(0).toUpperCase() + resourceType.slice(1) + 's'} in {city}
            <ExternalLinkIcon size={12} className="opacity-50" />
        </a>
    );
}
