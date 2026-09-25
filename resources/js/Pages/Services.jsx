import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import ServicesHero from '../Components/ServicesHero';
import DetailedServices from '../Components/DetailedServices';
import JourneyProcess from '../Components/JourneyProcess';
import ServicesCta from '../Components/ServicesCta';
import FaqSection from '../Components/FaqSection';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function Services({ services = [], faqs = [], page = null }) {
    const metaTitle = page?.meta_title || 'Our Services —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Comprehensive university admission, scholarship application, student visa processing, and pre-departure briefings.';
    const metaKeywords = page?.meta_keywords || 'university admissions, visa guidance, scholarships, statement of purpose counseling';

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
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN SERVICES PAGE CONTAINER WITH TAILWIND SECTION SPACING */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                {/* 1. SERVICES HERO SECTION */}
                <ServicesHero content={page?.content || {}} />

                {/* 2. DETAILED ZIG-ZAG SERVICES BREAKDOWN */}
                <DetailedServices services={services} content={page?.content || {}} />

                {/* 3. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 4. 5-STEP ADMISSION ROADMAP */}
                <JourneyProcess content={page?.content || {}} />

                {/* 5. PREMIUM CTA BANNER SECTION */}
                <ServicesCta onOpenBookCall={handleOpenBookCall} content={page?.content || {}} />

                {/* 6. FREQUENTLY ASKED QUESTIONS (CONTROLLED BY CMS ADMIN) */}
                {(page?.content?.show_faqs !== false && !page?.content?.hide_faqs) && (
                    <FaqSection faqs={faqs} />
                )}
            </div>
        </Layout>
    );
}
