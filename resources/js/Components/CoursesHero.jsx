import React, { useState, useEffect } from 'react';
import {
    Search,
    BookOpen,
    GraduationCap,
    Sparkles,
    ArrowRight
} from 'lucide-react';

export default function CoursesHero({
    initialSearch = '',
    popularSearches = [],
    onSearchChange,
    onSearchSubmit,
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

    const [searchTerm, setSearchTerm] = useState(initialSearch);

    useEffect(() => {
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit(searchTerm);
        }
    };

    const configuredPopular = content?.popular_searches
        ? content.popular_searches.split(',').map(s => s.trim()).filter(Boolean)
        : (popularSearches && popularSearches.length > 0 ? popularSearches : ['Computer Science', 'MBA', 'Data Science & AI', 'Law', 'Engineering', 'Psychology']);

    return (
        <section className={`relative overflow-hidden py-16 lg:py-20 border-b border-slate-200/60 dark:border-slate-800 transition-colors ${
            heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-blue-50/80 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
        }`}>
            {/* 1. HERO BANNER IMAGE BACKGROUND */}
            {heroImage ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src={heroImage}
                        alt="Courses Hero Banner"
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
                    <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-blue-600/25 rounded-full blur-[140px] pointer-events-none" />
                </div>
            ) : (
                <>
                    {/* Ambient Background Light Orbs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
                        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[140px]" />
                        <div className="absolute top-[80px] right-[12%] w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px]" />
                    </div>

                    {/* Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                </>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
                
                {/* 1. TYPOGRAPHY & HEADER */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
                        heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                    }`}>
                        {heading ? (
                            heading
                        ) : (
                            <>
                                Find the right course for{' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400">
                                    your future
                                </span>
                            </>
                        )}
                    </h1>

                    <p className={`text-lg sm:text-xl leading-relaxed font-normal max-w-2xl mx-auto ${
                        heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                    }`}>
                        {subtitle || 'Browse thousands of undergraduate and postgraduate degrees across top universities in the UK, USA, Finland, and Dubai.'}
                    </p>
                </div>

                {/* 2. LARGE PROMINENT FLOATING SEARCH BAR */}
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-2 sm:p-2.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50">
                        
                        {/* Search Icon */}
                        <div className="pl-3.5 text-slate-400 flex items-center justify-center shrink-0">
                            <Search className="w-5 h-5 text-blue-500" />
                        </div>

                        {/* Text Input without internal border */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            placeholder={content?.search_placeholder || "Search for a course (e.g., Data Science, Law, Business)..."}
                            className="w-full bg-transparent py-2.5 px-2 text-slate-900 dark:text-white text-sm sm:text-base font-medium placeholder-slate-400 dark:placeholder-slate-500 border-0 border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none"
                        />

                        {/* Solid Brand Search Button */}
                        <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        >
                            <span>Search</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Popular Quick Searches */}
                    <div className="flex items-center justify-center gap-2 flex-wrap pt-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
                        {configuredPopular.slice(0, 10).map((keyword) => {
                            const isSelected = searchTerm && searchTerm.toLowerCase() === keyword.toLowerCase();
                            return (
                                <button
                                    key={keyword}
                                    type="button"
                                    onClick={() => {
                                        const nextVal = isSelected ? '' : keyword;
                                        setSearchTerm(nextVal);
                                        if (onSearchChange) onSearchChange(nextVal);
                                        if (onSearchSubmit) onSearchSubmit(nextVal);
                                    }}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs'
                                    }`}
                                >
                                    {keyword}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
