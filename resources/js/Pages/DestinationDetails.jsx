import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import {
    Globe,
    Building2,
    BookOpen,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    MapPin,
    GraduationCap,
    Award
} from 'lucide-react';
import ConsultationBanner from '../Components/ConsultationBanner';
import FaqSection from '../Components/FaqSection';

export default function DestinationDetails({ country = null }) {
    const defaultCountry = {
        name: 'United Kingdom',
        country_code: 'GB',
        subtitle: '150+ Partner Universities',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
        features: ['Up to 3 Years Post-Study Work Visa', 'Scholarships up to £10,000'],
        universities: [
            {
                id: 1,
                name: 'University of Oxford',
                slug: 'university-of-oxford',
                location: 'Oxford, United Kingdom',
                cover_image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
                courses_count: 12,
            },
            {
                id: 2,
                name: 'University of Cambridge',
                slug: 'university-of-cambridge',
                location: 'Cambridge, United Kingdom',
                cover_image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
                courses_count: 8,
            }
        ]
    };

    const currentCountry = country || defaultCountry;
    const universities = currentCountry.universities || [];

    return (
        <Layout>
            <Head title={`Study in ${currentCountry.name} —  RMS Global Education`} />

            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">

                {/* 1. HERO BANNER */}
                <div className="relative bg-slate-950 text-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-800">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={currentCountry.image || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80'}
                            alt={currentCountry.name}
                            className="w-full h-full object-cover opacity-35"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3.5 py-1 rounded-full bg-blue-600/90 text-white text-xs font-black uppercase tracking-wider font-mono shadow-md">
                                {currentCountry.country_code || 'DEST'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                                <Globe className="w-3.5 h-3.5 text-blue-400" />
                                <span>Official Study Destination</span>
                            </span>
                        </div>

                        <div className="space-y-3 max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                                Study in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white">{currentCountry.name}</span>
                            </h1>
                            {currentCountry.subtitle && (
                                <p className="text-lg sm:text-xl text-blue-200 font-semibold">
                                    {currentCountry.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Bullet Highlights */}
                        {Array.isArray(currentCountry.features) && currentCountry.features.length > 0 && (
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/15">
                                {currentCountry.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold text-slate-200">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. UNIVERSITIES GRID SECTION */}
                <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                    <Building2 className="w-4 h-4" />
                                    <span>PARTNER INSTITUTIONS</span>
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Universities in {currentCountry.name}
                                </h2>
                            </div>
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                                {universities.length} Institutions Available
                            </span>
                        </div>

                        {universities.length === 0 ? (
                            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
                                <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Universities updating soon
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                    We are currently adding more partner campuses for {currentCountry.name}. Contact our counseling team for immediate admission lists.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {universities.map((uni) => (
                                    <div
                                        key={uni.id}
                                        className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* Cover Image */}
                                            <div className="relative h-48 overflow-hidden bg-slate-800">
                                                <img
                                                    src={uni.cover_image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'}
                                                    alt={uni.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                                                    <span className="text-xs font-bold flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                                        <span className="truncate">{uni.location || currentCountry.name}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body Details */}
                                            <div className="p-6 space-y-3">
                                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {uni.name}
                                                </h3>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {uni.description || `Top accredited university located in ${currentCountry.name} offering world-class undergraduate and postgraduate degree programs.`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="p-6 pt-0">
                                            <Link
                                                href={`/universities/${uni.slug}`}
                                                className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                                            >
                                                <span>View Campus & Courses</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Consultation Trust Banner */}
                        <ConsultationBanner />

                    </div>
                </section>

                {/* FAQ Accordion Section */}
                <FaqSection />

            </div>
        </Layout>
    );
}
