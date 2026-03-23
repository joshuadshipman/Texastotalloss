'use client';

import dynamic from 'next/dynamic';

export const ValuationCalculator = dynamic(() => import('./ValuationCalculator'), { ssr: false });
export const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });
export const CaseReviewModal = dynamic(() => import('./CaseReviewModal'), { ssr: false });
