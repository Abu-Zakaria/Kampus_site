import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    FileText,
    Globe,
    Edit3,
    Plus,
    CheckCircle2,
    XCircle,
    Sparkles,
    Eye,
    Trash2,
    Search,
    Sliders,
    Layers,
    ShieldAlert,
    ExternalLink
} from 'lucide-react';

export default function Index({ pages = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'core', 'custom'

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
        'accreditation'
    ];

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete the custom page "${name}"? All its content will be permanently lost.`)) {
            router.delete(`/admin/pages/${id}`);
        }
    };

    // Calculate metrics
    const stats = useMemo(() => {
        const total = pages.length;
        const core = pages.filter(p => coreSlugs.includes(String(p.slug).toLowerCase())).length;
        const custom = total - core;
        const active = pages.filter(p => p.is_active).length;
        return { total, core, custom, active };
    }, [pages]);

    // Filter pages
    const filteredPages = useMemo(() => {
        return pages.filter(p => {
            const isCore = coreSlugs.includes(String(p.slug).toLowerCase());
            if (selectedTab === 'core' && !isCore) return false;
            if (selectedTab === 'custom' && isCore) return false;

            if (searchTerm.trim()) {
                const term = searchTerm.toLowerCase();
                const matchName = (p.name || '').toLowerCase().includes(term);
                const matchSlug = (p.slug || '').toLowerCase().includes(term);
                const matchMeta = (p.meta_title || '').toLowerCase().includes(term);
                return matchName || matchSlug || matchMeta;
            }

            return true;
        });
    }, [pages, selectedTab, searchTerm]);

    return (
        <AdminLayout title="Pages & Content Management">
            <Head title="Pages & SEO — Kampus CMS" />

            <div className="space-y-6">
                
                {/* 1. HEADER ROW WITH STATS & ADD BUTTON */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>CMS CONTENT ENGINE</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Pages & System Core Customization
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Customize page titles, SEO metadata, hero titles, and visual builder sections for both built-in system core and custom pages.
                        </p>
                    </div>

                    <Link
                        href="/admin/pages/create"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] transition-all cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Custom Page</span>
                    </Link>
                </div>

                {/* 2. STATS BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pages</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.total}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                            <Layers className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Core</div>
                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{stats.core}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                            <Globe className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Pages</div>
                            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{stats.custom}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published / Live</div>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.active}</div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* 3. FILTER TABS & SEARCH BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedTab('all')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                selectedTab === 'all'
                                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            All Pages ({stats.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('core')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                selectedTab === 'core'
                                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            System Core ({stats.core})
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('custom')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                selectedTab === 'custom'
                                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Custom ({stats.custom})
                        </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, route, or meta title..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* 4. PAGES LIST TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">Page Name & Type</th>
                                    <th className="py-4 px-6 font-extrabold">Route URL</th>
                                    <th className="py-4 px-6 font-extrabold">SEO Meta Title</th>
                                    <th className="py-4 px-6 font-extrabold">Status</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredPages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            No pages found matching your filter criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPages.map((p) => {
                                        const isCore = coreSlugs.includes(String(p.slug).toLowerCase());
                                        const routePath = p.slug === 'home' ? '/' : `/${p.slug}`;

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                                
                                                {/* Page Name */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border shrink-0 ${
                                                            isCore
                                                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900'
                                                                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900'
                                                        }`}>
                                                            {isCore ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                                                                    {p.name}
                                                                </span>
                                                                {isCore ? (
                                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
                                                                        System Core
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 shrink-0">
                                                                        Custom Page
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-slate-400 truncate mt-0.5">
                                                                {p.content?.sections?.length ? `${p.content.sections.length} Visual Sections • ` : ''}
                                                                {p.content?.hero_heading ? `Hero: "${p.content.hero_heading.slice(0, 35)}..."` : 'Default Hero'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Slug */}
                                                <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200/60 dark:border-slate-700">
                                                        {routePath}
                                                    </span>
                                                </td>

                                                {/* Meta Title */}
                                                <td className="py-4 px-6 max-w-xs truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {p.meta_title || <span className="italic text-slate-400">Not configured</span>}
                                                </td>

                                                {/* Status */}
                                                <td className="py-4 px-6">
                                                    {p.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>Active</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            <span>Disabled</span>
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <a
                                                            href={routePath}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-bold"
                                                            title="Preview Live Page"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>

                                                        <Link
                                                            href={`/admin/pages/${p.id}/edit`}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                            <span>Customize</span>
                                                        </Link>

                                                        {/* Render Delete button ONLY for non-core custom pages */}
                                                        {!isCore && (
                                                            <button
                                                                onClick={() => handleDelete(p.id, p.name)}
                                                                className="inline-flex items-center gap-1 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/80 transition-colors text-xs font-bold cursor-pointer"
                                                                title="Delete Page"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
