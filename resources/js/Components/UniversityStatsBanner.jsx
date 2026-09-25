import React from 'react';
import {
    Building2,
    Globe,
    CheckCircle2
} from 'lucide-react';

export default function UniversityStatsBanner({ content = {} }) {
    const statsTitle = content?.stats_title || 'A growing global network';
    const statsSubtitle = content?.stats_subtitle || 'Connecting students with accredited universities worldwide through streamlined admission channels.';

    const stats = [
        {
            value: content?.stat_1_value || '150+',
            label: content?.stat_1_label || 'Partner Institutions',
            description: content?.stat_1_desc || 'Direct admissions partnerships with leading global universities',
            icon: Building2,
            gradient: 'from-blue-400 to-indigo-400'
        },
        {
            value: content?.stat_2_value || '4',
            label: content?.stat_2_label || 'Global Destinations',
            description: content?.stat_2_desc || 'UK, USA, Finland, and Dubai study pathways',
            icon: Globe,
            gradient: 'from-indigo-400 to-purple-400'
        },
        {
            value: content?.stat_3_value || '98%',
            label: content?.stat_3_label || 'Acceptance Rate',
            description: content?.stat_3_desc || 'Proven track record for conditional & unconditional offer letters',
            icon: CheckCircle2,
            gradient: 'from-emerald-400 to-teal-300'
        },
    ];

    return (
        <section className="relative overflow-hidden py-16 lg:py-20 bg-slate-900 text-white border-y border-slate-800">
            {/* Background Glow Graphics */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                
                {/* CENTERED HEADING */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {statsTitle}
                    </h2>

                    <p className="text-slate-400 text-sm sm:text-base">
                        {statsSubtitle}
                    </p>
                </div>

                {/* 3-COLUMN STATS GRID WITH SUBTLE VERTICAL DIVIDERS ON DESKTOP */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 relative">
                    {stats.map((stat, idx) => {
                        const IconComponent = stat.icon;
                        const isNotLast = idx < stats.length - 1;

                        return (
                            <div
                                key={idx}
                                className="relative text-center px-6 py-4 space-y-3 group"
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-6 h-6" />
                                </div>

                                {/* Large Bold Number with Brand Accent Gradient */}
                                <div className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} tracking-tight`}>
                                    {stat.value}
                                </div>

                                {/* Label & Description */}
                                <div>
                                    <div className="text-lg font-bold text-white tracking-wide">
                                        {stat.label}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                        {stat.description}
                                    </div>
                                </div>

                                {/* SUBTLE VERTICAL DIVIDER BETWEEN STATS ON DESKTOP */}
                                {isNotLast && (
                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-slate-800/80" />
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
