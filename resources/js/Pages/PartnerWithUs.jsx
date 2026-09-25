import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import PartnerHero from '../Components/PartnerHero';
import PartnerBenefits from '../Components/PartnerBenefits';
import PartnerForm from '../Components/PartnerForm';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function PartnerWithUs({ page = null }) {
    const metaTitle = page?.meta_title || 'Become a Partner —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Partner with  RMS Group to recruit high-caliber international students with our verified agent network and compliance screening.';
    const metaKeywords = page?.meta_keywords || 'university partner, education agent partner, student recruitment partner';

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN CONTAINER WRAPPED IN LAYOUT WITH DARK MODE & SECTION SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-purple-600 selection:text-white bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

                {/* 1. HERO SECTION */}
                <PartnerHero content={page?.content || {}} />

                {/* 2. PARTNER BENEFITS GRID */}
                <PartnerBenefits />

                {/* 3. PARTNER APPLICATION FORM */}
                <PartnerForm />

                {/* 4. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 5. 5-STEP ADMISSION ROADMAP */}
                <JourneyProcess />

                {/* 6. FAQ ACCORDION SECTION */}
                <FaqSection />

            </div>
        </Layout>
    );
}
