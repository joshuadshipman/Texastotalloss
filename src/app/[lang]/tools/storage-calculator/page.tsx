'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StorageFeeCalculator from '@/components/StorageFeeCalculator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StorageCalculatorPage() {
    const params = useParams();
    const lang = params.lang as string;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8">
                <Link href={`/${lang}/vsf`} className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-bold group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    BACK TO VSF DIRECTORY
                </Link>
            </div>
            
            <StorageFeeCalculator />
            
            <div className="max-w-4xl mx-auto mt-12 text-center text-slate-400 text-xs">
                <p>
                    All calculations are based on standard Texas VSF fee caps as regulated by the 
                    Texas Department of Licensing and Regulation (TDLR). 
                    Actual fees may vary based on specific facility notification and impound costs.
                </p>
            </div>
        </div>
    );
}
