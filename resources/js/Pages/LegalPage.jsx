import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { ShieldCheck, Calendar } from 'lucide-react';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function LegalPage({ title, lastUpdated, page = null, badge = 'Legal & Compliance', children }) {
    const heading = page?.content?.hero_heading || page?.content?.hero?.title || page?.name || title;
    const subtitle = page?.content?.hero_subtitle || page?.content?.hero?.subtitle;

    // Resolve hero image with fallback handling
    const rawHeroImage = page?.content?.hero_image || page?.content?.hero?.image || page?.content?.hero_banner_image || '';
    const heroImage = (rawHeroImage && typeof rawHeroImage === 'string' && rawHeroImage.trim().length > 0)
        ? (rawHeroImage.startsWith('http') || rawHeroImage.startsWith('/') ? rawHeroImage : `/storage/${rawHeroImage}`)
        : null;

    const overlayOpacity = page?.content?.hero_overlay_opacity !== undefined && page?.content?.hero_overlay_opacity !== null && page?.content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(page.content.hero_overlay_opacity, 10)))
        : 75;

    // Resolve badge
    const badgeText = page?.content?.badge_text || page?.content?.hero?.badge || badge || (page?.slug === 'accreditation' ? 'Official Recognitions' : null);

    const displayTitle = page?.meta_title || `${heading || page?.name || title} — RMS Global Education`;
    const metaDescription = page?.meta_description || 'Official compliance, accreditations, terms, and legal documentation for RMS Educational Consultancy Ltd.';
    const metaKeywords = page?.meta_keywords || page?.tags || 'accreditation, privacy policy, terms of service, RMS compliance';

    return (
        <Layout>
            <Head>
                <title>{displayTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={displayTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                {/* 1. HERO BANNER SECTION */}
                <section className={`relative overflow-hidden py-16 lg:py-24 border-b border-slate-200/60 dark:border-slate-800 transition-colors ${
                    heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
                }`}>
                    {/* HERO BANNER IMAGE BACKGROUND WITH DYNAMIC CONTRAST OVERLAYS */}
                    {heroImage ? (
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            <img
                                src={heroImage}
                                alt={heading || 'Hero Banner'}
                                className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />

                            {/* Dark Scrim with Configurable Opacity */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70"
                                style={{ opacity: overlayOpacity / 100 }}
                            />

                            {/* Subtle Vertical Fade Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

                            {/* Ambient Glow Orbs over banner */}
                            <div className="absolute top-[-80px] left-[-80px] w-96 h-96 bg-blue-600/25 rounded-full blur-[130px] pointer-events-none" />
                            <div className="absolute top-[80px] right-[-80px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
                        </div>
                    ) : (
                        <>
                            {/* Ambient Background Light Orbs */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[380px] pointer-events-none overflow-hidden">
                                <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[130px]" />
                                <div className="absolute top-[60px] right-[15%] w-72 h-72 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[110px]" />
                            </div>

                            {/* Subtle Dot Grid Background Pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                        </>
                    )}

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
                        {badgeText && (
                            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs border ${
                                heroImage
                                    ? 'bg-blue-600/30 text-blue-300 border-blue-400/30'
                                    : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800'
                            }`}>
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                                <span>{badgeText}</span>
                            </div>
                        )}

                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
                            heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                        }`}>
                            {heading}
                        </h1>

                        {subtitle && (
                            <p className={`text-base sm:text-lg leading-relaxed font-normal max-w-3xl ${
                                heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                            }`}>
                                {subtitle}
                            </p>
                        )}

                        {lastUpdated && (
                            <div className={`flex items-center gap-2 text-xs font-medium pt-2 ${
                                heroImage ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                            }`}>
                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                <span>Last Updated: {lastUpdated}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* 2. MAIN READABLE CONTENT AREA */}
                <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-12 lg:py-20 border-b border-slate-200/60 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                        {page?.content?.body && (
                            <div
                                className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-line mb-8"
                                dangerouslySetInnerHTML={{ __html: page.content.body }}
                            />
                        )}
                        {(!page?.content?.body || page?.slug === 'accreditation') && children}
                    </div>

                    {/* DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                    {page?.content?.sections && Array.isArray(page.content.sections) && page.content.sections.length > 0 && (
                        <div className="mt-12">
                            <DynamicPageSections sections={page.content.sections} />
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
