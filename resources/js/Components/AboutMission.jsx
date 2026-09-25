import React from 'react';
import {
    Target,
    HeartHandshake,
    Globe2,
    CheckCircle2,
    Users,
    ShieldCheck
} from 'lucide-react';

export default function AboutMission({ content = {} }) {
    const defaultImage = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80';
    const rawImage = content?.image || content?.mission_image || defaultImage;
    const imageSrc = (rawImage && (rawImage.startsWith('http') || rawImage.startsWith('/')))
        ? rawImage
        : (rawImage ? `/storage/${rawImage}` : defaultImage);

    const title = content?.title || 'Our mission';
    const quote = content?.quote || '"To bridge the gap between students and prestigious institutions, ensuring that access to quality education knows no boundaries."';
    const description = content?.description || 'Our diverse student community comes from Europe, South Asia, the Middle East and Africa. Every recommendation is unbiased and not limited to the institutions we represent — our services stay free from first enquiry to final enrolment.';

    const badge1Title = content?.badge1_title || '100% Unbiased Counseling';
    const badge1Text = content?.badge1_text || 'Guiding students from Europe, South Asia, Middle East & Africa';
    const badge2Text = content?.badge2_text || 'Zero Hidden Costs';

    const pillar1Title = content?.pillar1_title || 'Global Community';
    const pillar1Desc = content?.pillar1_desc || 'Students from 40+ nations worldwide.';

    const pillar2Title = content?.pillar2_title || 'Student-First Policy';
    const pillar2Desc = content?.pillar2_desc || 'Unbiased recommendations always.';

    const pillar3Title = content?.pillar3_title || '100% Free Services';
    const pillar3Desc = content?.pillar3_desc || 'From first enquiry to final enrolment.';

    return (
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. FEATURE IMAGE WITH FLOATING BADGES */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 mb-14 group">
                    <div className="h-[360px] sm:h-[480px] lg:h-[540px] w-full relative bg-slate-900">
                        <img
                            src={imageSrc}
                            alt="Our Mission"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                            loading="lazy"
                        />

                        {/* Dark Gradient Overlay for Contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
                            <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 max-w-md">
                                <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-400 shrink-0">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-200">{badge1Title}</div>
                                    <div className="text-[11px] text-slate-400">{badge1Text}</div>
                                </div>
                            </div>

                            {badge2Text && (
                                <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl border border-emerald-500/40 backdrop-blur-md">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    <span>{badge2Text}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. CONTENT LAYOUT (2-COLUMN GRID) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT COLUMN: HEADING */}
                    <div className="lg:col-span-4 space-y-3">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {title}
                        </h2>

                        <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                    </div>

                    {/* RIGHT COLUMN: MISSION STATEMENTS & PILLARS */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Main Statement */}
                        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug tracking-tight">
                            {quote}
                        </p>

                        {/* Secondary Statement */}
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            {description}
                        </p>

                        {/* Key Pillars Grid */}
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                                <div className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-1.5">
                                    <Globe2 className="w-4 h-4" />
                                    <span>{pillar1Title}</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{pillar1Desc}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                                <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1.5">
                                    <HeartHandshake className="w-4 h-4" />
                                    <span>{pillar2Title}</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{pillar2Desc}</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5">
                                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>{pillar3Title}</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{pillar3Desc}</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
