import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import CoursesHero from '../Components/CoursesHero';
import CourseFilters from '../Components/CourseFilters';
import CourseList from '../Components/CourseList';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function Courses() {
    const { courses = {}, destinations = [], levels = [], popularSearches = [], filters = {}, page = null } = usePage().props;

    const metaTitle = page?.meta_title || 'Find Degree Courses & Programmes —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Browse thousands of undergraduate, postgraduate, and foundation degrees with scholarships across top global universities.';
    const metaKeywords = page?.meta_keywords || 'degrees, university courses, MBA abroad, computer science degree UK';

    const filtersData = (filters && typeof filters === 'object' && !Array.isArray(filters)) ? filters : {};

    const [searchQuery, setSearchQuery] = useState(typeof filtersData.search === 'string' ? filtersData.search : '');
    const [selectedLevels, setSelectedLevels] = useState(
        filtersData.level ? (Array.isArray(filtersData.level) ? filtersData.level : String(filtersData.level).split(',')) : []
    );
    const [selectedDestination, setSelectedDestination] = useState(typeof filtersData.country === 'string' ? filtersData.country : 'All');
    const [sortBy, setSortBy] = useState(typeof filtersData.sort === 'string' ? filtersData.sort : 'popularity');
    const isFirstMount = useRef(true);

    // Inertia SPA visit handler with preserveState and preserveScroll
    const fetchResults = (search, lvls, dest, srt) => {
        const url = typeof route === 'function' ? route('courses.index') : '/courses';
        router.get(url, {
            search: search || undefined,
            level: lvls && lvls.length > 0 ? lvls.join(',') : undefined,
            country: dest === 'All' ? undefined : dest,
            sort: srt !== 'popularity' ? srt : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // 300ms Search Debouncer
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchResults(searchQuery, selectedLevels, selectedDestination, sortBy);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle Study Level checkbox toggle
    const handleLevelToggle = (lvl) => {
        const nextLevels = selectedLevels.includes(lvl)
            ? selectedLevels.filter((item) => item !== lvl)
            : [...selectedLevels, lvl];
        setSelectedLevels(nextLevels);
        fetchResults(searchQuery, nextLevels, selectedDestination, sortBy);
    };

    // Handle Destination selection
    const handleDestinationChange = (dest) => {
        setSelectedDestination(dest);
        fetchResults(searchQuery, selectedLevels, dest, sortBy);
    };

    // Handle Sort change
    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        fetchResults(searchQuery, selectedLevels, selectedDestination, newSort);
    };

    // Reset all filters
    const handleResetAll = () => {
        setSearchQuery('');
        setSelectedLevels([]);
        setSelectedDestination('All');
        setSortBy('popularity');
        fetchResults('', [], 'All', 'popularity');
    };

    const hasActiveFilters = Boolean(searchQuery.trim()) || selectedLevels.length > 0 || selectedDestination !== 'All';

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN COURSES PAGE CONTAINER WITH TAILWIND SECTION SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">

                {/* 1. COURSES HERO WITH GLOBAL SEARCH BAR & POPULAR SEARCHES */}
                <CoursesHero
                    initialSearch={searchQuery}
                    popularSearches={popularSearches}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={(val) => {
                        setSearchQuery(val);
                        fetchResults(val, selectedLevels, selectedDestination, sortBy);
                    }}
                    content={page?.content || {}}
                />

                {/* 2. PAGE LAYOUT STRUCTURE: RESPONSIVE FLEX CONTAINER (FILTERS LEFT, COURSE LIST RIGHT) */}
                <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-8">

                        {/* LEFT SIDE: DYNAMIC COURSE FILTERS SIDEBAR */}
                        <CourseFilters
                            availableLevels={levels}
                            availableDestinations={destinations}
                            selectedLevels={selectedLevels}
                            selectedDestination={selectedDestination}
                            onLevelToggle={handleLevelToggle}
                            onDestinationChange={handleDestinationChange}
                            onClearAll={handleResetAll}
                            hasActiveFilters={hasActiveFilters}
                        />

                        {/* RIGHT SIDE: DYNAMIC COURSE LIST & INERTIA PAGINATION */}
                        <div className="w-full flex-1 space-y-6">
                            <CourseList
                                courses={courses}
                                searchQuery={searchQuery}
                                selectedLevels={selectedLevels}
                                selectedDestination={selectedDestination}
                                sortBy={sortBy}
                                onSortChange={handleSortChange}
                                onResetFilters={handleResetAll}
                            />

                            {/* INERTIA SPA PAGINATION SECTION WITH preserveScroll={true} */}
                            {courses?.links && courses.links.length > 3 && (
                                <div className="flex items-center justify-center mt-10 space-x-2 flex-wrap gap-y-2">
                                    {courses.links.map((link, index) => (
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                preserveScroll={true}
                                                preserveState={true}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border shadow-md ${link.active
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
                                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white'
                                                    }`}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg cursor-not-allowed opacity-50"
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* 3. 5-STEP ADMISSION ROADMAP */}
                <JourneyProcess />

                {/* 4. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 5. FAQ ACCORDION SECTION */}
                <FaqSection />

            </div>
        </Layout>
    );
}
