import React, { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
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
    Filter,
    RotateCcw,
    Award,
    X,
    User,
    Mail,
    Phone,
    Copy,
    Check,
    Loader2,
    BookOpen,
    Send
} from 'lucide-react';

import DynamicPageSections from '../Components/DynamicPageSections';

const BADGE_COLOR_MAP = {
    blue: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800',
    purple: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800',
    indigo: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800',
    emerald: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800',
    amber: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800',
    rose: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800',
};

const getBadgeColorClasses = (color) => {
    if (!color) return BADGE_COLOR_MAP.blue;
    if (BADGE_COLOR_MAP[color]) return BADGE_COLOR_MAP[color];
    return color;
};

export const getCountryFlagEmoji = (code, countryName = '') => {
    if (code && typeof code === 'string' && code.trim().length === 2) {
        try {
            return String.fromCodePoint(
                ...code.trim().toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
            );
        } catch {
            // fallback
        }
    }
    const nameMap = {
        'united kingdom': '🇬🇧',
        'uk': '🇬🇧',
        'great britain': '🇬🇧',
        'united states': '🇺🇸',
        'united states of america': '🇺🇸',
        'usa': '🇺🇸',
        'us': '🇺🇸',
        'finland': '🇫🇮',
        'united arab emirates': '🇦🇪',
        'uae': '🇦🇪',
        'dubai': '🇦🇪',
        'dubai (uae)': '🇦🇪',
        'canada': '🇨🇦',
        'australia': '🇦🇺',
        'germany': '🇩🇪',
        'ireland': '🇮🇪',
        'india': '🇮🇳',
        'nigeria': '🇳🇬',
        'japan': '🇯🇵',
        'brazil': '🇧🇷',
        'south africa': '🇿🇦',
        'france': '🇫🇷',
        'china': '🇨🇳',
        'malaysia': '🇲🇾',
        'sweden': '🇸🇪',
        'netherlands': '🇳🇱',
        'new zealand': '🇳🇿',
        'singapore': '🇸🇬',
        'italy': '🇮🇹',
        'spain': '🇪🇸',
        'switzerland': '🇨🇭',
        'south korea': '🇰🇷',
    };
    if (countryName) {
        const lower = countryName.trim().toLowerCase();
        if (nameMap[lower]) return nameMap[lower];
    }
    return '';
};

const doesCountryMatch = (selectedCountry, scholarshipCountry, adminCountries = []) => {
    if (!selectedCountry || selectedCountry === 'All') return true;
    if (!scholarshipCountry) return false;

    const sel = selectedCountry.trim().toLowerCase();
    const item = scholarshipCountry.trim().toLowerCase();

    if (sel === item) return true;
    if (item.includes(sel) || sel.includes(item)) return true;

    // Direct alias groups
    const aliasGroups = [
        ['uk', 'united kingdom', 'great britain', 'gb', 'britain'],
        ['usa', 'united states', 'united states of america', 'us'],
        ['uae', 'united arab emirates', 'dubai', 'ae', 'dubai (uae)'],
    ];

    for (const group of aliasGroups) {
        const selInGroup = group.some(alias => sel === alias || sel.includes(alias));
        const itemInGroup = group.some(alias => item === alias || item.includes(alias));
        if (selInGroup && itemInGroup) return true;
    }

    // Lookup ISO code of selectedCountry from adminCountries
    const matchedAdmin = adminCountries.find(c => c.name?.toLowerCase() === sel);
    if (matchedAdmin && matchedAdmin.country_code) {
        const code = matchedAdmin.country_code.toLowerCase();
        if (item === code || item.includes(code)) return true;
    }

    return false;
};

const DEFAULT_SCHOLARSHIPS = [
    {
        id: 1,
        name: 'UK GREAT Scholarship',
        country: 'UK',
        flag: '🇬🇧',
        amount: 'Up to £10,000',
        deadline: 'June 2026',
        type: 'Postgraduate',
        description: 'Offered by the UK government and participating universities for outstanding international postgraduate students.',
        badgeColor: 'blue',
        is_active: true
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
        badgeColor: 'purple',
        is_active: true
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
        badgeColor: 'indigo',
        is_active: true
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
        badgeColor: 'amber',
        is_active: true
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
        badgeColor: 'emerald',
        is_active: true
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
        badgeColor: 'rose',
        is_active: true
    },
];

