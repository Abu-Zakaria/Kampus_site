import React from 'react';
import LegalPage from './LegalPage';
import { Award, ShieldCheck, CheckCircle2, Globe, Building2, BookOpen } from 'lucide-react';

export default function Accreditation({ page = null }) {
    const accreditations = [
        {
            title: 'British Council Certified Agency',
            code: 'BC-UK-9942',
            description: 'Officially certified by the British Council for UK Education Agent Training and ethical recruitment standards.',
            badge: 'British Council',
            color: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
        },
        {
            title: 'ICEF Higher Education Agency',
            code: 'ICEF-IAS-8104',
            description: 'Accredited member of the International Consultants for Education and Fairs (ICEF) Agency Status.',
            badge: 'ICEF Accredited',
            color: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
        },
        {
            title: 'UCAS Registered Centre',
            code: 'UCAS-CENTRE-4890',
            description: 'Authorized UCAS application center facilitating direct undergraduate admissions to UK universities.',
            badge: 'UCAS Official',
            color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
        },
        {
            title: 'AIRC Certified Global Consultant',
            code: 'AIRC-USA-2026',
            description: 'American International Recruitment Council certified agency maintaining high standards of transparency in US admissions.',
            badge: 'AIRC Certified',
            color: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
        }
    ];

    return (
        <LegalPage title="Accreditation & Partner Credentials" lastUpdated="August 2026" page={page} badge={null}>
            <p>
                RMS Educational Consultancy Ltd is proud to hold official accreditations and certifications from top global education bodies, British government councils, and international agent standards organizations.
            </p>

            {/* ACCREDITATION BADGES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                {accreditations.map((item, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:border-blue-500 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-xs">
                                <Award className="w-6 h-6" />
                            </div>
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 ${item.color}`}>
                                {item.badge}
                            </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                            {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {item.description}
                        </p>

                        <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Verification Code: <strong>{item.code}</strong></span>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Global Quality Commitment</h2>
            <p>
                We adhere strictly to the London Statement on Ethical International Recruitment and the UK Agent Quality Framework (AQF), ensuring that every student receives truthful, transparent, and student-first counsel throughout their study abroad process.
            </p>
        </LegalPage>
    );
}
