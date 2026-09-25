import React from 'react';
import { Handshake, Sparkles, Globe } from 'lucide-react';

export default function PartnerHero({ content = {} }) {
    const heading = content?.hero_heading || content?.hero?.title;
    const subtitle = content?.hero_subtitle || content?.hero?.subtitle;
    const badge = content?.badge_text || content?.hero?.badge;

    return (
        <section className="relative overflow-hidden py-16 lg:py-20 bg-gradient-to-b from-purple-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">

            {/* Soft Brand-Colored Glow Ambient Orbs Behind Heading */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
                <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[140px]" />
                <div className="absolute top-[80px] right-[15%] w-72 h-72 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[110px]" />
            </div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">

                {/* 1. TOP LABEL BADGE */}
                <div>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-widest border border-purple-200/80 dark:border-purple-800 shadow-2xs backdrop-blur-md">
                        <Handshake className="w-3.5 h-3.5" />
                        <span>{badge || 'BECOME A PARTNER'}</span>
                    </span>
                </div>

                {/* 2. MAIN HEADING WITH SOFT BRAND GLOW HIGHLIGHT */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
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
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
                    {subtitle || 'Join our global network of recruitment partners. Gain access to world-class universities, enjoy dedicated support, and offer your students the best educational opportunities abroad.'}
                </p>

            </div>
        </section>
    );
}
