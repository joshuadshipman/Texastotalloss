'use client';

import React from 'react';

interface MobileScrollContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function MobileScrollContainer({ children, className = "" }: MobileScrollContainerProps) {
    return (
        <div className={`
            flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 
            md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0
            scrollbar-hide ${className}
        `}>
            {React.Children.map(children, (child) => (
                <div className="snap-center shrink-0 w-[85vw] md:w-auto">
                    {child}
                </div>
            ))}
        </div>
    );
}
