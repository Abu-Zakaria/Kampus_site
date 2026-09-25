import React from 'react';
import {
    Gift,
    Scale,
    Globe2,
    Award
} from 'lucide-react';

export default function AboutValues({ content = {} }) {
    const title = content?.title || 'What we stand for';
    const subtitle = content?.subtitle || 'Our foundational values guide every counseling session, university selection, and visa guidance file we manage.';

    const defaultValues = [
        {
            title: 'Free for students',
            text: 'Our guidance is completely free from first enquiry to enrolment.',
            icon: Gift,
            iconBg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
            badge: '100% Free'
        },
        {
            title: 'Unbiased advice',
            text: 'We recommend what fits you, not only the institutions we represent.',
            icon: Scale,
            iconBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
            badge: 'Student-First'
        },
        {
            title: 'Global reach, local care',
            text: 'Advisors across South Asia, Africa and Europe, informed by London HQ.',
            icon: Globe2,
            iconBg: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
            badge: '15+ Offices'
        },
        {
            title: '24 years of trust',
            text: 'Nearly two and a half decades placing students at top universities.',
            icon: Award,
            iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
            badge: 'Est. 2002'
        },
    ];

    const values = (content?.items && Array.isArray(content.items) && content.items.length === 4)
        ? content.items.map((item, idx) => ({
            ...defaultValues[idx],
            title: item.title || defaultValues[idx].title,
            text: item.text || defaultValues[idx].text,
            badge: item.badge || defaultValues[idx].badge,
            icon: defaultValues[idx].icon,
            iconBg: defaultValues[idx].iconBg,
        }))
        : defaultValues;

    return (
        <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* 2x2 GRID LAYOUT ON DESKTOP, 1 COLUMN ON MOBILE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {values.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Icon & Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className={`p-4 rounded-2xl ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700">
                                            {item.badge}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Description Text */}
                                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
