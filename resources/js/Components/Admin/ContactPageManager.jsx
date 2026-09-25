import React, { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Building2,
    MessageSquare,
    Globe,
    CheckCircle2,
    Sparkles,
    HelpCircle,
    Compass
} from 'lucide-react';

export default function ContactPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('inquiry_form');

    const updateField = (field, value) => {
        onChange({
            ...content,
            [field]: value
        });
    };

    const updateSection = (section, field, value) => {
        onChange({
            ...content,
            [section]: {
                ...(content[section] || {}),
                [field]: value
            }
        });
    };

    const tabs = [
        { id: 'inquiry_form', label: 'Inquiry Form', icon: MessageSquare },
        { id: 'hq_details', label: 'London HQ & Info Card', icon: Building2 },
        { id: 'branches', label: 'Global Branches Network', icon: Globe },
        { id: 'roadmap', label: 'Admission Roadmap', icon: Compass },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* MANAGER HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            Contact Us Page Customization
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure form headers, London HQ contact card, global branch notes, and roadmap texts
                        </p>
                    </div>
                </div>

                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Contact Customizer</span>
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

            {/* TAB CONTENT: 1. INQUIRY FORM */}
            {activeTab === 'inquiry_form' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Form Section Heading
                        </label>
                        <input
                            type="text"
                            value={content.form_title ?? 'Send us a message'}
                            onChange={(e) => updateField('form_title', e.target.value)}
                            placeholder="e.g. Send us a message"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Form Section Subtitle / Instructions
                        </label>
                        <textarea
                            rows={3}
                            value={content.form_subtitle ?? 'Have questions about application deadlines, university rankings, or visa criteria? Drop your inquiry below.'}
                            onChange={(e) => updateField('form_subtitle', e.target.value)}
                            placeholder="Provide helpful instructions for students submitting the form..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 2. LONDON HQ & CONTACT CARD */}
            {activeTab === 'hq_details' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                        These settings allow you to override the contact card displayed on the Contact page. Leave empty to use system defaults from Settings.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Card Title
                            </label>
                            <input
                                type="text"
                                value={content.info_title ?? 'Contact Information'}
                                onChange={(e) => updateField('info_title', e.target.value)}
                                placeholder="Contact Information"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Card Subtitle
                            </label>
                            <input
                                type="text"
                                value={content.info_subtitle ?? 'London Global HQ & Regional Advisory Center'}
                                onChange={(e) => updateField('info_subtitle', e.target.value)}
                                placeholder="London Global HQ & Regional Advisory Center"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Contact Email Override
                            </label>
                            <input
                                type="email"
                                value={content.email ?? ''}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="e.g. info@rms-group.com"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Contact Phone Override
                            </label>
                            <input
                                type="text"
                                value={content.phone ?? ''}
                                onChange={(e) => updateField('phone', e.target.value)}
                                placeholder="e.g. 020 7423 9333"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            HQ Physical Address Override
                        </label>
                        <textarea
                            rows={2}
                            value={content.address ?? ''}
                            onChange={(e) => updateField('address', e.target.value)}
                            placeholder="e.g. 1st Floor, Botanical Works, 2 Jubilee Street, London E1 3FU"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Operating / Office Hours Override
                        </label>
                        <input
                            type="text"
                            value={content.operating_hours ?? ''}
                            onChange={(e) => updateField('operating_hours', e.target.value)}
                            placeholder="e.g. Monday - Friday: 9:00 AM - 6:00 PM GMT"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Google Maps Embed URL or Iframe Override
                        </label>
                        <input
                            type="text"
                            value={content.map_iframe ?? ''}
                            onChange={(e) => updateField('map_iframe', e.target.value)}
                            placeholder="Paste Google Maps iframe HTML or direct embed src URL..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 3. GLOBAL BRANCHES NETWORK */}
            {activeTab === 'branches' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Branches Section Heading
                        </label>
                        <input
                            type="text"
                            value={content.branches_title ?? 'Our Global Branches'}
                            onChange={(e) => updateField('branches_title', e.target.value)}
                            placeholder="Our Global Branches"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Branches Section Subtitle
                        </label>
                        <textarea
                            rows={3}
                            value={content.branches_subtitle ?? 'Local offices staffed by certified counselors across South Asia, Africa, Europe, and North America.'}
                            onChange={(e) => updateField('branches_subtitle', e.target.value)}
                            placeholder="Enter descriptive text explaining your global branch network..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* TAB CONTENT: 4. ADMISSION ROADMAP */}
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
