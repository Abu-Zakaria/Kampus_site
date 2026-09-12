import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Settings,
    Save,
    Building2,
    Mail,
    Phone,
    MapPin,
    Clock,
    Share2,
    Sparkles,
    CheckCircle2,
    Image as ImageIcon,
    Upload,
    Globe,
    Layout,
    Layers,
    FileText,
    ArrowUpRight,
    Trash2,
    Sliders
} from 'lucide-react';

export default function Index({ settings = {} }) {
    const [logoPreview, setLogoPreview] = useState(settings.site_logo ? `/storage/${settings.site_logo}` : null);
    const [footerLogoPreview, setFooterLogoPreview] = useState(settings.footer_logo ? `/storage/${settings.footer_logo}` : null);
    const [faviconPreview, setFaviconPreview] = useState(settings.site_favicon ? `/storage/${settings.site_favicon}` : null);
    const [heroBannerPreview, setHeroBannerPreview] = useState(
        settings.home_hero_image ? (settings.home_hero_image.startsWith('http') || settings.home_hero_image.startsWith('/') ? settings.home_hero_image : `/storage/${settings.home_hero_image}`) : null
    );

    const { data, setData, post, processing } = useForm({
        // Brand & Logos
        site_name: settings.site_name || 'Kampus Edu',
        header_subtitle: settings.header_subtitle || 'Educational Consultancy',
        site_logo: null,
        footer_name: settings.footer_name || settings.site_name || 'Kampus EduConsult',
        footer_subtitle: settings.footer_subtitle || settings.site_tagline || 'Global Higher Education Advisers',
        footer_logo: null,
        site_favicon: null,
        home_hero_image: null,
        footer_description: settings.footer_description || 'Empowering ambitious students worldwide to access top-tier university education with bespoke admissions counselling, visa support, and scholarship guidance.',
        
        // General & Header
        site_tagline: settings.site_tagline || 'Global Higher Education Advisers',
        
        // Footer Contact Information (Head Office)
        head_office_address: settings.head_office_address || settings.contact_address || '124 Education Avenue, Suite 400, Oxford Street, London W1B 3AG, United Kingdom',
        head_office_phone: settings.head_office_phone || 'UK: +44 20 7946 0912 | BD: +880 1812713814',
        
        // Other Contacts
        contact_email: settings.contact_email || 'apply@kampusedu.com',
        contact_bd_hotline: settings.contact_bd_hotline || '+880 1812713814',
        operating_hours: settings.operating_hours || 'Mon - Sat: 9:00 AM - 7:00 PM',
        
        // Social Media
        facebook_url: settings.facebook_url || 'https://facebook.com/kampusedu',
        linkedin_url: settings.linkedin_url || 'https://linkedin.com/company/kampusedu',
        instagram_url: settings.instagram_url || 'https://instagram.com/kampusedu',
        youtube_url: settings.youtube_url || 'https://youtube.com/c/kampusedu',

        // Contact Us Page Information & Google Maps
        contact_info_title: settings.contact_info_title || 'Contact Information',
        contact_info_subtitle: settings.contact_info_subtitle || 'London Global HQ & Regional Advisory Center',
        contact_info_address: settings.contact_info_address || '1st Floor, Botanical Works, 2 Jubilee Street, London E1 3FU',
        contact_info_email: settings.contact_info_email || 'info@kampus-group.com',
        contact_info_phone: settings.contact_info_phone || '020 7423 9333',
        contact_info_hours: settings.contact_info_hours || 'Monday - Friday: 9:00 AM - 6:00 PM GMT',
        contact_map_iframe: settings.contact_map_iframe || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.915783307521!2d-0.05716182337775242!3d51.51478190950346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876033580555555%3A0x123456789abcdef!2sJubilee%20St%2C%20London!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk',
    });

    const extractMapUrl = (input) => {
        if (!input) return '';
        const match = input.match(/src=["']([^"']+)["']/);
        return match ? match[1] : input;
    };

    const handleFileChange = (field, file, previewSetter) => {
        setData(field, file);
        if (file) {
            const url = URL.createObjectURL(file);
            previewSetter(url);
        }
    };

    const handleRemoveHeroBanner = () => {
        if (window.confirm('Are you sure you want to remove the Homepage Hero Banner image?')) {
            router.post('/admin/settings', {
                remove_home_hero_image: 1
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setHeroBannerPreview(null);
                    setData('home_hero_image', null);
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Global Site Settings">
            <Head title="Global Settings — Kampus CMS" />

            <div className="max-w-4xl mx-auto space-y-8">

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <Link
                        href="/admin/settings"
                        className="px-4 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white shadow-sm flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" />
                        <span>Website & Brand</span>
                    </Link>
                    <Link
                        href="/admin/settings/env"
                        className="px-4 py-2 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Sliders className="w-4 h-4" />
                        <span>Environment (.env)</span>
                    </Link>
                    <Link
                        href="/admin/slideshow"
                        className="px-4 py-2 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Layers className="w-4 h-4" />
                        <span>Hero Slideshow</span>
                    </Link>
                </div>

                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>GLOBAL BRAND & SITE SETTINGS</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Website Brand & Configuration
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage your website logos, favicon, brand titles, footer copy, head office details, and social profiles.
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* SECTION 1: BRAND LOGOS & FAVICON */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Brand Logos & Favicon
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Upload official brand images for the navbar header, footer, and browser favicon
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* 1. Header Logo */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Header Logo
                                </label>
                                <div className="h-24 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Header Logo Preview" className="max-h-full max-w-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-slate-400">No logo uploaded (using default)</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="site_logo_input"
                                    className="hidden"
                                    onChange={(e) => handleFileChange('site_logo', e.target.files[0], setLogoPreview)}
                                />
                                <label
                                    htmlFor="site_logo_input"
                                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload Header Logo</span>
                                </label>
                            </div>

                            {/* 2. Footer Logo */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Footer Logo
                                </label>
                                <div className="h-24 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden">
                                    {footerLogoPreview ? (
                                        <img src={footerLogoPreview} alt="Footer Logo Preview" className="max-h-full max-w-full object-contain" />
                                    ) : (
                                        <span className="text-xs text-slate-400">No logo uploaded (using default)</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="footer_logo_input"
                                    className="hidden"
                                    onChange={(e) => handleFileChange('footer_logo', e.target.files[0], setFooterLogoPreview)}
                                />
                                <label
                                    htmlFor="footer_logo_input"
                                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload Footer Logo</span>
                                </label>
                            </div>

                            {/* 3. Site Favicon */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Website Favicon (.ico, .png)
                                </label>
                                <div className="h-24 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden">
                                    {faviconPreview ? (
                                        <img src={faviconPreview} alt="Favicon Preview" className="w-10 h-10 object-contain" />
                                    ) : (
                                        <span className="text-xs text-slate-400">No favicon uploaded</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*,.ico"
                                    id="site_favicon_input"
                                    className="hidden"
                                    onChange={(e) => handleFileChange('site_favicon', e.target.files[0], setFaviconPreview)}
                                />
                                <label
                                    htmlFor="site_favicon_input"
                                    className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload Favicon</span>
                                </label>
                            </div>

                        </div>

                        {/* Homepage Hero Banner Quick Configuration */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span>Homepage Hero Banner Image</span>
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Set a high-resolution background banner image for the front homepage hero section
                                    </p>
                                </div>
                                <Link
                                    href="/admin/pages/1/edit"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors shrink-0"
                                >
                                    <span>Customize Full Hero in CMS</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                                {heroBannerPreview ? (
                                    <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 dark:border-slate-700">
                                        <img src={heroBannerPreview} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                                        <div className="absolute bottom-3 left-3 text-white text-xs font-mono truncate max-w-md bg-black/60 px-2 py-1 rounded">
                                            Active Hero Banner
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-28 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 text-center">
                                        <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">No custom banner uploaded yet</span>
                                        <span className="text-[10px] text-slate-400">Using default high-res educational campus image</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="home_hero_image_input"
                                        className="hidden"
                                        onChange={(e) => handleFileChange('home_hero_image', e.target.files[0], setHeroBannerPreview)}
                                    />
                                    <label
                                        htmlFor="home_hero_image_input"
                                        className="py-2.5 px-4 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                                    >
                                        <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span>{heroBannerPreview ? 'Replace Hero Banner' : 'Upload Hero Banner Image'}</span>
                                    </label>

                                    {heroBannerPreview && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveHeroBanner}
                                            className="py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Remove Banner</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dedicated Hero 3D Card Slideshow Quick Management */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80">
                                <div className="flex items-center gap-3.5">
                                    <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20 shrink-0">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                                Hero 3D Card Deck Slideshow Images
                                            </h4>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                                                Independent Area
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                            Manage, upload, reorder, or replace images in the animated 3D card deck on the homepage hero banner.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/admin/slideshow"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                                >
                                    <span>Manage Slideshow Images</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* SECTION 2: BRAND TITLES & HEADINGS */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Brand Titles & Descriptions
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Titles and subtitles for Header, Footer, and Browser Tab
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Header Brand Name (Navbar) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    placeholder="e.g. Kampus Edu"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Header Subtitle (Navbar)
                                </label>
                                <input
                                    type="text"
                                    value={data.header_subtitle}
                                    onChange={(e) => setData('header_subtitle', e.target.value)}
                                    placeholder="e.g. Educational Consultancy"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Footer Brand Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.footer_name}
                                    onChange={(e) => setData('footer_name', e.target.value)}
                                    placeholder="e.g. Kampus EduConsult"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Footer Subtitle / Tagline
                                </label>
                                <input
                                    type="text"
                                    value={data.footer_subtitle}
                                    onChange={(e) => setData('footer_subtitle', e.target.value)}
                                    placeholder="e.g. Global Higher Education Advisers"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Footer Brand Description *
                            </label>
                            <textarea
                                rows={3}
                                required
                                value={data.footer_description}
                                onChange={(e) => setData('footer_description', e.target.value)}
                                placeholder="Empowering ambitious students worldwide to access top-tier university education..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* SECTION 3: FOOTER CONTACT INFORMATION (HEAD OFFICE CONTACT) */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Footer Head Office Contact
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Manage the "Head Office Contact" details rendered dynamically in the global website Footer
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Head Office Address *
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={data.head_office_address}
                                    onChange={(e) => setData('head_office_address', e.target.value)}
                                    placeholder="124 Education Avenue, Suite 400, Oxford Street, London W1B 3AG, United Kingdom"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Line breaks in this textarea will be preserved in the footer layout.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Contact Numbers (Phone / Hotline) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.head_office_phone}
                                        onChange={(e) => setData('head_office_phone', e.target.value)}
                                        placeholder="UK: +44 20 7946 0912 | BD: +880 1812713814"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: OTHER CONTACTS & HOTLINES */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Email & Support Hotlines
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Displayed in header and topbar
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Support Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="apply@kampusedu.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    BD Hotline (TopBar)
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_bd_hotline}
                                    onChange={(e) => setData('contact_bd_hotline', e.target.value)}
                                    placeholder="+880 1812713814"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Operating Hours
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.operating_hours}
                                        onChange={(e) => setData('operating_hours', e.target.value)}
                                        placeholder="Mon - Sat: 9:00 AM - 7:00 PM"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Clock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: SOCIAL MEDIA LINKS */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Social Media Profiles
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Links for footer social icons
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Facebook URL
                                </label>
                                <input
                                    type="url"
                                    value={data.facebook_url}
                                    onChange={(e) => setData('facebook_url', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    value={data.linkedin_url}
                                    onChange={(e) => setData('linkedin_url', e.target.value)}
                                    placeholder="https://linkedin.com/..."
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    value={data.instagram_url}
                                    onChange={(e) => setData('instagram_url', e.target.value)}
                                    placeholder="https://instagram.com/..."
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    YouTube URL
                                </label>
                                <input
                                    type="url"
                                    value={data.youtube_url}
                                    onChange={(e) => setData('youtube_url', e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 6: CONTACT US PAGE DETAILS & GOOGLE MAP */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Contact Page Details & Google Map
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Configure the "Contact Information" card and Google Map embed rendered on the public Contact Us page (/contact)
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Card Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_info_title}
                                        onChange={(e) => setData('contact_info_title', e.target.value)}
                                        placeholder="e.g. Contact Information"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Card Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_info_subtitle}
                                        onChange={(e) => setData('contact_info_subtitle', e.target.value)}
                                        placeholder="e.g. London Global HQ & Regional Advisory Center"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    HQ Address
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.contact_info_address}
                                    onChange={(e) => setData('contact_info_address', e.target.value)}
                                    placeholder="e.g. 1st Floor, Botanical Works, 2 Jubilee Street, London E1 3FU"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.contact_info_email}
                                        onChange={(e) => setData('contact_info_email', e.target.value)}
                                        placeholder="info@kampus-group.com"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_info_phone}
                                        onChange={(e) => setData('contact_info_phone', e.target.value)}
                                        placeholder="020 7423 9333"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Office Hours
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_info_hours}
                                        onChange={(e) => setData('contact_info_hours', e.target.value)}
                                        placeholder="Monday - Friday: 9:00 AM - 6:00 PM GMT"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Google Maps Embed (URL or Full &lt;iframe&gt; Code)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.contact_map_iframe}
                                    onChange={(e) => setData('contact_map_iframe', e.target.value)}
                                    placeholder="Paste Google Maps embed URL (https://www.google.com/maps/embed?...) or the complete <iframe> embed code from Google Maps"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Tip: In Google Maps, click "Share" → "Embed a map" → copy the HTML or embed URL and paste it here.
                                </p>
                            </div>

                            {/* Live Map Preview */}
                            {extractMapUrl(data.contact_map_iframe) && (
                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Map Live Preview:
                                    </div>
                                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-48 bg-slate-900">
                                        <iframe
                                            title="Admin Map Preview"
                                            src={extractMapUrl(data.contact_map_iframe)}
                                            className="w-full h-full border-0"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SUBMIT BUTTON AT BOTTOM */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : 'Save Global Settings'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
