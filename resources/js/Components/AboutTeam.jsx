import React from 'react';
import {
    Users,
    Globe2,
    ShieldCheck,
    Award,
    Quote,
    Mail,
    Linkedin,
    Building2,
    CheckCircle2
} from 'lucide-react';

export default function AboutTeam({ employees = [], companyStats = {} }) {
    // If no active employees and no count, still render or fallback gracefully
    const employeeCount = companyStats?.employee_count || `${employees.length > 0 ? employees.length : 50}+ Global Team Members`;
    const employeeStatSubtext = companyStats?.employee_stat_subtext || 'Dedicated education consultants, visa case officers, and admissions specialists across 15+ countries worldwide.';
    const heading = companyStats?.team_heading || 'Meet our global education leadership';
    const subheading = companyStats?.team_subheading || 'Driven by ethics, academic expertise, and student success, our multi-disciplinary team brings decades of university admissions experience.';

    return (
        <section id="team" className="py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200/60 dark:border-slate-800 relative overflow-hidden transition-colors">
            
            {/* Background Ambient Glows */}
            <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* 1. SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                        {heading}
                    </h2>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {subheading}
                    </p>
                </div>

                {/* 2. COMPANY EMPLOYEE COUNT & WORKFORCE METRICS HERO BANNER */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 mb-16 shadow-xl border border-blue-800/40">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#3b82f615_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Primary Counter Highlight */}
                        <div className="lg:col-span-6 space-y-3">
                            <div className="flex items-baseline gap-3">
                                <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                                    {employeeCount}
                                </h3>
                            </div>

                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-xl">
                                {employeeStatSubtext}
                            </p>
                        </div>

                        {/* Supporting Badges / Trust Metrics Grid */}
                        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400/30 transition-colors">
                                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 w-fit mb-3">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-black text-white">100%</div>
                                <div className="text-xs font-semibold text-slate-300 mt-0.5">Certified Advisors</div>
                                <div className="text-[11px] text-slate-400 mt-1">ICEF & British Council</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400/30 transition-colors">
                                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 w-fit mb-3">
                                    <Globe2 className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-black text-white">15+</div>
                                <div className="text-xs font-semibold text-slate-300 mt-0.5">Global Locations</div>
                                <div className="text-[11px] text-slate-400 mt-1">London, Asia, Africa</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-emerald-400/30 transition-colors">
                                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 w-fit mb-3">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="text-xl font-black text-white">24 Years</div>
                                <div className="text-xs font-semibold text-slate-300 mt-0.5">Of Excellence</div>
                                <div className="text-[11px] text-slate-400 mt-1">Founded in 2002</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. EMPLOYEES GRID */}
                {employees.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
                        <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white">Our team profiles are currently being updated</h4>
                        <p className="text-sm text-slate-500 mt-1">Please check back soon to meet our team of education counsellors and leadership.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {employees.map((employee) => (
                            <div
                                key={employee.id}
                                className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
                            >
                                {/* Card Top: Profile Photo & Header */}
                                <div>
                                    <div className="flex items-start gap-4 mb-5">
                                        {/* Avatar with subtle glow and zoom on card hover */}
                                        <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0 group-hover:border-blue-500 transition-colors">
                                            {employee.image ? (
                                                <img
                                                    src={employee.image}
                                                    alt={employee.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl">
                                                    {employee.name.charAt(0)}
                                                </div>
                                            )}

                                            {/* Verification Badge */}
                                            <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                        </div>

                                        {/* Name & Role Badge */}
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {employee.name}
                                            </h3>

                                            <div className="mt-1.5 inline-block">
                                                <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/70 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold leading-tight">
                                                    {employee.role}
                                                </span>
                                            </div>

                                            {employee.department && (
                                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                                                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span className="truncate">{employee.department}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SHORT QUOTE */}
                                    {employee.quote && (
                                        <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 mb-4 transition-colors">
                                            <Quote className="w-4 h-4 text-blue-500/40 dark:text-blue-400/30 absolute top-3 right-3" />
                                            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 italic leading-relaxed pr-3">
                                                "{employee.quote}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Card Bottom: Social & Connect Links */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-[11px] text-slate-400">Education Advisor</span>
                                    
                                    <div className="flex items-center gap-2">
                                        {employee.email && (
                                            <a
                                                href={`mailto:${employee.email}`}
                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                                                title={`Email ${employee.name}`}
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {employee.linkedin_url && (
                                            <a
                                                href={employee.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                                                title={`${employee.name} on LinkedIn`}
                                            >
                                                <Linkedin className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
