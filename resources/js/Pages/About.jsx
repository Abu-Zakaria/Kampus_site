import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import AboutHero from '../Components/AboutHero';
import AboutMission from '../Components/AboutMission';
import AboutValues from '../Components/AboutValues';
import AboutTeam from '../Components/AboutTeam';
import AboutCommitment from '../Components/AboutCommitment';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function About({ page = null, employees = [], companyStats = {} }) {
    const metaTitle = page?.meta_title || 'About Us — 24 Years of Educational Excellence |  RMS Global Education';
    const metaDescription = page?.meta_description || 'Learn about  RMS Group Ltd, our 24 years of experience, certified counsellors, and global network across 15+ countries.';
    const metaKeywords = page?.meta_keywords || 'about  RMS, study abroad consultants, education agency London';

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN ABOUT PAGE CONTAINER WITH PREMIUM AGENCY SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                {/* 1. ABOUT HERO SECTION */}
                <AboutHero content={page?.content || {}} />

                {/* 2. OUR MISSION SECTION */}
                <AboutMission content={{
                    ...(page?.content?.mission || {}),
                    image: page?.content?.mission?.image || page?.content?.mission_image,
                }} />

                {/* 3. WHAT WE STAND FOR (VALUES SECTION) */}
                <AboutValues content={page?.content?.values || {}} />

                {/* 4. COMPANY WORKFORCE & TEAM SECTION */}
                <AboutTeam employees={employees} companyStats={companyStats} content={page?.content?.team || {}} />

                {/* 5. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 6. OUR COMMITMENT (DARK NAVY ETHICS & ACCREDITATION SECTION) */}
                <AboutCommitment content={page?.content?.commitment || {}} />

                {/* 7. FREQUENTLY ASKED QUESTIONS (CONTROLLED BY CMS ADMIN) */}
                {(page?.content?.show_faqs !== false && !page?.content?.hide_faqs) && (
                    <FaqSection />
                )}
            </div>
        </Layout>
    );
}
