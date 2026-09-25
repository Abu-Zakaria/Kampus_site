import React from 'react';
import {
    ClipboardCheck,
    Building2,
    Award,
    FileCheck2,
    Plane,
    Sparkles,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

export default function JourneyProcess({ content = {} }) {
    const roadmapTitle = content?.roadmap_title;
    const roadmapSubtitle = content?.roadmap_subtitle || 'Our structured process removes the stress from university applications, visa filings, and relocation.';

    const steps = [
        {
            number: '01',
            title: 'Free assessment',
            description: 'Evaluate your academic profile, budget, and career goals with a senior counselor.',
            icon: ClipboardCheck,
            color: 'from-blue-600 to-blue-700',
            glow: 'shadow-blue-500/25',
            badge: 'Step 1'
        },
        {
            number: '02',
            title: 'Shortlist & apply',
            description: 'Match high-ranking universities and submit fast-track application files.',
            icon: Building2,
            color: 'from-indigo-600 to-indigo-700',
            glow: 'shadow-indigo-500/25',
            badge: 'Step 2'
        },
        {
            number: '03',
            title: 'Scholarships & docs',
            description: 'Secure tuition grants & organize bank statements for full compliance.',
            icon: Award,
            color: 'from-purple-600 to-purple-700',
            glow: 'shadow-purple-500/25',
            badge: 'Step 3'
        },
        {
            number: '04',
            title: 'Visa support',
            description: 'Complete 100% compliant student visa filing and mock interview coaching.',
            icon: FileCheck2,
            color: 'from-emerald-600 to-teal-700',
            glow: 'shadow-emerald-500/25',
            badge: 'Step 4'
        },
        {
            number: '05',
            title: 'Enrol & arrive',
            description: 'Pre-departure briefing, airport pickup, accommodation, and campus enrolment.',
            icon: Plane,
            color: 'from-cyan-600 to-blue-600',
            glow: 'shadow-cyan-500/25',
            badge: 'Step 5'
        },
    ];

    return (
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {roadmapTitle ? (
                            roadmapTitle
                        ) : (
                            <>
                                From dreams to degrees, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500">in five steps</span>
                            </>
                        )}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                        {roadmapSubtitle}
                    </p>
                </div>

                {/* HORIZONTAL STEP-BY-STEP FLOW (DESKTOP) & STACKED (MOBILE) */}
                <div className="relative">
                    
                    {/* Connecting Line for Desktop */}
                    <div className="hidden lg:block absolute top-[64px] left-[8%] right-[8%] h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full z-0 opacity-30" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 relative z-10">
                        {steps.map((step, idx) => {
                            const IconComponent = step.icon;
                            return (
                                <div
                                    key={idx}
                                    className="group relative p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Step Icon Badge */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-black text-lg shadow-lg ${step.glow} group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-7 h-7" />
                                            </div>
                                            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 tracking-wider">
                                                {step.number}
                                            </span>
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-md">
                                                {step.badge}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pt-1">
                                                {step.title}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
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
