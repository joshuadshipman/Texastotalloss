'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cities } from '@/data/cities';
import { SearchIcon, MapPinIcon } from 'lucide-react';

export default function CitySearch({ lang }: { lang: 'en' | 'es' }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Filter cities based on query
    const filteredCities = query
        ? cities.filter(city => {
            const cityName = city.translations[lang]?.name || city.slug;
            return cityName.toLowerCase().includes(query.toLowerCase());
        })
        : [];

    const handleSelect = (slug: string) => {
        setQuery('');
        setIsOpen(false);
        router.push(`/${lang}/locations/${slug}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.min(prev + 1, filteredCities.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCities.length > 0) {
                handleSelect(filteredCities[highlightedIndex].slug);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('.city-search-results')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full max-w-lg mx-auto mt-6 z-50">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-blue-300 group-focus-within:text-blue-100 transition-colors" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-xl leading-5 bg-white/10 text-white placeholder-blue-300/70 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-blue-400/50 backdrop-blur-sm transition-all shadow-lg"
                    placeholder={lang === 'en' ? "Search for your city (e.g. Plano, Mineral Wells)..." : "Buscar ciudad (ej. Dallas, Odessa)..."}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setHighlightedIndex(0);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {isOpen && query && (
                <div className="absolute mt-1 w-full bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden city-search-results max-h-60 overflow-y-auto custom-scrollbar">
                    {filteredCities.length > 0 ? (
                        <ul className="py-1">
                            {filteredCities.map((city, index) => (
                                <li
                                    key={city.slug}
                                    className={`cursor-pointer px-4 py-3 flex items-center justify-between transition-colors ${index === highlightedIndex ? 'bg-blue-600/30' : 'hover:bg-white/5'
                                        }`}
                                    onClick={() => handleSelect(city.slug)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPinIcon className="h-4 w-4 text-blue-400" />
                                        <div>
                                            <span className="text-white font-medium block">
                                                {city.translations[lang]?.name}
                                            </span>
                                            {city.metroArea && (
                                                <span className="text-xs text-blue-300/60 uppercase tracking-wider">
                                                    {city.metroArea} Metro
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {city.translations[lang]?.county} Co.
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            {lang === 'en' ? 'No cities found.' : 'No se encontraron ciudades.'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
