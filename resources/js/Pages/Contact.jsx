import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import ContactHero from '../Components/ContactHero';
import ContactContent from '../Components/ContactContent';
import ContactBranches from '../Components/ContactBranches';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function Contact({ page = null }) {
    const metaTitle = page?.meta_title || 'Contact Us —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Reach our London global headquarters or connect with local branch offices across South Asia, Africa, and Europe.';
    const metaKeywords = page?.meta_keywords || 'contact  RMS, education consultants London, student advisory branch';

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN CONTACT PAGE CONTAINER WITH TAILWIND SECTION SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                {/* 1. CONTACT HERO SECTION */}
                <ContactHero content={page?.content || {}} />

                {/* 2. CONTACT FORM & INFO TWO-COLUMN SECTION */}
                <ContactContent content={page?.content || {}} />

                {/* 3. GLOBAL BRANCHES NETWORK GRID */}
                <ContactBranches content={page?.content || {}} />

                {/* 4. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 5. FAQ ACCORDION SECTION (CONTROLLED BY CMS ADMIN) */}
                {(page?.content?.show_faqs !== false && !page?.content?.hide_faqs) && (
                    <FaqSection />
                )}
            </div>
        </Layout>
    );
}
