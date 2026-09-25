import React from 'react';
import { Handshake, Sparkles, Globe } from 'lucide-react';

export default function PartnerHero({ content = {} }) {
    const heading = content?.hero_heading || content?.hero?.title;
    const subtitle = content?.hero_subtitle || content?.hero?.subtitle;
    const badge = content?.badge_text || content?.hero?.badge;

    // Resolve hero image with fallback handling
    const rawHeroImage = content?.hero_image || content?.hero?.image || content?.hero_banner_image || '';
    const heroImage = (rawHeroImage && typeof rawHeroImage === 'string' && rawHeroImage.trim().length > 0)
        ? (rawHeroImage.startsWith('http') || rawHeroImage.startsWith('/') ? rawHeroImage : `/storage/${rawHeroImage}`)
        : null;

    const overlayOpacity = content?.hero_overlay_opacity !== undefined && content?.hero_overlay_opacity !== null && content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(content.hero_overlay_opacity, 10)))
        : 75;

    return (
        <section className={`relative overflow-hidden py-16 lg:py-20 border-b border-slate-200/60 dark:border-slate-800 transition-colors ${
            heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-purple-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
        }`}>
            {/* HERO BANNER IMAGE BACKGROUND WITH DYNAMIC CONTRAST OVERLAYS */}
            {heroImage ? (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <img
                        src={heroImage}
                        alt="Partner Hero Banner"
                        className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* Dark Scrim with Configurable Opacity */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-purple-950/70"
                        style={{ opacity: overlayOpacity / 100 }}
                    />

                    {/* Subtle Vertical Fade Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

                    {/* Ambient Glow Orbs over banner */}
                    <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-purple-600/25 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute top-[80px] right-[-80px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
                </div>
            ) : (
                <>
                    {/* Soft Brand-Colored Glow Ambient Orbs Behind Heading */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
                        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[140px]" />
                        <div className="absolute top-[80px] right-[15%] w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[110px]" />
                    </div>

                    {/* Subtle Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                </>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">

                {/* 1. TOP LABEL BADGE */}
                <div>
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md shadow-2xs ${
                        heroImage
                            ? 'bg-white/10 text-purple-300 border-white/20'
                            : 'bg-purple-100/90 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800'
                    }`}>
                        <Handshake className="w-3.5 h-3.5" />
                        <span>{badge || 'BECOME A PARTNER'}</span>
                    </span>
                </div>

                {/* 2. MAIN HEADING WITH SOFT BRAND GLOW HIGHLIGHT */}
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto ${
                    heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}>
                    {heading ? (
                        heading
                    ) : (
                        <>
                            Grow with{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400">
                                RMS Group
                            </span>
                        </>
                    )}
                </h1>

                {/* 3. SUBTITLE PARAGRAPH */}
                <p className={`text-lg sm:text-xl leading-relaxed font-normal max-w-2xl mx-auto ${
                    heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                }`}>
                    {subtitle || 'Join our global network of recruitment partners. Gain access to world-class universities, enjoy dedicated support, and offer your students the best educational opportunities abroad.'}
                </p>

            </div>
        </section>
    );
}
