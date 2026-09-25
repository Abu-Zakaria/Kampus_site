import React, { useState } from 'react';
import {
    BookOpen,
    Sparkles,
    Search,
    FileText,
    Layers
} from 'lucide-react';

export default function BlogPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('search_hero');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const tabs = [
        { id: 'search_hero', label: 'Search & Header Settings', icon: Search },
        { id: 'articles_section', label: 'Articles Grid Header', icon: Layers },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Blog & Insights Page Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure blog search bar placeholder, filter options, and article section headers
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Blog Customizer</span>
                </span>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT: 1. SEARCH & HERO */}
            {activeTab === 'search_hero' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Search Bar Placeholder Text
                        </label>
                        <input
                            type="text"
                            value={content.search_placeholder ?? 'Search stories, scholarships, destinations...'}
                            onChange={(e) => updateField('search_placeholder', e.target.value)}
                            placeholder="Search stories, scholarships, destinations..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. ARTICLES GRID */}
            {activeTab === 'articles_section' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Articles Grid Heading
                        </label>
                        <input
                            type="text"
                            value={content.articles_heading ?? 'Our Latest Articles & Insights'}
                            onChange={(e) => updateField('articles_heading', e.target.value)}
                            placeholder="Our Latest Articles & Insights"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Articles Grid Subtitle / Count Note
                        </label>
                        <textarea
                            rows={3}
                            value={content.articles_subtitle ?? 'Explore in-depth articles written by our international education specialists.'}
                            onChange={(e) => updateField('articles_subtitle', e.target.value)}
                            placeholder="Explore in-depth articles..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
