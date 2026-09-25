import React from 'react';
import Layout from '../Layouts/Layout';
import SeoHead from '../Components/SeoHead';
import HeroSection from '../Components/HeroSection';
import ServicesGrid from '../Components/ServicesGrid';
import Destinations from '../Components/Destinations';
import JourneyProcess from '../Components/JourneyProcess';
import SuccessStories from '../Components/SuccessStories';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function Home({ page = null, universities = [], courses = [], countries = [], totalUniversitiesCount = 0, totalCountriesCount = 0, successStories = [], faqs = [] }) {
    // Dynamic SEO values from database with sensible defaults
    const metaTitle = page?.meta_title || ' RMS Global Education — Study Abroad Educational Consultancy';
    const metaDescription = page?.meta_description || 'Empowering ambitious students worldwide to gain admission into top global universities in UK, USA, Canada, Australia & Europe.';
    const metaKeywords = page?.meta_keywords || 'study abroad, UK universities, student visa guidance, scholarships';
    const contentData = page?.content || {};

    // Handlers to trigger Navbar AI Search & Book Call Modals from components
    const handleOpenAiSearch = () => {
        const aiSearchBtn = document.querySelector('button[aria-label="Open AI Search"], button:has(.animate-pulse)');
        if (aiSearchBtn) {
            aiSearchBtn.click();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleOpenBookCall = () => {
        const allButtons = Array.from(document.querySelectorAll('button'));
        const callBtn = allButtons.find(b => b.textContent.includes('Book a Call') || b.textContent.includes('Book a Free Call'));
        if (callBtn) {
            callBtn.click();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Layout>
            {/* DYNAMIC INERTIA SEO HEAD COMPONENT */}
            <SeoHead
                title={page?.meta_title}
                description={page?.meta_description}
            />

            {/* MAIN HOMEPAGE CONTAINER WITH CLEAN SECTION SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">

                {/* 1. HERO SECTION WITH DYNAMIC CMS CONTENT */}
                <HeroSection
                    onOpenAiSearch={handleOpenAiSearch}
                    onOpenBookCall={handleOpenBookCall}
                    content={contentData}
                    countries={countries}
                    totalUniversitiesCount={totalUniversitiesCount}
                    totalCountriesCount={totalCountriesCount}
                />

                {/* 2. SERVICES GRID SECTION */}
                <ServicesGrid />

                {/* 3. DESTINATIONS GRID SECTION (DYNAMICALLY RANDOMIZED COUNTRIES FROM DATABASE) */}
                <Destinations countries={countries} />

                {/* 4. JOURNEY PROCESS TIMELINE SECTION */}
                <JourneyProcess />

                {/* 5. STUDENT SUCCESS STORIES MARQUEE SECTION */}
                <SuccessStories stories={successStories} />

                {/* 6. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {contentData?.sections && (
                    <DynamicPageSections sections={contentData.sections} />
                )}

                {/* 7. FAQ ACCORDION SECTION */}
                <FaqSection faqs={faqs} />

            </div>
        </Layout>
    );
}
