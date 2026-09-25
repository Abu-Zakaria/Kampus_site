import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import PageBuilder from '../../../Components/Admin/PageBuilder';
import {
    Save,
    ArrowLeft,
    FileText,
    Sparkles
} from 'lucide-react';

export default function Create() {
    const { data, setData, processing, errors } = useForm({
        name: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        tags: '',
        is_active: true,
        show_in_navbar: false,
        show_in_footer: false,
        content: {
            hero: {
                badge: 'OFFICIAL PROGRAM',
                title: '',
                subtitle: '',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
            },
            sections: [
                {
                    id: 1,
                    type: 'image_text',
                    title: 'About This Program',
                    subtitle: 'Excellence & Guidance',
                    content: 'We provide specialized international admission guidance, tailored scholarship planning, and end-to-end visa assistance.',
                    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
                    image_position: 'right',
                    bullets: ['Recognized Degree Qualifications', 'Post-Study Work & Settlement Support'],
                }
            ],
        },
    });

    const [focusKeyword, setFocusKeyword] = useState('');

    const calculateSEO = () => {
        let score = 0;
        let checks = [];
        const title = data.meta_title || data.name || '';
        const desc = data.meta_description || '';
        
        const extractText = (val) => {
            if (!val) return '';
            if (typeof val === 'string') return val.replace(/<[^>]*>?/gm, ' ');
            if (Array.isArray(val)) return val.map(extractText).join(' ');
            if (typeof val === 'object') return Object.values(val).map(extractText).join(' ');
            return '';
        };
        const contentText = extractText(data.content);
        const keyword = focusKeyword.toLowerCase().trim();

        // 1. Title Length
        if (title.length > 30 && title.length <= 60) {
            score += 20;
            checks.push({ text: 'Title length is perfect (30-60 characters)', pass: true });
        } else {
            checks.push({ text: 'Title should be between 30-60 characters', pass: false });
        }

        // 2. Description Length
        if (desc.length > 120 && desc.length <= 160) {
            score += 20;
            checks.push({ text: 'Meta description length is good (120-160 characters)', pass: true });
        } else {
            checks.push({ text: 'Meta description should be 120-160 characters', pass: false });
        }

        // 3. Content Length
        const wordCount = contentText.split(/\s+/).filter(word => word.length > 0).length;
        if (wordCount >= 300) {
            score += 20;
            checks.push({ text: `Content is long enough (${wordCount} words)`, pass: true });
        } else {
            checks.push({ text: `Content is too short (${wordCount} words). Aim for 300+`, pass: false });
        }

        // Keyword Checks (Only if keyword is provided)
        if (keyword) {
            // 4. Keyword in Title
            if (title.toLowerCase().includes(keyword)) {
                score += 20;
                checks.push({ text: 'Focus keyword found in SEO title', pass: true });
            } else {
                checks.push({ text: 'Add focus keyword to the SEO title', pass: false });
            }

            // 5. Keyword in Description
            if (desc.toLowerCase().includes(keyword)) {
                score += 20;
                checks.push({ text: 'Focus keyword found in meta description', pass: true });
            } else {
                checks.push({ text: 'Add focus keyword to the meta description', pass: false });
            }
        } else {
            checks.push({ text: 'Set a focus keyword to get a complete score', pass: false });
        }

        return { score, checks };
    };

    const seoResults = calculateSEO();

    const handleNameChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            name: val,
            slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            meta_title: prev.meta_title ? prev.meta_title : `${val} — Kampus EduConsult`,
            content: {
                ...prev.content,
                hero: {
                    ...prev.content.hero,
                    title: prev.content.hero?.title ? prev.content.hero.title : val,
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            is_active: data.is_active ? 1 : 0,
            show_in_navbar: data.show_in_navbar ? 1 : 0,
            show_in_footer: data.show_in_footer ? 1 : 0,
        };

        router.post('/admin/pages', payload, {
            onSuccess: () => {
                alert(`Page "${data.name}" created successfully!`);
            }
        });
    };

    return (
        <AdminLayout title="Create New Page">
            <Head title="Create New Page — Kampus CMS" />

            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/pages"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3" />
                                <span>NEW DYNAMIC PAGE</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                Create New Page & Layout
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Publishing...' : 'Publish Page'}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1: METADATA, SEO & NAVIGATION TOGGLES */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                        Page & SEO Metadata
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Define page title, route slug, and navigation visibility
                                    </p>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_active)}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Published</span>
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
                                    Page Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Student Support & Resources"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                                />
                                {errors.name && <span className="text-xs text-rose-500 font-semibold">{errors.name}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Route Slug *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. student-support"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.slug && <span className="text-xs text-rose-500 font-semibold">{errors.slug}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Meta Title Tag (SEO)
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder="e.g. Student Support & Resources — Kampus Group"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Tags / Meta Keywords (SEO)
                                </label>
                                <input
                                    type="text"
                                    value={data.tags || data.meta_keywords || ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData(prev => ({
                                            ...prev,
                                            tags: val,
                                            meta_keywords: val,
                                        }));
                                    }}
                                    placeholder="e.g. support, counseling, scholarships, admission"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Meta Description (SEO)
                            </label>
                            <textarea
                                rows={3}
                                value={data.meta_description}
                                onChange={(e) => setData('meta_description', e.target.value)}
                                placeholder="Summarize page purpose for search engines..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Real-time SEO Analyzer */}
                        <div className="mt-8 p-6 bg-slate-900 rounded-2xl border border-slate-700 shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-400" />
                                    <span>SEO Analyzer</span>
                                </h3>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                    seoResults.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                    seoResults.score >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                    {seoResults.score >= 80 ? 'Good SEO' : seoResults.score >= 50 ? 'Needs Improvement' : 'Poor SEO'}
                                </span>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-slate-300">Focus Keyword</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    placeholder="e.g. study in UK"
                                    value={focusKeyword}
                                    onChange={(e) => setFocusKeyword(e.target.value)}
                                />
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-300">Overall SEO Score</span>
                                    <span className={`text-sm font-bold ${seoResults.score >= 80 ? 'text-emerald-500' : seoResults.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>{seoResults.score}/100</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-2.5 rounded-full transition-all duration-500 ${seoResults.score >= 80 ? 'bg-emerald-500' : seoResults.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${seoResults.score}%` }}></div>
                                </div>
                            </div>

                            <ul className="space-y-2">
                                {seoResults.checks.map((check, index) => (
                                    <li key={index} className="flex items-start text-sm">
                                        {check.pass ? (
                                            <span className="text-emerald-500 mr-2 font-bold shrink-0">✔</span>
                                        ) : (
                                            <span className="text-red-500 mr-2 font-bold shrink-0">✖</span>
                                        )}
                                        <span className={check.pass ? 'text-slate-300' : 'text-slate-400'}>{check.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* SECTION 2: DYNAMIC VISUAL PAGE BUILDER & SECTIONS */}
                    <PageBuilder
                        content={data.content}
                        onChange={(newContent) => setData('content', newContent)}
                    />

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Publishing...' : 'Publish Page'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
