import React from 'react';
import {
    Sparkles,
    CheckCircle2,
    GraduationCap,
    ShieldCheck,
    Award
} from 'lucide-react';

export default function ServicesHero({ content = {} }) {
    const heading = content?.hero_heading || content?.hero?.title;
    const subtitle = content?.hero_subtitle || content?.hero?.subtitle;
    const badgeText = content?.badge_text || content?.hero?.badge;

    // Resolve hero image with fallback handling
    const rawHeroImage = content?.hero_image || content?.hero?.image || content?.hero_banner_image || '';
    const heroImage = (rawHeroImage && typeof rawHeroImage === 'string' && rawHeroImage.trim().length > 0)
        ? (rawHeroImage.startsWith('http') || rawHeroImage.startsWith('/') ? rawHeroImage : `/storage/${rawHeroImage}`)
        : null;

    const overlayOpacity = content?.hero_overlay_opacity !== undefined && content?.hero_overlay_opacity !== null && content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(content.hero_overlay_opacity, 10)))
        : 75;

    return (
        <section className={`relative overflow-hidden py-16 lg:py-24 border-b border-slate-200/60 dark:border-slate-800 transition-colors text-center ${
            heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
        }`}>
            {/* 1. HERO BANNER IMAGE BACKGROUND WITH DYNAMIC CONTRAST OVERLAYS */}
            {heroImage ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src={heroImage}
                        alt="Services Hero Banner"
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
                    {/* Ambient Top Glow Orbs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden">
                        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[140px]" />
                        <div className="absolute top-[100px] right-[15%] w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px]" />
                    </div>

                    {/* Subtle Dot Pattern Backdrop */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                </>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                {/* Optional Badge */}
                {badgeText && (
                    <div>
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md shadow-2xs ${
                            heroImage
                                ? 'bg-white/10 text-blue-300 border-white/20'
                                : 'bg-blue-100/90 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800'
                        }`}>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{badgeText}</span>
                        </span>
                    </div>
                )}

                {/* 2. Main Heading */}
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
                    heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                    {heading ? (
                        heading
                    ) : (
                        <>
                            End-to-end support, <br className="hidden sm:inline" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400">
                                every step of the way
                            </span>
                        </>
                    )}
                </h1>

                {/* 3. Centered Paragraph */}
                <p className={`text-lg sm:text-xl leading-relaxed font-normal max-w-3xl mx-auto ${
                    heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                }`}>
                    {subtitle || 'From choosing the right university to arriving safely at your destination, we provide expert, personalised assistance. Our British Council certified experts ensure your journey from dreams to degrees is seamless and completely free.'}
                </p>

                {/* 4. Feature Trust Micro-Badges */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-semibold">
                    <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border shadow-2xs backdrop-blur-xs ${
                        heroImage
                            ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>{content?.hero_badge_1 || '100% Free Guidance'}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border shadow-2xs backdrop-blur-xs ${
                        heroImage
                            ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span>{content?.hero_badge_2 || '500+ Partner Universities'}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border shadow-2xs backdrop-blur-xs ${
                        heroImage
                            ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        <span>{content?.hero_badge_3 || 'British Council Certified'}</span>
                    </div>
                </div>

            </div>
        </section>
    );
}