export default function Scholarships({ page = null, countries = [] }) {
    const metaTitle = page?.meta_title || 'International Scholarships Finder — Kampus EduConsult';
    const metaDescription = page?.meta_description || 'Explore merit-based, need-based, and government-funded scholarships to study in the UK, USA, Canada, and Europe.';
    const metaKeywords = page?.meta_keywords || 'study abroad scholarships, UK great scholarship, Fulbright, tuition waiver';

    const heroHeading = page?.content?.hero_heading || page?.content?.hero?.title;
    const heroSubtitle = page?.content?.hero_subtitle || page?.content?.hero?.subtitle;

    const sectionHeading = page?.content?.scholarships_heading || 'Available Scholarships';
    const sectionSubtitle = page?.content?.scholarships_subtitle || 'Verified funding opportunities for Fall 2026 / Spring 2027 intakes';

    // Active scholarships list from DB or fallback
    const allScholarships = useMemo(() => {
        const dbList = page?.content?.scholarships;
        if (Array.isArray(dbList) && dbList.length > 0) {
            return dbList.filter(item => item.is_active !== false);
        }
        return DEFAULT_SCHOLARSHIPS;
    }, [page?.content?.scholarships]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedCountry, setSelectedCountry] = useState('All');

    // Dynamic Country Options from Admin Panel (http://127.0.0.1:8000/admin/countries)
    const countryOptions = useMemo(() => {
        if (Array.isArray(countries) && countries.length > 0) {
            return countries.map(c => ({
                id: c.id,
                name: c.name,
                code: c.country_code,
                flag: getCountryFlagEmoji(c.country_code, c.name),
            }));
        }

        // Fallback to scholarships data if countries table is not loaded
        const map = new Map();
        allScholarships.forEach(s => {
            if (s.country && !map.has(s.country)) {
                map.set(s.country, s.flag || getCountryFlagEmoji('', s.country));
            }
        });
        return Array.from(map.entries()).map(([country, flag]) => ({
            id: country,
            name: country,
            code: '',
            flag,
        }));
    }, [countries, allScholarships]);

    // Dynamic Level Options extracted from scholarships
    const levelOptions = useMemo(() => {
        const types = new Set();
        allScholarships.forEach(s => {
            if (s.type) {
                // If compound (e.g. "Postgraduate & PhD"), also allow selecting base
                types.add(s.type);
            }
        });
        // Common standard buttons
        const defaults = ['All', 'Postgraduate', 'Undergraduate'];
        const additional = Array.from(types).filter(t => !['Postgraduate', 'Undergraduate'].includes(t));
        return [...defaults, ...additional];
    }, [allScholarships]);

    const filteredScholarships = useMemo(() => {
        return allScholarships.filter(s => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                !searchQuery ||
                (s.name || '').toLowerCase().includes(query) ||
                (s.country || '').toLowerCase().includes(query) ||
                (s.type || '').toLowerCase().includes(query) ||
                (s.amount || '').toLowerCase().includes(query);

            const matchesType =
                selectedType === 'All' ||
                s.type === selectedType ||
                (s.type || '').toLowerCase().includes(selectedType.toLowerCase());

            const matchesCountry = doesCountryMatch(selectedCountry, s.country, countries);

            return matchesSearch && matchesType && matchesCountry;
        });
    }, [allScholarships, searchQuery, selectedType, selectedCountry, countries]);

    const { auth } = usePage().props;

    // Apply For Scholarship Modal State
    const [applyModalScholarship, setApplyModalScholarship] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [submissionSuccess, setSubmissionSuccess] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        nationality: '',
        highest_qualification: "Bachelor's Degree",
        gpa: '',
        desired_intake: 'Fall 2026',
        notes: '',
    });

    const handleApplyClick = (scholarship) => {
        setApplyModalScholarship(scholarship);
        setSubmissionSuccess(null);
        setFormErrors({});
        setIsCopied(false);
        setFormData({
            full_name: auth?.user?.name || '',
            email: auth?.user?.email || '',
            phone: auth?.user?.phone || '',
            nationality: '',
            highest_qualification: "Bachelor's Degree",
            gpa: '',
            desired_intake: 'Fall 2026',
            notes: '',
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!applyModalScholarship || isSubmitting) return;

        setIsSubmitting(true);
        setFormErrors({});

        try {
            const payload = {
                scholarship_name: applyModalScholarship.name,
                destination_country: applyModalScholarship.country || '',
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                nationality: formData.nationality,
                highest_qualification: formData.highest_qualification,
                gpa: formData.gpa,
                desired_intake: formData.desired_intake,
                notes: formData.notes,
            };

            const response = await axios.post('/scholarships/apply', payload, {
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (response.data?.success) {
                setSubmissionSuccess(response.data.application_no || 'SCH-SUCCESS');
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setFormErrors(error.response.data.errors);
            } else {
                alert('An error occurred while submitting your application. Please check your connection and try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyRef = () => {
        if (!submissionSuccess) return;
        navigator.clipboard.writeText(submissionSuccess);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedType('All');
        setSelectedCountry('All');
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
                                className="w-full sm:w-56 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                            >
                                <option value="All">All Countries</option>
                                {countryOptions.map(opt => (
                                    <option key={opt.id || opt.name} value={opt.name}>
                                        {opt.name} {opt.flag}
                                    </option>
                                ))}
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
                                    {sectionHeading} ({filteredScholarships.length})
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {sectionSubtitle}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Level:</span>
                                {levelOptions.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                            selectedType === type
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* EMPTY STATE OR GRID LAYOUT */}
                        {filteredScholarships.length === 0 ? (
                            <div className="py-16 text-center rounded-3xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                                <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    No scholarships found matching your criteria
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                    Try searching with different keywords or reset your filters to view all available funding options.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset All Filters</span>
                                </button>
                            </div>
                        ) : (
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
                                                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${getBadgeColorClasses(s.badgeColor)}`}>
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
                                            onClick={() => handleApplyClick(s)}
                                            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <span>Apply For Scholarship</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}

                    </div>
                </section>

                {/* 3. ROADMAP SECTION */}
                <JourneyProcess />

                {/* 4. CTA BANNER SECTION AT BOTTOM */}
                <section className="py-14 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border-y border-slate-800 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="space-y-2 max-w-2xl">
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

            {/* 7. APPLICATION MODAL POPUP */}
            {applyModalScholarship && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
                            <div className="space-y-1 pr-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl" role="img" aria-label="flag">
                                        {applyModalScholarship.flag || '🎓'}
                                    </span>
                                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                        Official Application
                                    </span>
                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                        {applyModalScholarship.country}
                                    </span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                                    {applyModalScholarship.name}
                                </h3>
                                <div className="flex items-center gap-3 pt-1 text-xs">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                        Award: {applyModalScholarship.amount}
                                    </span>
                                    {applyModalScholarship.deadline && (
                                        <span className="text-slate-500 dark:text-slate-400">
                                            Deadline: {applyModalScholarship.deadline}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setApplyModalScholarship(null)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto">
                            {submissionSuccess ? (
                                /* SUCCESS CELEBRATION VIEW */
                                <div className="py-6 text-center space-y-5">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                                        <CheckCircle2 className="w-9 h-9" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">
                                            Application Received!
                                        </h4>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                                            Your application for <strong className="text-blue-600 dark:text-blue-400">{applyModalScholarship.name}</strong> has been logged in our evaluation queue.
                                        </p>
                                    </div>

                                    {/* Application Reference Box */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto space-y-2">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                            Application Reference ID
                                        </span>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-base font-mono font-black text-slate-900 dark:text-white">
                                                {submissionSuccess}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleCopyRef}
                                                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                                                title="Copy Reference ID"
                                            >
                                                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-700 dark:text-blue-300 max-w-md mx-auto leading-relaxed">
                                        A senior scholarship counselor will review your academic background and reach out via WhatsApp or Email within 24-48 business hours.
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setApplyModalScholarship(null)}
                                        className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                                    >
                                        Done & Continue Browsing
                                    </button>
                                </div>
                            ) : (
                                /* APPLICATION FORM */
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                placeholder="e.g. Sarah Jenkins"
                                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                                                    formErrors.full_name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                                } text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                            />
                                            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        </div>
                                        {formErrors.full_name && (
                                            <span className="text-[11px] text-rose-500 font-medium block mt-1">
                                                {formErrors.full_name[0]}
                                            </span>
                                        )}
                                    </div>

                                    {/* Email & Phone Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="sarah@example.com"
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                                                        formErrors.email ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                                    } text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                                />
                                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                            </div>
                                            {formErrors.email && (
                                                <span className="text-[11px] text-rose-500 font-medium block mt-1">
                                                    {formErrors.email[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                                Phone / WhatsApp *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+44 7123 456789"
                                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                                                        formErrors.phone ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                                    } text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                                />
                                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                            </div>
                                            {formErrors.phone && (
                                                <span className="text-[11px] text-rose-500 font-medium block mt-1">
                                                    {formErrors.phone[0]}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Country of Residence & Preferred Intake */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                                Current Country / Nationality
                                            </label>
                                            <select
                                                value={formData.nationality}
                                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="">-- Select Your Country --</option>
                                                {countryOptions.map(c => (
                                                    <option key={c.id || c.name} value={c.name}>
                                                        {c.name} {c.flag}
                                                    </option>
                                                ))}
                                                <option value="Other">Other / International</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                                Desired Intake
                                            </label>
                                            <select
                                                value={formData.desired_intake}
                                                onChange={(e) => setFormData({ ...formData, desired_intake: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="Fall 2026">Fall 2026 (Sep / Oct)</option>
                                                <option value="Spring 2027">Spring 2027 (Jan / Feb)</option>
                                                <option value="Summer 2027">Summer 2027</option>
                                                <option value="Fall 2027">Fall 2027</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Highest Qualification & GPA */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                                Highest Qualification
                                            </label>
                                            <select
                                                value={formData.highest_qualification}
                                                onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="Bachelor's Degree">Bachelor's Degree</option>
                                                <option value="Master's Degree">Master's Degree</option>
                                                <option value="High School / A-Levels">High School / A-Levels</option>
                                                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                                                <option value="PhD / Doctorate">PhD / Doctorate</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                                Recent GPA / Score
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.gpa}
                                                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                                placeholder="e.g. 3.8 / 4.0 or 85%"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Personal Statement / Questions */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                            Brief Statement / Background / Remarks
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Tell us about your target major, intended course, or any specific funding questions..."
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setApplyModalScholarship(null)}
                                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Submitting Application...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    <span>Submit Application</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </form>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </Layout>
    );
}
