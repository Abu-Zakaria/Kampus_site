import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import UniversitiesHero from '../Components/UniversitiesHero';
import UniversitiesGrid from '../Components/UniversitiesGrid';
import UniversityStatsBanner from '../Components/UniversityStatsBanner';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function Universities() {
    const { universities = {}, destinations = [], quickFilterDestinations = [], filters = {}, page = null } = usePage().props;

    const metaTitle = page?.meta_title || 'Partner Universities —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Browse leading higher education institutions across the UK, USA, Canada, Australia, and Europe with official  RMS representation.';
    const metaKeywords = page?.meta_keywords || 'universities, study abroad partner universities, UK university rankings';

    const filtersData = (filters && typeof filters === 'object' && !Array.isArray(filters)) ? filters : {};

    const [search, setSearch] = useState(typeof filtersData.search === 'string' ? filtersData.search : '');
    const [country, setCountry] = useState(typeof filtersData.country === 'string' ? filtersData.country : 'All');
    const isFirstMount = useRef(true);

    // Inertia SPA visit handler with preserveState and preserveScroll
    const fetchResults = (searchQuery, countryCode) => {
        const url = typeof route === 'function' ? route('universities.index') : '/universities';

        router.get(url, {
            search: searchQuery || undefined,
            country: countryCode === 'All' ? undefined : countryCode
        }, {
            preserveState: true, // Prevents losing focus on search input
            preserveScroll: true, // Prevents scroll jumping
            replace: true // Replaces history state so the back button works cleanly
        });
    };

    // 300ms Search Debouncer
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchResults(search, country);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    // Handle country dropdown and quick filter badges click
    const handleCountryChange = (newCountry) => {
        setCountry(newCountry);
        fetchResults(search, newCountry);
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSearch('');
        setCountry('All');
        fetchResults('', 'All');
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

            {/* MAIN UNIVERSITIES PAGE CONTAINER */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                {/* 1. UNIVERSITIES HERO WITH CONTROLLED SEARCH & DYNAMIC COUNTRY DROPDOWN */}
                <UniversitiesHero
                    destinations={destinations}
                    quickFilters={quickFilterDestinations}
                    searchTerm={search}
                    destination={country}
                    onSearchChange={setSearch}
                    onDestinationChange={handleCountryChange}
                    content={page?.content || {}}
                />

                {/* 2. DYNAMIC PAGINATED UNIVERSITIES GRID (INERTIA SPA) */}
                <UniversitiesGrid
                    universities={universities}
                    searchQuery={search}
                    selectedDestination={country}
                    onResetFilters={handleResetFilters}
                />

                {/* 3. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 4. DARK SLATE GLOBAL NETWORK STATS BANNER */}
                <UniversityStatsBanner />

                {/* 5. ADMISSION ROADMAP */}
                <JourneyProcess />

                {/* 6. FAQ ACCORDION */}
                <FaqSection />
            </div>
        </Layout>
    );
}
