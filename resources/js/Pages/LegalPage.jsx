import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import { ShieldCheck, Calendar } from 'lucide-react';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function LegalPage({ title, lastUpdated, page = null, badge = 'Legal & Compliance', children }) {
    const isBadgeHidden = page?.slug === 'accreditation' || page?.slug === 'terms-of-service' || page?.slug === 'terms' || page?.slug === 'privacy-policy' || !badge;
    const displayBadge = isBadgeHidden ? null : badge;
    const displayTitle = page?.meta_title || `${page?.name || title} — RMS EduConsult`;
    const metaDescription = page?.meta_description || 'Official compliance, terms, and legal documentation for RMS Educational Consultancy Ltd.';
    const metaKeywords = page?.meta_keywords || 'privacy policy, terms of service, RMS compliance';

    return (
        <Layout>
            <Head>
                <title>{displayTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={displayTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            <div className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-12 lg:py-20 border-b border-slate-200/60 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* PAGE HEADER */}
                    <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800 space-y-3">
                        {displayBadge && (
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>{displayBadge}</span>
                            </div>
                        )}

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {page?.name || title}
                        </h1>

                        {lastUpdated && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                <span>Last Updated: {lastUpdated}</span>
                            </div>
                        )}
                    </div>

                    {/* MAIN READABLE CONTENT AREA WITH FULL DARK MODE SUPPORT */}
                    <div className="space-y-6 text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                        {page?.content?.body ? (
                            <div
                                className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: page.content.body }}
                            />
                        ) : (
                            children
                        )}
                    </div>

                </div>

                {/* DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <div className="mt-12">
                        <DynamicPageSections sections={page.content.sections} />
                    </div>
                )}
            </div>
        </Layout>
    );
}
