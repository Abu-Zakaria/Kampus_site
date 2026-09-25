import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Layout from '../../../Layouts/Layout';
import {
    Calendar,
    ArrowRight,
    Search,
    BookOpen,
    Sparkles,
    Tag,
    X,
    RotateCcw,
    Clock
} from 'lucide-react';

import DynamicPageSections from '../../../Components/DynamicPageSections';

export default function BlogIndex() {
    const { blogs = {}, categories = [], filters = {}, page = null } = usePage().props;

    const metaTitle = page?.meta_title || 'Latest Insights & Success Stories —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Read expert study abroad guides, university admissions tips, and inspiring stories from international students.';
    const metaKeywords = page?.meta_keywords || 'study abroad blog, student guides, UK visa advice, success stories';

    const heroHeading = page?.content?.hero_heading || page?.content?.hero?.title;
    const heroSubtitle = page?.content?.hero_subtitle || page?.content?.hero?.subtitle;

    const filtersData = (filters && typeof filters === 'object' && !Array.isArray(filters)) ? filters : {};

    const [search, setSearch] = useState(typeof filtersData.search === 'string' ? filtersData.search : '');
    const [selectedCategory, setSelectedCategory] = useState(typeof filtersData.category === 'string' ? filtersData.category : 'All');
    const isFirstMount = useRef(true);

    const blogList = Array.isArray(blogs) ? blogs : (blogs?.data || []);
    const totalBlogs = blogs?.total ?? blogList.length;

    // Trigger Inertia SPA visit
    const fetchResults = (searchQuery, category) => {
        const url = typeof route === 'function' ? route('blog.index') : '/blog';
        router.get(url, {
            search: searchQuery || undefined,
            category: category === 'All' ? undefined : category
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // 300ms Search Debouncer
    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchResults(search, selectedCategory);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        fetchResults(search, cat);
    };

    const handleReset = () => {
        setSearch('');
        setSelectedCategory('All');
        fetchResults('', 'All');
    };

    const hasFilters = Boolean(search.trim()) || selectedCategory !== 'All';

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            {/* MAIN BLOG PAGE CONTAINER */}
            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">

                {/* 1. HERO SECTION */}
                <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">

                    {/* Ambient Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none overflow-hidden">
                        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[140px]" />
                        <div className="absolute top-[120px] left-[10%] w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                            {heroHeading ? (
                                heroHeading
                            ) : (
                                <>
                                    Our Latest Insights &{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500">
                                        Success Stories
                                    </span>
                                </>
                            )}
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
                            {heroSubtitle || 'Read expert study abroad guides, visa tips, and inspiring journeys of students accepted into top global universities.'}
                        </p>

                        {/* Search & Filter Bar */}
                        <div className="pt-4 max-w-2xl mx-auto">
                            <div className="relative rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-2 sm:p-2.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
                                <div className="pl-3 text-slate-400 flex items-center justify-center shrink-0">
                                    <Search className="w-5 h-5 text-blue-500" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search stories, scholarships, destinations..."
                                    className="w-full bg-transparent py-2.5 px-2 text-slate-900 dark:text-white text-sm sm:text-base font-medium placeholder-slate-400 dark:placeholder-slate-500 border-0 border-none outline-none focus:outline-none focus:ring-0 shadow-none"
                                />
                                {search.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="pr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Category Filter Pills */}
                            {categories.length > 0 && (
                                <div className="flex items-center justify-center gap-2 flex-wrap pt-4">
                                    <button
                                        type="button"
                                        onClick={() => handleCategoryChange('All')}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedCategory === 'All'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        All Stories
                                    </button>
                                    {categories.slice(0, 10).map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 2. BLOG POSTS GRID SECTION */}
                <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Section Header Count */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200/70 dark:border-slate-800">
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Showing <span className="text-blue-600 dark:text-blue-400">{totalBlogs}</span> Articles & Stories
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Verified admission guidance and real student success journeys
                                </p>
                            </div>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                                >
                                    <RotateCcw className="w-3 h-3 text-blue-500" />
                                    <span>Reset Filters</span>
                                </button>
                            )}
                        </div>

                        {/* Responsive 3-Column Grid of Blog Cards */}
                        {blogList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogList.map((blog) => {
                                    const postDate = blog.created_at
                                        ? new Date(blog.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })
                                        : 'Recent Post';

                                    const imageUrl = blog.image
                                        ? (blog.image.startsWith('http') ? blog.image : blog.image)
                                        : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

                                    const showUrl = typeof route === 'function' ? route('blog.show', blog.slug) : `/blog/${blog.slug}`;

                                    return (
                                        <Link
                                            key={blog.id}
                                            href={showUrl}
                                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group shadow-xs hover:shadow-xl cursor-pointer"
                                        >
                                            {/* Top: Feature Image (Fixed height h-48) */}
                                            <div className="h-48 w-full relative shrink-0 overflow-hidden bg-slate-900">
                                                <img
                                                    src={imageUrl}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                                                {/* Category Badge */}
                                                {blog.category && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20 shadow-md">
                                                            {blog.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Middle: Content Section (Expands with flex-1) */}
                                            <div className="p-5 flex flex-col flex-1">
                                                {/* Formatted Date */}
                                                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{postDate}</span>
                                                </div>

                                                {/* Title (Truncate 2 lines) */}
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                                                    {blog.title}
                                                </h3>

                                                {/* Excerpt (Truncate 3 lines) */}
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                                                    {blog.excerpt || (blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...' : '')}
                                                </p>

                                                {/* Bottom Action ("Read More →") */}
                                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500">
                                                    <span className="group-hover:underline">Read More</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    No stories found
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                    No articles matched your search filters. Try searching for a different keyword or category.
                                </p>
                                {hasFilters && (
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={handleReset}
                                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Clear all filters</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. INERTIA SPA PAGINATION */}
                        {blogs?.links && blogs.links.length > 3 && (
                            <div className="mt-14 flex justify-center items-center gap-2 flex-wrap">
                                {blogs.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll={true}
                                            preserveState={true}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border shadow-md ${link.active
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-white'
                                                }`}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg cursor-not-allowed opacity-50"
                                        />
                                    )
                                ))}
                            </div>
                        )}

                    </div>
                </section>

                {/* 2. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

            </div>
        </Layout>
    );
}
