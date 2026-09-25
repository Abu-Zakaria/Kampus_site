import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import {
    Calendar,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Globe,
    Layers,
    Image as ImageIcon,
    Check,
    PhoneCall,
    Award
} from 'lucide-react';

export default function PublicDynamicPage({ page }) {
    const metaTitle = page?.meta_title || `${page?.name} —  RMS Global Education`;
    const metaDescription = page?.meta_description || 'Learn more about  RMS Educational Consultancy services and programs.';
    const metaKeywords = page?.meta_keywords || 'study abroad, university admission, global education';

    const content = page?.content || {};
    const hero = content?.hero || null;
    const sections = Array.isArray(content?.sections) ? content.sections : [];

    // Fallback: If no structured sections exist, check if legacy key-value pairs exist
    const legacyEntries = (!sections || sections.length === 0) && typeof content === 'object'
        ? Object.entries(content).filter(([k]) => k !== 'hero' && k !== 'sections')
        : [];

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

                {/* 1. HERO BANNER */}
                <div className="relative bg-slate-950 text-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-800">
                    {/* Background Image with Dark Overlay */}
                    {hero?.image ? (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={hero.image}
                                alt={hero.title || page?.name}
                                className="w-full h-full object-cover opacity-35"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950" />
                    )}

                    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">

                        {/* Top Badge */}
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-600/90 text-white text-xs font-black uppercase tracking-wider font-mono shadow-md">
                                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                                <span>{hero?.badge || ' RMS Global Education'}</span>
                            </span>
                        </div>

                        {/* Page Title */}
                        <div className="space-y-3 max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                                {hero?.title || page?.name}
                            </h1>
                            {hero?.subtitle && (
                                <p className="text-lg sm:text-xl text-blue-200 font-medium leading-relaxed">
                                    {hero.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Meta Timestamp */}
                        {page?.updated_at && (
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 font-medium pt-2">
                                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                <span>Updated on {new Date(page.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. DYNAMIC CONTENT SECTIONS */}
                {sections.length > 0 ? (
                    <div className="space-y-16 lg:space-y-24 py-16 lg:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        {sections.map((sec, idx) => (
                            <div key={sec.id || idx}>

                                {/* SECTION: IMAGE + CONTENT (SPLIT) */}
                                {sec.type === 'image_text' && (
                                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${sec.image_position === 'left' ? 'lg:flex-row-reverse' : ''
                                        }`}>

                                        {/* Content Side */}
                                        <div className={`space-y-5 text-left ${sec.image ? (sec.image_position === 'left' ? 'lg:col-span-6 lg:order-2' : 'lg:col-span-6 lg:order-1') : 'lg:col-span-12'
                                            }`}>
                                            {sec.subtitle && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800">
                                                    {sec.subtitle}
                                                </div>
                                            )}

                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                                {sec.title}
                                            </h2>

                                            {sec.content && (
                                                <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                                                    {sec.content}
                                                </p>
                                            )}

                                            {/* Bullet Points Highlights */}
                                            {Array.isArray(sec.bullets) && sec.bullets.length > 0 && (
                                                <div className="space-y-2.5 pt-2">
                                                    {sec.bullets.map((b, bIdx) => (
                                                        <div key={bIdx} className="flex items-start gap-3">
                                                            <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                                                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                            </div>
                                                            <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200">
                                                                {b}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Image Side */}
                                        {sec.image && (
                                            <div className={`${sec.image_position === 'left' ? 'lg:col-span-6 lg:order-1' : 'lg:col-span-6 lg:order-2'
                                                }`}>
                                                <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900">
                                                    <img
                                                        src={sec.image}
                                                        alt={sec.title || 'Page Image'}
                                                        className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {/* SECTION: MULTIPLE IMAGES GALLERY GRID */}
                                {sec.type === 'gallery' && (
                                    <div className="space-y-8 text-center sm:text-left">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                {sec.title || 'Photo Gallery'}
                                            </h2>
                                            {sec.subtitle && (
                                                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
                                                    {sec.subtitle}
                                                </p>
                                            )}
                                        </div>

                                        <div className={`grid gap-6 ${sec.columns === 2
                                            ? 'grid-cols-1 md:grid-cols-2'
                                            : sec.columns === 4
                                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                                            }`}>
                                            {(sec.images || []).map((img, imgIdx) => (
                                                <div
                                                    key={imgIdx}
                                                    className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 h-64 sm:h-72"
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={img.caption || `Gallery ${imgIdx}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85 group-hover:opacity-95"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                                    <div className="absolute bottom-0 inset-x-0 p-5 space-y-1 text-left">
                                                        {img.subtitle && (
                                                            <div className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                                                                {img.subtitle}
                                                            </div>
                                                        )}
                                                        <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                                                            {img.caption || 'Campus Highlight'}
                                                        </h4>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* SECTION: FEATURE CARDS GRID */}
                                {sec.type === 'features' && (
                                    <div className="space-y-8 text-center sm:text-left">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                                {sec.title || 'Key Highlights'}
                                            </h2>
                                            {sec.subtitle && (
                                                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
                                                    {sec.subtitle}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                            {(sec.items || []).map((card, cIdx) => (
                                                <div
                                                    key={cIdx}
                                                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 space-y-4 text-left flex flex-col justify-between"
                                                >
                                                    <div className="space-y-3">
                                                        {card.badge && (
                                                            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800">
                                                                {card.badge}
                                                            </span>
                                                        )}
                                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white pt-1">
                                                            {card.title}
                                                        </h3>
                                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                            {card.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* SECTION: PROSE ARTICLE */}
                                {sec.type === 'prose' && (
                                    <div className="max-w-4xl mx-auto space-y-6 text-left">
                                        {sec.title && (
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight border-b border-slate-200 dark:border-slate-800 pb-4">
                                                {sec.title}
                                            </h2>
                                        )}
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                            {sec.content}
                                        </div>
                                    </div>
                                )}

                                {/* SECTION: CTA BANNER */}
                                {sec.type === 'cta' && (
                                    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border border-blue-800/60 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                                        <div className="space-y-2 max-w-2xl">
                                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                                                {sec.title || 'Ready to begin your journey?'}
                                            </h3>
                                            <p className="text-sm sm:text-base text-blue-200">
                                                {sec.subtitle || 'Book a free consultation with our senior educational advisors today.'}
                                            </p>
                                        </div>

                                        <Link
                                            href={sec.button_link || '/contact'}
                                            className="px-8 py-4 rounded-full bg-white text-slate-950 font-extrabold text-sm hover:bg-blue-50 shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                                        >
                                            <span>{sec.button_text || 'Get Started Now'}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                ) : (
                    /* Legacy Content Rendering Fallback */
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
                        {legacyEntries.length > 0 ? (
                            <div className="space-y-6">
                                {legacyEntries.map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </h2>
                                        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line">
                                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 space-y-4">
                                <p className="text-slate-500 dark:text-slate-400 italic">
                                    No content added yet. You can customize this page anytime in the Admin CMS panel.
                                </p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </Layout>
    );
}
