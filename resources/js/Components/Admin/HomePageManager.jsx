import React, { useState } from 'react';
import {
    Home as HomeIcon,
    Sparkles,
    BarChart3,
    Layers,
    Globe,
    Compass,
    Star
} from 'lucide-react';

export default function HomePageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('hero_stats');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const tabs = [
        { id: 'hero_stats', label: 'Hero Stat Counters', icon: BarChart3 },
        { id: 'section_headers', label: 'Services & Destinations Headers', icon: Layers },
        { id: 'roadmap', label: 'Admission Roadmap', icon: Compass },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <HomeIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Homepage Core Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure hero animated stat counters, section headlines, and roadmap texts
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Homepage Customizer</span>
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

            {/* TAB CONTENT: 1. HERO STATS */}
            {activeTab === 'hero_stats' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                        Note: Destinations and Partner Universities counts are dynamically synced from your active database records. You can customize the scholarship funding and visa approval counters below.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Scholarships Stat */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                            <span className="text-xs font-bold text-amber-500 dark:text-amber-400">Scholarship Funding Counter</span>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Counter Target Value
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_scholarships ?? '$5M+'}
                                    onChange={(e) => updateField('stat_scholarships', e.target.value)}
                                    placeholder="$5M+"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Visa Approval Stat */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                            <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">Visa Approval Counter</span>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Counter Target Value
                                </label>
                                <input
                                    type="text"
                                    value={content.stat_acceptance ?? '98%'}
                                    onChange={(e) => updateField('stat_acceptance', e.target.value)}
                                    placeholder="98%"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. SECTION HEADERS */}
            {activeTab === 'section_headers' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Services section */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Services Grid Section</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Tagline Badge
                                </label>
                                <input
                                    type="text"
                                    value={content.services_badge ?? 'OUR EXPERTISE'}
                                    onChange={(e) => updateField('services_badge', e.target.value)}
                                    placeholder="OUR EXPERTISE"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={content.services_title ?? 'Comprehensive support for every stage'}
                                    onChange={(e) => updateField('services_title', e.target.value)}
                                    placeholder="Comprehensive support for every stage"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Destinations section */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Destinations Section</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Tagline Badge
                                </label>
                                <input
                                    type="text"
                                    value={content.destinations_badge ?? 'TOP STUDY DESTINATIONS'}
                                    onChange={(e) => updateField('destinations_badge', e.target.value)}
                                    placeholder="TOP STUDY DESTINATIONS"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    value={content.destinations_title ?? 'Where would you like to study?'}
                                    onChange={(e) => updateField('destinations_title', e.target.value)}
                                    placeholder="Where would you like to study?"
                                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
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
