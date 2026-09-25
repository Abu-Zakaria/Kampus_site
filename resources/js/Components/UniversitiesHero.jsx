import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    MapPin,
    ChevronDown,
    Check,
    X
} from 'lucide-react';

export default function UniversitiesHero({
    destinations = [],
    quickFilters = [],
    searchTerm = '',
    destination = 'All',
    onSearchChange,
    onDestinationChange,
    content = {}
}) {
    const heading = content?.hero_heading || content?.hero?.title;
    const subtitle = content?.hero_subtitle || content?.hero?.subtitle;

    // Resolve hero image with fallback handling
    const rawHeroImage = content?.hero_image || content?.hero?.image || content?.hero_banner_image || '';
    const heroImage = (rawHeroImage && typeof rawHeroImage === 'string' && rawHeroImage.trim().length > 0)
        ? (rawHeroImage.startsWith('http') || rawHeroImage.startsWith('/') ? rawHeroImage : `/storage/${rawHeroImage}`)
        : null;

    const overlayOpacity = content?.hero_overlay_opacity !== undefined && content?.hero_overlay_opacity !== null && content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(content.hero_overlay_opacity, 10)))
        : 75;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get active destination label
    const activeDestination = destinations.find(
        (d) => d.name.toLowerCase() === destination.toLowerCase()
    );
    const destinationLabel = activeDestination
        ? `${activeDestination.name} ${activeDestination.country_code ? `(${activeDestination.country_code})` : ''}`
        : (destination === 'All' ? 'All Destinations' : destination);

    return (
        <section className={`relative overflow-hidden py-16 lg:py-24 border-b border-slate-200/60 dark:border-slate-800 transition-colors text-center ${
            heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
        }`}>
            {/* HERO BANNER IMAGE BACKGROUND WITH DYNAMIC CONTRAST OVERLAYS */}
            {heroImage ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src={heroImage}
                        alt="Universities Hero Banner"
                        className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* Dark Scrim with Configurable Opacity */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70"
                        style={{ opacity: overlayOpacity / 100 }}
                    />

                    {/* Subtle Vertical Fade Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

                    {/* Ambient Glow Orbs over banner */}
                    <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/25 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute top-[100px] right-[-100px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
                </div>
            ) : (
                <>
                    {/* Ambient Background Blur Graphics */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] pointer-events-none overflow-hidden">
                        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[360px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[140px]" />
                        <div className="absolute top-[120px] right-[12%] w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px]" />
                    </div>

                    {/* Subtle Dot Pattern Backdrop */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                </>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">

                {/* 1. Main Heading */}
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
                    heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                    {heading ? (
                        heading
                    ) : (
                        <>
                            Find your dream <br className="hidden sm:inline" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400">
                                university
                            </span>
                        </>
                    )}
                </h1>

                {/* 2. Centered Paragraph */}
                <p className={`text-lg sm:text-xl leading-relaxed font-normal max-w-3xl mx-auto ${
                    heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                }`}>
                    {subtitle || 'Explore our verified network of partner institutions. Filter by destination country to find the perfect match for your academic ambition.'}
                </p>

                {/* 3. INSTANT LIVE SEARCH & CUSTOM COMPACT SCROLLABLE DROPDOWN */}
                <div className="pt-4">
                    <div className="max-w-3xl mx-auto rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-3 sm:p-3.5 transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            
                            {/* Input 1: Live search input with clear button */}
                            <div className="sm:col-span-7 relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Search className="w-5 h-5 text-blue-500" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                                    placeholder="Search universities by name, program, or city..."
                                    className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                                />
                                {searchTerm.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => onSearchChange && onSearchChange('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Input 2: Compact Custom Scrollable Destination Dropdown */}
                            <div className="sm:col-span-5 relative" ref={dropdownRef}>
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 z-10">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full pl-10 pr-9 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-between text-left font-medium cursor-pointer shadow-2xs"
                                >
                                    <span className="truncate">{destinationLabel}</span>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                                    </div>
                                </button>

                                {/* Compact Custom Scrollable Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute z-50 mt-2 left-0 right-0 max-h-52 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 text-left">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onDestinationChange) onDestinationChange('All');
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                                                destination === 'All'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <span>All Destinations</span>
                                            {destination === 'All' && <Check className="w-3.5 h-3.5" />}
                                        </button>

                                        {destinations.map((d) => {
                                            const isSelected = destination.toLowerCase() === d.name.toLowerCase();
                                            return (
                                                <button
                                                    key={d.id}
                                                    type="button"
                                                    onClick={() => {
                                                        if (onDestinationChange) onDestinationChange(d.name);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                    }`}
                                                >
                                                    <span className="truncate">
                                                        {d.name} {d.country_code ? `(${d.country_code})` : ''}
                                                    </span>
                                                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* 4. DYNAMIC QUICK FILTER TAGS (MOST SEARCHED, MAX 10) */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        Quick Filters:
                    </span>
                    
                    <button
                        type="button"
                        onClick={() => onDestinationChange && onDestinationChange('All')}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            destination === 'All'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs'
                        }`}
                    >
                        All
                    </button>

                    {(quickFilters && quickFilters.length > 0 ? quickFilters : destinations).slice(0, 10).map((d) => {
                        const isSelected = destination.toLowerCase() === d.name.toLowerCase();
                        return (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => onDestinationChange && onDestinationChange(isSelected ? 'All' : d.name)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs'
                                }`}
                            >
                                <span>{d.name}</span>
                                {d.country_code && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                        {d.country_code}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
