import React from 'react';
import {
    Award,
    Users,
    Star,
    CheckCircle2,
    Building2,
    Globe2,
    ShieldCheck,
    Sparkles
} from 'lucide-react';

export default function AboutHero({ content = {} }) {
    const heading = content?.hero_heading || content?.hero?.title;
    const subtitle = content?.hero_subtitle || content?.hero?.subtitle;

    const stats = [
        {
            number: '24',
            suffix: 'Years',
            label: 'of experience',
            icon: Award,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-950/60'
        },
        {
            number: '10,000+',
            suffix: 'Students',
            label: 'placed globally',
            icon: Users,
            color: 'text-indigo-600 dark:text-indigo-400',
            bgColor: 'bg-indigo-100 dark:bg-indigo-950/60'
        },
        {
            number: '4.8/5',
            suffix: 'Rating',
            label: 'Student rating',
            icon: Star,
            color: 'text-amber-500 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-950/60'
        },
        {
            number: '100%',
            suffix: 'Free',
            label: 'Free services',
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-950/60'
        },
    ];

    return (
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/60 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">

            {/* Soft Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden">
                <div className="absolute top-[-80px] left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-[120px]" />
                <div className="absolute top-[80px] right-[10%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[130px]" />
            </div>

            {/* Subtle Pattern Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* HERO HEADER & TYPOGRAPHY */}
                <div className="max-w-3xl space-y-5 text-left">

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                        {heading ? (
                            heading
                        ) : (
                            <>
                                UK's trusted international <br className="hidden sm:inline" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500">
                                    student advisors.
                                </span>
                            </>
                        )}
                    </h1>

                    {/* Main Paragraph */}
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-3xl">
                        {subtitle || ' RMS Group Ltd is a London-headquartered international student recruitment agency with 24 years of experience and a strong global presence across South Asia, Africa and Europe. We help ambitious students access world-class education — securing placements across law, economics, medicine, engineering and business.'}
                    </p>

                    {/* Trust Badges Bar */}
                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span>Headquartered in London, UK</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <Globe2 className="w-4 h-4 text-indigo-600" />
                            <span>Presence in 15+ Countries</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>ICEF & British Council Certified</span>
                        </div>
                    </div>
                </div>

                {/* HORIZONTAL STATS GRID (4 COLUMNS DESKTOP, 2 COLUMNS MOBILE) */}
                <div className="mt-14 lg:mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {stats.map((stat, idx) => {
                            const IconComponent = stat.icon;
                            return (
                                <div
                                    key={idx}
                                    className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                            {stat.suffix}
                                        </span>
                                    </div>

                                    {/* Large Bold Number */}
                                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {stat.number}
                                    </div>

                                    {/* Subtle Label */}
                                    <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
