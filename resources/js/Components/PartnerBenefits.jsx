import React from 'react';
import {
    Building2,
    Coins,
    Users,
    Zap,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

export default function PartnerBenefits({ content = {} }) {
    const rawBenefits = [
        {
            title: 'Top Tier Institutions',
            description: 'Access to high-ranked universities globally across the UK, USA, Finland, & Dubai with direct admissions agreements.',
            icon: Building2,
            iconBg: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Attractive Commissions',
            description: 'Competitive and timely commission structures with transparent payout reporting and performance bonuses.',
            icon: Coins,
            iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
        },
        {
            title: 'Dedicated Account Manager',
            description: 'Personalised 1-on-1 support for your student applications, document checking, and compliance queries.',
            icon: Users,
            iconBg: 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
        },
        {
            title: 'Streamlined Processing',
            description: 'Fast-track application evaluation and direct university admission portal access for rapid offer letters.',
            icon: Zap,
            iconBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
        },
    ];

    const benefits = rawBenefits.map((item, idx) => ({
        ...item,
        title: content?.benefits_items?.[idx]?.title || item.title,
        description: content?.benefits_items?.[idx]?.description || item.description,
    }));

    return (
        <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CENTERED SECTION TITLE */}
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-200 dark:border-slate-700">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{content?.benefits_badge || 'PARTNER ADVANTAGE'}</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {content?.benefits_title || 'Why partner with us?'}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        {content?.benefits_subtitle || 'Empower your agency with industry-leading higher education partnerships and seamless application support.'}
                    </p>
                </div>

                {/* 4-COLUMN CSS GRID LAYOUT */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {benefits.map((benefit, idx) => {
                        const IconComponent = benefit.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative p-7 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs hover:shadow-xl hover:-translate-y-2 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* LARGER ICON INSIDE SOFT COLORED CIRCLE AT TOP OF CARD */}
                                    <div className={`w-14 h-14 rounded-2xl ${benefit.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
                                        <IconComponent className="w-7 h-7" />
                                    </div>

                                    {/* Benefit Title */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {benefit.title}
                                    </h3>

                                    {/* Benefit Description */}
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal">
                                        {benefit.description}
                                    </p>
                                </div>

                                {/* Checkmark Indicator */}
                                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Included for Partners</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
