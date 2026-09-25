import React, { useState } from 'react';
import {
    Handshake,
    Sparkles,
    Building2,
    Coins,
    Users,
    Zap,
    FileCheck,
    Compass,
    CheckCircle2
} from 'lucide-react';

export default function PartnerPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('benefits');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const updateBenefitItem = (index, field, value) => {
        const defaultBenefits = [
            {
                title: 'Top Tier Institutions',
                description: 'Access to high-ranked universities globally across the UK, USA, Finland, & Dubai with direct admissions agreements.'
            },
            {
                title: 'Attractive Commissions',
                description: 'Competitive and timely commission structures with transparent payout reporting and performance bonuses.'
            },
            {
                title: 'Dedicated Account Manager',
                description: 'Personalised 1-on-1 support for your student applications, document checking, and compliance queries.'
            },
            {
                title: 'Streamlined Processing',
                description: 'Fast-track application evaluation and direct university admission portal access for rapid offer letters.'
            }
        ];

        const currentBenefits = (content.benefits_items && Array.isArray(content.benefits_items) && content.benefits_items.length === 4)
            ? [...content.benefits_items]
            : [...defaultBenefits];

        currentBenefits[index] = {
            ...(currentBenefits[index] || {}),
            [field]: value
        };

        updateField('benefits_items', currentBenefits);
    };

    const benefitsData = (content.benefits_items && Array.isArray(content.benefits_items) && content.benefits_items.length === 4)
        ? content.benefits_items
        : [
            {
                title: 'Top Tier Institutions',
                description: 'Access to high-ranked universities globally across the UK, USA, Finland, & Dubai with direct admissions agreements.'
            },
            {
                title: 'Attractive Commissions',
                description: 'Competitive and timely commission structures with transparent payout reporting and performance bonuses.'
            },
            {
                title: 'Dedicated Account Manager',
                description: 'Personalised 1-on-1 support for your student applications, document checking, and compliance queries.'
            },
            {
                title: 'Streamlined Processing',
                description: 'Fast-track application evaluation and direct university admission portal access for rapid offer letters.'
            }
        ];

    const tabs = [
        { id: 'benefits', label: 'Partner Benefits (4 Cards)', icon: Zap },
        { id: 'partner_form', label: 'Application Form Header', icon: FileCheck },
        { id: 'roadmap', label: 'Admission Roadmap', icon: Compass },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                        <Handshake className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Partner With Us Page Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure partnership value propositions, benefit cards, application form header, and roadmap
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Partner Customizer</span>
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
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT: 1. PARTNER BENEFITS (4 CARDS) */}
            {activeTab === 'benefits' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Header Controls */}
                    <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Benefits Badge Tagline
                                </label>
                                <input
                                    type="text"
                                    value={content.benefits_badge ?? 'PARTNER ADVANTAGE'}
                                    onChange={(e) => updateField('benefits_badge', e.target.value)}
                                    placeholder="PARTNER ADVANTAGE"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Benefits Section Title
                                </label>
                                <input
                                    type="text"
                                    value={content.benefits_title ?? 'Why partner with us?'}
                                    onChange={(e) => updateField('benefits_title', e.target.value)}
                                    placeholder="Why partner with us?"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Benefits Section Subtitle
                            </label>
                            <input
                                type="text"
                                value={content.benefits_subtitle ?? 'Empower your agency with industry-leading higher education partnerships and seamless application support.'}
                                onChange={(e) => updateField('benefits_subtitle', e.target.value)}
                                placeholder="Empower your agency with industry-leading higher education partnerships..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* 4 Benefit Cards Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {benefitsData.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-400">
                                    <span>Benefit Card #{idx + 1}</span>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Card Title
                                    </label>
                                    <input
                                        type="text"
                                        value={item.title || ''}
                                        onChange={(e) => updateBenefitItem(idx, 'title', e.target.value)}
                                        placeholder="Card Title"
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                                        Card Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={item.description || ''}
                                        onChange={(e) => updateBenefitItem(idx, 'description', e.target.value)}
                                        placeholder="Card Description"
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. APPLICATION FORM HEADER */}
            {activeTab === 'partner_form' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Form Top Badge
                        </label>
                        <input
                            type="text"
                            value={content.form_badge ?? 'PARTNER APPLICATION'}
                            onChange={(e) => updateField('form_badge', e.target.value)}
                            placeholder="PARTNER APPLICATION"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Form Main Title
                        </label>
                        <input
                            type="text"
                            value={content.form_title ?? 'Apply for Partnership'}
                            onChange={(e) => updateField('form_title', e.target.value)}
                            placeholder="Apply for Partnership"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Form Subtitle / Instructions
                        </label>
                        <textarea
                            rows={3}
                            value={content.form_subtitle ?? 'Fill out the form below to register your agency. Our partnerships team will get back to you within 48 hours.'}
                            onChange={(e) => updateField('form_subtitle', e.target.value)}
                            placeholder="Provide instructions for partnership applicants..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold"
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
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
