import React, { useState } from 'react';
import {
    BookOpen,
    Sparkles,
    Search,
    Compass,
    Tag
} from 'lucide-react';

export default function CoursesPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('popular_searches');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const tabs = [
        { id: 'popular_searches', label: 'Popular Search Tags & Hero', icon: Tag },
        { id: 'roadmap', label: 'Admission Roadmap', icon: Compass },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Courses & Degree Programmes Page Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure popular search query tags, search bar placeholder, and roadmap texts
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Courses Customizer</span>
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

            {/* TAB CONTENT: 1. POPULAR SEARCHES */}
            {activeTab === 'popular_searches' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Search Input Placeholder Text
                        </label>
                        <input
                            type="text"
                            value={content.search_placeholder ?? 'Search for a course (e.g., Data Science, Law, Business)...'}
                            onChange={(e) => updateField('search_placeholder', e.target.value)}
                            placeholder="Search for a course (e.g., Data Science, Law, Business)..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Popular Quick-Search Keywords <span className="text-slate-400 font-normal">(Comma-separated)</span>
                        </label>
                        <input
                            type="text"
                            value={content.popular_searches ?? 'Computer Science, MBA, Data Science & AI, Law, Engineering, Psychology'}
                            onChange={(e) => updateField('popular_searches', e.target.value)}
                            placeholder="e.g. Computer Science, MBA, Data Science & AI, Law, Engineering, Psychology"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-400 mt-1.5">
                            These tags appear as clickable pills right underneath the course search bar on the Courses page.
                        </p>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. ADMISSION ROADMAP */}
            {activeTab === 'roadmap' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Roadmap Section Heading
                        </label>
                        <input
                            type="text"
                            value={content.roadmap_title ?? 'Your 5-Step Admission Journey'}
                            onChange={(e) => updateField('roadmap_title', e.target.value)}
                            placeholder="Your 5-Step Admission Journey"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Roadmap Section Subtitle
                        </label>
                        <textarea
                            rows={3}
                            value={content.roadmap_subtitle ?? 'From initial profiling through to visa issuance and campus arrival, our certified team handles every step.'}
                            onChange={(e) => updateField('roadmap_subtitle', e.target.value)}
                            placeholder="Enter subtitle for the 5-step roadmap..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
