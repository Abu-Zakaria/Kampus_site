import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';
import {
    Sparkles,
    Calendar,
    GraduationCap,
    Globe,
    CheckCircle2,
    ArrowRight,
    Search,
    DollarSign,
    ShieldCheck,
    Filter
} from 'lucide-react';

import DynamicPageSections from '../Components/DynamicPageSections';

export default function Scholarships({ page = null }) {
    const metaTitle = page?.meta_title || 'International Scholarships Finder — Kampus EduConsult';
    const metaDescription = page?.meta_description || 'Explore merit-based, need-based, and government-funded scholarships to study in the UK, USA, Canada, and Europe.';
    const metaKeywords = page?.meta_keywords || 'study abroad scholarships, UK great scholarship, Fulbright, tuition waiver';

    const heroHeading = page?.content?.hero_heading || page?.content?.hero?.title;
    const heroSubtitle = page?.content?.hero_subtitle || page?.content?.hero?.subtitle;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');

    const scholarships = [
        {
            id: 1,
            name: 'UK GREAT Scholarship',
            country: 'UK',
            flag: '🇬🇧',
            amount: 'Up to £10,000',
            deadline: 'June 2026',
            type: 'Postgraduate',
            description: 'Offered by the UK government and participating universities for outstanding international postgraduate students.',
            badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
        },
        {
            id: 2,
            name: 'Fulbright Foreign Student Program',
            country: 'USA',
            flag: '🇺🇸',
            amount: 'Full Tuition + Stipend',
            deadline: 'October 2026',
            type: 'Postgraduate & PhD',
            description: 'Enables graduate students, young professionals and artists from abroad to study and conduct research in the US.',
            badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
        },
        {
            id: 3,
            name: 'Finland Government Scholarship',
            country: 'Finland',
            flag: '🇫🇮',
            amount: '50% - 100% Waiver',
            deadline: 'January 2026',
            type: 'Undergraduate & Masters',
            description: 'Tuition fee waivers and living cost grants offered by Finnish higher education institutions for international applicants.',
            badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
        },
        {
            id: 4,
            name: 'Dubai Academic Excellence Award',
            country: 'Dubai (UAE)',
            flag: '🇦🇪',
            amount: 'Up to $15,000',
            deadline: 'July 2026',
            type: 'Undergraduate',
            description: 'Merit-based financial awards for top-performing high school graduates enrolling in UK branch campuses in Dubai.',
            badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
        },
        {
            id: 5,
            name: 'Chevening UK Excellence Award',
            country: 'UK',
            flag: '🇬🇧',
            amount: '100% Fully Funded',
            deadline: 'November 2026',
            type: 'Postgraduate',
            description: 'The UK government’s global scholarship programme, funded by the Foreign, Commonwealth and Development Office.',
            badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
        },
        {
            id: 6,
            name: 'Australia Awards Scholarship',
            country: 'Australia',
            flag: '🇦🇺',
            amount: 'Full Tuition & Airfare',
            deadline: 'April 2026',
            type: 'Postgraduate',
            description: 'Long-term awards administered by the Department of Foreign Affairs and Trade for students from partner countries.',
            badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
        },
    ];

    const filteredScholarships = scholarships.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              s.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All' || s.type.includes(selectedType);
        const matchesCountry = selectedCountry === 'All' || s.country === selectedCountry;
        return matchesSearch && matchesType && matchesCountry;
    });

    const handleApplyClick = (scholarshipName) => {
        alert(`Scholarship eligibility evaluation requested for "${scholarshipName}". A senior counselor will contact you shortly.`);
    };

    const handleOpenBookCall = () => {
        const callBtn = document.querySelector('button:has(.lucide-phone-call)');
        if (callBtn) {
            callBtn.click();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN SCHOLARSHIPS PAGE CONTAINER WITH MODERN SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                
                {/* 1. HERO SECTION */}
                <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                    
                    {/* Ambient Light Orbs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
                        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[130px]" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto">
                            {heroHeading ? (
                                heroHeading
                            ) : (
                                <>
                                    Fund your{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                                        global future
                                    </span>
                                </>
                            )}
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
                            {heroSubtitle || 'Explore merit-based, need-based, and country-specific scholarships to make your study abroad journey affordable.'}
                        </p>

                        {/* FILTER BAR */}
                        <div className="pt-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative flex-1 w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search scholarship name, country, or degree..."
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                            </div>

                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full sm:w-44 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                            >
                                <option value="All">All Countries</option>
                                <option value="UK">UK 🇬🇧</option>
                                <option value="USA">USA 🇺🇸</option>
                                <option value="Finland">Finland 🇫🇮</option>
                                <option value="Dubai (UAE)">Dubai 🇦🇪</option>
                                <option value="Australia">Australia 🇦🇺</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 2. SCHOLARSHIPS GRID */}
                <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                    Available Scholarships ({filteredScholarships.length})
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Verified funding opportunities for Fall 2026 / Spring 2027 intakes
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Level:</span>
                                {['All', 'Postgraduate', 'Undergraduate'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                            selectedType === type
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* GRID LAYOUT (1 COL MOBILE, 3 COLS DESKTOP) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredScholarships.map((s) => (
                                <div
                                    key={s.id}
                                    className="group relative p-7 rounded-3xl bg-slate-50/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        
                                        {/* Flag & Type Badge Header */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl" title={s.country}>
                                                {s.flag}
                                            </span>
                                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200/80 dark:border-slate-700 ${s.badgeColor}`}>
                                                {s.type}
                                            </span>
                                        </div>

                                        {/* Scholarship Title */}
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {s.name}
                                            </h3>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                Destination: <strong className="text-slate-700 dark:text-slate-200">{s.country}</strong>
                                            </span>
                                        </div>

                                        {/* PROMINENT AMOUNT BADGE */}
                                        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-700/80 flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Award Amount:</span>
                                            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                                                {s.amount}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                                            {s.description}
                                        </p>

                                        {/* Deadline Info */}
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
                                            <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                                            <span>Deadline: <strong className="text-slate-800 dark:text-slate-200">{s.deadline}</strong></span>
                                        </div>

                                    </div>

                                    {/* Action Apply Button */}
                                    <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => handleApplyClick(s.name)}
                                            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <span>Apply For Scholarship</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* 3. ROADMAP SECTION */}
                <JourneyProcess />

                {/* 4. CTA BANNER SECTION AT BOTTOM */}
                <section className="py-14 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-y border-slate-800 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="space-y-2 max-w-2xl">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/30">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                1-on-1 Funding Evaluation
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                                Not sure which one you qualify for?
                            </h3>
                            <p className="text-slate-300 text-sm">
                                Talk to our funding experts. We evaluate your CGPA, profile, and target course to match you with max tuition waivers.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-book-call-modal'))}
                            className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-extrabold shadow-lg shadow-blue-600/30 hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
                        >
                            Book Free Consultation
                        </button>
                    </div>
                </section>

                {/* 5. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 6. FAQ SECTION */}
                <FaqSection />

            </div>
        </Layout>
    );
}
