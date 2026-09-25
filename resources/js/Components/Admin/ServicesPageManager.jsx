import React, { useState } from 'react';
import {
    Briefcase,
    Sparkles,
    CheckCircle2,
    GraduationCap,
    ShieldCheck,
    Layers,
    PhoneCall,
    Award
} from 'lucide-react';

export default function ServicesPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('trust_badges');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const tabs = [
        { id: 'trust_badges', label: 'Hero Trust Badges', icon: ShieldCheck },
        { id: 'services_intro', label: 'Services Intro Header', icon: Layers },
        { id: 'cta_banner', label: 'Bottom CTA Banner', icon: PhoneCall },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Services Page Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure hero micro-badges, services catalog header, and CTA banner callout
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Services Customizer</span>
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

            {/* TAB CONTENT: 1. HERO TRUST BADGES */}
            {activeTab === 'trust_badges' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                        These 3 trust micro-badges appear directly underneath the hero title and subtitle on the Services page.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Badge 1 (Free Guidance)
                            </label>
                            <input
                                type="text"
                                value={content.hero_badge_1 ?? '100% Free Guidance'}
                                onChange={(e) => updateField('hero_badge_1', e.target.value)}
                                placeholder="100% Free Guidance"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Badge 2 (Partner Universities)
                            </label>
                            <input
                                type="text"
                                value={content.hero_badge_2 ?? '500+ Partner Universities'}
                                onChange={(e) => updateField('hero_badge_2', e.target.value)}
                                placeholder="500+ Partner Universities"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Badge 3 (Accreditation)
                            </label>
                            <input
                                type="text"
                                value={content.hero_badge_3 ?? 'British Council Certified'}
                                onChange={(e) => updateField('hero_badge_3', e.target.value)}
                                placeholder="British Council Certified"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. SERVICES INTRO HEADER */}
            {activeTab === 'services_intro' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Services Catalog Heading
                        </label>
                        <input
                            type="text"
                            value={content.services_title ?? 'Tailored consultancy services for your journey'}
                            onChange={(e) => updateField('services_title', e.target.value)}
                            placeholder="Tailored consultancy services for your journey"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Services Catalog Subtitle
                        </label>
                        <textarea
                            rows={3}
                            value={content.services_subtitle ?? 'Explore how our counselors guide you from initial inquiry through to campus arrival.'}
                            onChange={(e) => updateField('services_subtitle', e.target.value)}
                            placeholder="Provide explanatory intro text for your list of services..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 3. BOTTOM CTA BANNER */}
            {activeTab === 'cta_banner' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            CTA Banner Main Heading
                        </label>
                        <input
                            type="text"
                            value={content.cta_title ?? 'Ready to start your journey?'}
                            onChange={(e) => updateField('cta_title', e.target.value)}
                            placeholder="Ready to start your journey?"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            CTA Banner Descriptive Text
                        </label>
                        <textarea
                            rows={3}
                            value={content.cta_subtitle ?? 'Book a free consultation with our expert advisors today and take the first step towards your global future. Our British Council certified counselors are here to help you get admitted into top universities.'}
                            onChange={(e) => updateField('cta_subtitle', e.target.value)}
                            placeholder="Enter compelling call to action text..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Primary Button Label
                            </label>
                            <input
                                type="text"
                                value={content.cta_primary_btn ?? 'Book a Free Call'}
                                onChange={(e) => updateField('cta_primary_btn', e.target.value)}
                                placeholder="Book a Free Call"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Secondary Button Label
                            </label>
                            <input
                                type="text"
                                value={content.cta_secondary_btn ?? 'Take Free Assessment'}
                                onChange={(e) => updateField('cta_secondary_btn', e.target.value)}
                                placeholder="Take Free Assessment"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
