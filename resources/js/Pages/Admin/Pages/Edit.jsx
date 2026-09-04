import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import PageBuilder from '../../../Components/Admin/PageBuilder';
import {
    Save,
    ArrowLeft,
    Globe,
    FileText,
    Sliders,
    Sparkles,
    Lock,
    HelpCircle,
    LayoutTemplate,
    ExternalLink,
    CheckCircle2,
    Upload,
    Image as ImageIcon,
    Trash2,
    Loader2
} from 'lucide-react';

export default function Edit({ page }) {
    const [isUploadingHero, setIsUploadingHero] = useState(false);
    const [uploadHeroError, setUploadHeroError] = useState('');

    const coreSlugs = [
        '/',
        'home',
        'about',
        'services',
        'universities',
        'courses',
        'blog',
        'contact',
        'partner-with-us',
        'partner',
        'scholarships',
        'visa-guide',
        'privacy-policy',
        'terms-of-service',
        'terms',
        'cookie-preferences',
        'accreditation'
    ];

    const isCore = coreSlugs.includes(String(page.slug).toLowerCase());
    const isPolicyPage = ['privacy-policy', 'terms-of-service', 'terms', 'cookie-preferences', 'accreditation'].includes(String(page.slug).toLowerCase());
    const routePath = page.slug === 'home' ? '/' : `/${page.slug}`;

    const { data, setData, processing, errors } = useForm({
        name: page.name || '',
        slug: page.slug || '',
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords || '',
        is_active: Boolean(page.is_active),
        show_in_navbar: Boolean(page.show_in_navbar),
        show_in_footer: Boolean(page.show_in_footer),
        content: page.content || {},
    });

    const handleContentFieldChange = (field, val) => {
        const nextContent = {
            ...(data.content || {}),
            [field]: val,
        };

        // Keep content.hero synchronized as well
        if (['hero_heading', 'hero_subtitle', 'badge_text', 'hero_image', 'hero_overlay_opacity'].includes(field)) {
            nextContent.hero = {
                ...(nextContent.hero || {}),
                title: field === 'hero_heading' ? val : (nextContent.hero?.title || nextContent.hero_heading || ''),
                subtitle: field === 'hero_subtitle' ? val : (nextContent.hero?.subtitle || nextContent.hero_subtitle || ''),
                badge: field === 'badge_text' ? val : (nextContent.hero?.badge || nextContent.badge_text || ''),
                image: field === 'hero_image' ? val : (nextContent.hero?.image || nextContent.hero_image || ''),
                overlay_opacity: field === 'hero_overlay_opacity' ? val : (nextContent.hero?.overlay_opacity || nextContent.hero_overlay_opacity || 75),
            };
        }

        setData('content', nextContent);
    };

    const handleHeroImageUpload = async (file) => {
        if (!file) return;
        setIsUploadingHero(true);
        setUploadHeroError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/admin/pages/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Image upload failed. Max file size is 10MB.');
            }

            const resData = await res.json();
            if (resData.url) {
                handleContentFieldChange('hero_image', resData.url);
            }
        } catch (err) {
            console.error('Hero image upload failed:', err);
            setUploadHeroError(err.message || 'Failed to upload image. Please try again or provide an image URL.');
        } finally {
            setIsUploadingHero(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            is_active: data.is_active ? 1 : 0,
            show_in_navbar: data.show_in_navbar ? 1 : 0,
            show_in_footer: data.show_in_footer ? 1 : 0,
        };

        router.put(`/admin/pages/${page.id}`, payload, {
            onSuccess: () => {
                alert(`Page "${page.name}" updated successfully!`);
            }
        });
    };

    return (
        <AdminLayout title={`Customize Page: ${page.name}`}>
            <Head title={`Customize ${page.name} — Kampus CMS`} />

            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* 1. HEADER ROW WITH BACK BUTTON & SUBMIT ACTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3.5">
                        <Link
                            href="/admin/pages"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {isCore ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                                        <Globe className="w-3 h-3" />
                                        <span>SYSTEM CORE PAGE</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider border border-purple-200 dark:border-purple-800">
                                        <Sparkles className="w-3 h-3" />
                                        <span>CUSTOM DYNAMIC PAGE</span>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                Customize Page: {page.name}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={routePath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                            <ExternalLink className="w-4 h-4 text-blue-500" />
                            <span>Preview Live Page</span>
                        </a>

                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] transition-all cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save & Publish'}</span>
                        </button>
                    </div>
                </div>

                {/* SYSTEM CORE NOTICE BANNER */}
                {isCore && (
                    <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-start gap-3.5">
                        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs sm:text-sm">
                            <div className="font-extrabold text-indigo-950 dark:text-indigo-200">
                                System Core Page Routing Active: <span className="font-mono underline">{routePath}</span>
                            </div>
                            <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed font-normal">
                                This page is deeply integrated into the Kampus system. You can freely customize its <strong>Display Name</strong>, <strong>SEO Meta Title & Description</strong>, <strong>Hero Headings</strong>, <strong>Custom Body Content</strong>, and append <strong>Dynamic Visual Sections</strong> below.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1: SEARCH ENGINE OPTIMIZATION (SEO) SETTINGS & NAVIGATION */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                        SEO & Navigation Settings
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Configure page name, slug, search meta tags, and menu visibility
                                    </p>
                                </div>
                            </div>

                            {/* Published Status Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_active)}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Page Published</span>
                            </label>
                        </div>

                        {/* NAVIGATION MENU VISIBILITY TOGGLES */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Navigation Placement:
                            </span>

                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_in_navbar)}
                                        onChange={(e) => setData('show_in_navbar', e.target.checked)}
                                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Show link in Navbar</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.show_in_footer)}
                                        onChange={(e) => setData('show_in_footer', e.target.checked)}
                                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Show link in Footer</span>
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Page Display Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                                />
                            </div>

                            <div>
                                <label className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    <span>Route URL Slug</span>
                                    {isCore && (
                                        <span className="inline-flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold normal-case">
                                            <Lock className="w-3 h-3" />
                                            <span>Core Route Protected</span>
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="text"
                                    required
                                    readOnly={isCore}
                                    value={data.slug}
                                    onChange={(e) => !isCore && setData('slug', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-2xl border text-sm font-mono focus:outline-none ${
                                        isCore
                                            ? 'bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Meta Title */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Meta Title Tag <span className="text-slate-400 font-normal">(Recommended 50 - 60 characters)</span>
                            </label>
                            <input
                                type="text"
                                value={data.meta_title}
                                onChange={(e) => setData('meta_title', e.target.value)}
                                placeholder="e.g. Kampus EduConsult — Global Higher Education Advisers"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.meta_title && <span className="text-xs text-rose-500 font-semibold">{errors.meta_title}</span>}
                        </div>

                        {/* Meta Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Meta Description <span className="text-slate-400 font-normal">(Recommended 120 - 160 characters)</span>
                            </label>
                            <textarea
                                rows={3}
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                placeholder="Summarize page content for search engines..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.meta_description && <span className="text-xs text-rose-500 font-semibold">{errors.meta_description}</span>}
                        </div>

                        {/* Meta Keywords */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Meta Keywords <span className="text-slate-400 font-normal">(Comma-separated)</span>
                            </label>
                            <input
                                type="text"
                                value={data.meta_keywords}
                                onChange={(e) => setData('meta_keywords', e.target.value)}
                                placeholder="e.g. study abroad, UK universities, scholarship assistance"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* SECTION 2: HERO & CORE CONTENT CUSTOMIZATION */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                <LayoutTemplate className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Hero & Page Header Content
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Customize the hero banner texts displayed at the top of this page
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Hero Badge Tagline */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Hero Tagline / Badge
                                </label>
                                <input
                                    type="text"
                                    value={data.content?.badge_text || data.content?.hero?.badge || ''}
                                    onChange={(e) => handleContentFieldChange('badge_text', e.target.value)}
                                    placeholder="e.g. 24 YEARS OF EXCELLENCE"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Hero Main Heading */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Hero Main Heading / Title
                                </label>
                                <input
                                    type="text"
                                    value={data.content?.hero_heading || data.content?.hero?.title || ''}
                                    onChange={(e) => handleContentFieldChange('hero_heading', e.target.value)}
                                    placeholder="e.g. Empowering your global education journey"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                                />
                            </div>

                            {/* Hero Subtitle */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Hero Subtitle / Descriptive Text
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.content?.hero_subtitle || data.content?.hero?.subtitle || ''}
                                    onChange={(e) => handleContentFieldChange('hero_subtitle', e.target.value)}
                                    placeholder="Provide compelling paragraph text for the page hero section..."
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Hero Banner Background Image Customization */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Hero Banner Background Image
                                    </label>
                                    <span className="text-[11px] text-slate-400 font-normal">
                                        Recommended 1920x1080px or higher (JPG, PNG, WebP)
                                    </span>
                                </div>

                                {/* Current Image Preview & Actions */}
                                {(data.content?.hero_image || data.content?.hero?.image) ? (
                                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group">
                                        <div className="relative h-48 sm:h-56 w-full">
                                            <img
                                                src={data.content?.hero_image || data.content?.hero?.image}
                                                alt="Hero Banner Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                                            
                                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleContentFieldChange('hero_image', '')}
                                                    className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Remove Image</span>
                                                </button>
                                            </div>

                                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                                                <span className="font-mono truncate max-w-xs sm:max-w-md bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                                                    {data.content?.hero_image || data.content?.hero?.image}
                                                </span>
                                                <span className="px-2 py-1 rounded bg-emerald-500/90 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
                                                    Active Banner
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {/* File Upload & URL Input Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                    {/* File Upload Button */}
                                    <div className="sm:col-span-6">
                                        <label className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 border-dashed ${
                                            isUploadingHero
                                                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 cursor-wait'
                                                : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer'
                                        } transition-all`}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={isUploadingHero}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleHeroImageUpload(e.target.files[0]);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            {isUploadingHero ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                    <span className="text-xs font-bold">Uploading image...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    <span className="text-xs font-bold">
                                                        {(data.content?.hero_image || data.content?.hero?.image) ? 'Upload Replacement Image' : 'Upload Banner Image from Computer'}
                                                    </span>
                                                </>
                                            )}
                                        </label>
                                    </div>

                                    {/* Direct URL input */}
                                    <div className="sm:col-span-6">
                                        <input
                                            type="text"
                                            value={data.content?.hero_image || data.content?.hero?.image || ''}
                                            onChange={(e) => handleContentFieldChange('hero_image', e.target.value)}
                                            placeholder="Or paste external image URL (e.g. Unsplash CDN)..."
                                            className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                {uploadHeroError && (
                                    <p className="text-xs text-rose-500 font-semibold">{uploadHeroError}</p>
                                )}

                                {/* Hero Overlay Opacity Control */}
                                {(data.content?.hero_image || data.content?.hero?.image) && (
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <span>Background Overlay Darkness / Legibility Contrast:</span>
                                            <span className="text-blue-600 dark:text-blue-400 font-mono font-black">
                                                {data.content?.hero_overlay_opacity || 75}%
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="20"
                                                max="95"
                                                step="5"
                                                value={data.content?.hero_overlay_opacity || 75}
                                                onChange={(e) => handleContentFieldChange('hero_overlay_opacity', e.target.value)}
                                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                                            <span>Light (20%)</span>
                                            <span>Balanced / Recommended (75%)</span>
                                            <span>Deep Dark (95%)</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* For Policy / Terms pages: Custom Document Body */}
                            {isPolicyPage && (
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Custom Document Content / Body (HTML & Paragraphs)
                                    </label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        You can override the default text of this policy page by entering custom HTML or formatted paragraphs here.
                                    </p>
                                    <textarea
                                        rows={8}
                                        value={data.content?.body || ''}
                                        onChange={(e) => handleContentFieldChange('body', e.target.value)}
                                        placeholder="Enter custom policy terms, clauses, or HTML paragraphs..."
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 3: VISUAL PAGE BUILDER (DYNAMIC SECTIONS) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Dynamic Page Sections Builder
                                </h3>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                                Add modular blocks (Image + Text, Photo Gallery, Feature Cards, Article, CTA Banner)
                            </span>
                        </div>

                        <PageBuilder
                            content={data.content}
                            onChange={(newContent) => setData('content', newContent)}
                        />
                    </div>

                    {/* SUBMIT BUTTON AT BOTTOM */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save & Publish Page'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
