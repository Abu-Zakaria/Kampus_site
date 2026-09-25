import React, { useState } from 'react';
import {
    GraduationCap,
    Sparkles,
    Building2,
    Globe,
    CheckCircle2,
    Compass,
    BarChart3
} from 'lucide-react';

export default function UniversitiesPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('stats_banner');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const tabs = [
        { id: 'stats_banner', label: 'Network Stats Banner (3 Stats)', icon: BarChart3 },
        { id: 'search_controls', label: 'Search & Hero Settings', icon: GraduationCap },
        { id: 'roadmap', label: 'Admission Roadmap', icon: Compass },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Partner Universities Page Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure network statistics banner, live search controls, and roadmap texts
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Universities Customizer</span>
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

            {/* TAB CONTENT: 1. STATS BANNER */}
            {activeTab === 'stats_banner' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Header */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Banner Section Title
                            </label>
                            <input
                                type="text"
                                value={content.stats_title ?? 'A growing global network'}
                                onChange={(e) => updateField('stats_title', e.target.value)}
                                placeholder="A growing global network"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Banner Section Subtitle
                            </label>
                            <input
                                type="text"
                                value={content.stats_subtitle ?? 'Connecting students with accredited universities worldwide through streamlined admission channels.'}
                                onChange={(e) => updateField('stats_subtitle', e.target.value)}
                                placeholder="Connecting students with accredited universities..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* 3 STATS CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Stat 1 */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Stat #1 (Partner Institutions)</span>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Number / Value
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_1_value ?? '150+'}
                                    onChange={(e) => updateField('stat_1_value', e.target.value)}
                                    placeholder="150+"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_1_label ?? 'Partner Institutions'}
                                    onChange={(e) => updateField('stat_1_label', e.target.value)}
                                    placeholder="Partner Institutions"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={content.stat_1_desc ?? 'Direct admissions partnerships with leading global universities'}
                                    onChange={(e) => updateField('stat_1_desc', e.target.value)}
                                    placeholder="Direct admissions partnerships..."
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Stat #2 (Global Destinations)</span>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Number / Value
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_2_value ?? '4'}
                                    onChange={(e) => updateField('stat_2_value', e.target.value)}
                                    placeholder="4"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_2_label ?? 'Global Destinations'}
                                    onChange={(e) => updateField('stat_2_label', e.target.value)}
                                    placeholder="Global Destinations"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={content.stat_2_desc ?? 'UK, USA, Finland, and Dubai study pathways'}
                                    onChange={(e) => updateField('stat_2_desc', e.target.value)}
                                    placeholder="UK, USA, Finland, and Dubai..."
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Stat #3 (Acceptance Rate)</span>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Number / Value
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_3_value ?? '98%'}
                                    onChange={(e) => updateField('stat_3_value', e.target.value)}
                                    placeholder="98%"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_3_label ?? 'Acceptance Rate'}
                                    onChange={(e) => updateField('stat_3_label', e.target.value)}
                                    placeholder="Acceptance Rate"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={content.stat_3_desc ?? 'Proven track record for conditional & unconditional offer letters'}
                                    onChange={(e) => updateField('stat_3_desc', e.target.value)}
                                    placeholder="Proven track record..."
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. SEARCH CONTROLS */}
            {activeTab === 'search_controls' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Search Input Placeholder
                        </label>
                        <input
                            type="text"
                            value={content.search_placeholder ?? 'Search universities by name, program, or city...'}
                            onChange={(e) => updateField('search_placeholder', e.target.value)}
                            placeholder="Search universities by name, program, or city..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 3. ADMISSION ROADMAP */}
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
