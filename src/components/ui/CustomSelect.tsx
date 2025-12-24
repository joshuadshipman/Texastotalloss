'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';

interface Option {
    value: string | number;
    label: string | number;
}

interface CustomSelectProps {
    label?: string;
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string; // Additional classes for the button
}

export default function CustomSelect({
    label,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    className = ''
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            {label && <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-left flex items-center justify-between focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${className} ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}
            >
                <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDownIcon size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <ul className="py-1">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer hover:bg-blue-50 flex items-center justify-between group transition-colors ${option.value === value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                            >
                                <span>{option.label}</span>
                                {option.value === value && <CheckIcon size={16} className="text-blue-600" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
