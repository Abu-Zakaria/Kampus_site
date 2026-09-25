import React from 'react';
import {
    ShieldCheck,
    CheckCircle2,
    Award,
    Building2,
    Sparkles,
    FileCheck2,
    Lock
} from 'lucide-react';

export default function AboutCommitment({ content = {} }) {
    const tagline = content?.tagline || 'Our commitment';
    const title = content?.title || 'Ethical practice & certified advisors';
    const description = content?.description || "We're committed to the principles of the AQF and the National Code of Ethical Practice for UK Education Agents, and we follow the Good Practice Guide for UK Education Agents.";
    const quote = content?.quote || 'Certified counseling guarantees 100% genuine university applications with zero misleading promises.';

    const defaultCommitments = [
        {
            title: 'British Council certified UK agents & counsellors',
            description: 'Officially trained and accredited counselors adhering to rigorous UK higher education standards.',
            icon: Award,
            iconColor: 'text-emerald-400',
            bgTint: 'bg-emerald-950/40 border-emerald-500/30'
        },
        {
            title: 'Committed to AQF & ethical UKVI sponsor practice',
            description: 'Strict adherence to Australian Qualifications Framework and UK Home Office visa sponsor compliance.',
            icon: ShieldCheck,
            iconColor: 'text-blue-400',
            bgTint: 'bg-blue-950/40 border-blue-500/30'
        },
        {
            title: 'National Code of Ethical Practice for Agents',
            description: 'Uncompromising integrity, transparent advice, and student-first data protection standards.',
            icon: FileCheck2,
            iconColor: 'text-indigo-400',
            bgTint: 'bg-indigo-950/40 border-indigo-500/30'
        },
    ];

    const commitments = (content?.items && Array.isArray(content.items) && content.items.length === 3)
        ? content.items.map((item, idx) => ({
            ...defaultCommitments[idx],
            title: item.title || defaultCommitments[idx].title,
            description: item.description || defaultCommitments[idx].description,
            icon: defaultCommitments[idx].icon,
            iconColor: defaultCommitments[idx].iconColor,
            bgTint: defaultCommitments[idx].bgTint,
        }))
        : defaultCommitments;

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden border-b border-slate-800">
            {/* Background Glow Graphics */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* LEFT COLUMN: TEXT & HEADINGS */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Heading */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                                {tagline}
                            </h3>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                                {title}
                            </h2>
                        </div>

                        {/* Paragraph */}
                        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                            {description}
                        </p>

                        {/* Trust Quote Box */}
                        {quote && (
                            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                                <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
                                <span className="text-xs text-slate-300">
                                    {quote}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: VISUALLY DISTINCT BADGE CONTAINERS */}
                    <div className="lg:col-span-6 space-y-4">
                        {commitments.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border ${item.bgTint} backdrop-blur-md hover:border-blue-400/60 transition-all duration-300 flex items-start gap-4 group shadow-lg`}
                                >
                                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                            {item.description}
                                        </p>
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
