import React, { useState } from 'react';
import {
    Sparkles,
    Target,
    Award,
    ShieldCheck,
    Users,
    Upload,
    Trash2,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Globe2,
    HeartHandshake,
    Gift,
    Scale,
    Lock,
    FileCheck2,
    Building2,
    Star,
    HelpCircle,
    ExternalLink
} from 'lucide-react';

export default function AboutPageManager({ content = {}, onChange }) {
    const [activeTab, setActiveTab] = useState('hero_stats');
    const [isUploadingMissionImg, setIsUploadingMissionImg] = useState(false);
    const [missionImgUploadError, setMissionImgUploadError] = useState('');

    // Safe getters & updaters for nested content
    const updateSectionField = (section, field, value) => {
        const nextContent = {
            ...content,
            [section]: {
                ...(content[section] || {}),
                [field]: value
            }
        };
        if (section === 'mission' && field === 'image') {
            nextContent.mission_image = value;
        }
        onChange(nextContent);
    };

    const updateArrayItem = (section, arrayName, index, field, value, defaultItems = []) => {
        const currentArr = (content[section] && content[section][arrayName]) || defaultItems;
        const newArr = [...currentArr];
        newArr[index] = {
            ...(newArr[index] || {}),
            [field]: value
        };
        updateSectionField(section, arrayName, newArr);
    };

    // Generic upload handler for section images
    const handleMissionImageUpload = async (file) => {
        if (!file) return;
        setIsUploadingMissionImg(true);
        setMissionImgUploadError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const res = await fetch('/admin/pages/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Image upload failed.');
            }

            const resData = await res.json();
            if (resData.url) {
                updateSectionField('mission', 'image', resData.url);
            }
        } catch (err) {
            console.error('Mission image upload failed:', err);
            setMissionImgUploadError(err.message || 'Failed to upload image. Please try again or provide an image URL.');
        } finally {
            setIsUploadingMissionImg(false);
        }
    };

    // Defaults for previews & placeholders
    const defaultStats = [
        { number: '24', suffix: 'Years', label: 'of experience' },
        { number: '10,000+', suffix: 'Students', label: 'placed globally' },
        { number: '4.8/5', suffix: 'Rating', label: 'Student rating' },
        { number: '100%', suffix: 'Free', label: 'Free services' },
    ];

    const currentStats = content?.stats && Array.isArray(content.stats) && content.stats.length === 4
        ? content.stats
        : defaultStats;

    const defaultValues = [
        { title: 'Free for students', text: 'Our guidance is completely free from first enquiry to enrolment.', badge: '100% Free' },
        { title: 'Unbiased advice', text: 'We recommend what fits you, not only the institutions we represent.', badge: 'Student-First' },
        { title: 'Global reach, local care', text: 'Advisors across South Asia, Africa and Europe, informed by London HQ.', badge: '15+ Offices' },
        { title: '24 years of trust', text: 'Nearly two and a half decades placing students at top universities.', badge: 'Est. 2002' },
    ];

    const currentValues = content?.values?.items && Array.isArray(content.values.items) && content.values.items.length === 4
        ? content.values.items
        : defaultValues;

    const defaultCommitments = [
        {
            title: 'British Council certified UK agents & counsellors',
            description: 'Officially trained and accredited counselors adhering to rigorous UK higher education standards.'
        },
        {
            title: 'Committed to AQF & ethical UKVI sponsor practice',
            description: 'Strict adherence to Australian Qualifications Framework and UK Home Office visa sponsor compliance.'
        },
        {
            title: 'National Code of Ethical Practice for Agents',
            description: 'Uncompromising integrity, transparent advice, and student-first data protection standards.'
        },
    ];

    const currentCommitments = content?.commitment?.items && Array.isArray(content.commitment.items) && content.commitment.items.length === 3
        ? content.commitment.items
        : defaultCommitments;

    const tabs = [
        { id: 'hero_stats', name: 'Hero Stats & Badges', icon: Sparkles, badge: 'Hero' },
        { id: 'mission', name: 'Our Mission & Photo', icon: Target, badge: 'Photo & Text' },
        { id: 'values', name: 'What We Stand For', icon: Award, badge: 'Section 3' },
        { id: 'commitment', name: 'Ethics & Accreditation', icon: ShieldCheck, badge: 'Section 4' },
        { id: 'team_banner', name: 'Workforce Banner', icon: Users, badge: 'Section 5' },
        { id: 'faq_settings', name: 'FAQ Section', icon: HelpCircle, badge: 'Visibility' },
    ];

    return (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            
            {/* COMPONENT HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>About Page Sections & Content</span>
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                Dedicated CMS
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Customize all core narrative sections, counter stats, imagery, and accreditation badges on <span className="font-mono text-blue-600 dark:text-blue-400">/about</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800 scrollbar-none">
                {tabs.map((tab) => {
                    const IconComp = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                            <span>{tab.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>
                                {tab.badge}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENT 1: HERO STATS & TRUST BADGES */}
            {activeTab === 'hero_stats' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                            Hero Counter Stats (4 Highlight Cards)
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            These 4 stat counter blocks are displayed across the bottom of the hero banner on the About page.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {currentStats.map((st, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                                    Card #{idx + 1}
                                </span>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Big Number / Stat
                                    </label>
                                    <input
                                        type="text"
                                        value={st.number || ''}
                                        placeholder={defaultStats[idx].number}
                                        onChange={(e) => {
                                            const updated = [...currentStats];
                                            updated[idx] = { ...updated[idx], number: e.target.value };
                                            onChange({ ...content, stats: updated });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Suffix / Badge Text
                                    </label>
                                    <input
                                        type="text"
                                        value={st.suffix || ''}
                                        placeholder={defaultStats[idx].suffix}
                                        onChange={(e) => {
                                            const updated = [...currentStats];
                                            updated[idx] = { ...updated[idx], suffix: e.target.value };
                                            onChange({ ...content, stats: updated });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                        Label / Description
                                    </label>
                                    <input
                                        type="text"
                                        value={st.label || ''}
                                        placeholder={defaultStats[idx].label}
                                        onChange={(e) => {
                                            const updated = [...currentStats];
                                            updated[idx] = { ...updated[idx], label: e.target.value };
                                            onChange({ ...content, stats: updated });
                                        }}
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                            Hero Trust Badges (Under Heading)
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[0, 1, 2].map((idx) => {
                                const defaultTexts = [
                                    'Headquartered in London, UK',
                                    'Presence in 15+ Countries',
                                    'ICEF & British Council Certified'
                                ];
                                const currentBadgeVal = content?.trust_badges?.[idx]?.text || content?.trust_badges?.[idx] || '';
                                return (
                                    <div key={idx}>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            Badge #{idx + 1}
                                        </label>
                                        <input
                                            type="text"
                                            value={currentBadgeVal}
                                            placeholder={defaultTexts[idx]}
                                            onChange={(e) => {
                                                const updated = Array.isArray(content?.trust_badges) ? [...content.trust_badges] : [
                                                    { text: defaultTexts[0] },
                                                    { text: defaultTexts[1] },
                                                    { text: defaultTexts[2] }
                                                ];
                                                updated[idx] = { text: e.target.value };
                                                onChange({ ...content, trust_badges: updated });
                                            }}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 2: MISSION SECTION */}
            {activeTab === 'mission' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    
                    {/* 1. MISSION BANNER PHOTO UPLOADER (PROMINENT AT TOP) */}
                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>"Our Mission" Section Featured Banner Photo</span>
                                </label>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    This photo is prominently displayed with the floating counseling badges on the About page.
                                </p>
                            </div>
                            <span className="text-[11px] text-slate-400">
                                1600x900px or 1920x1080px recommended
                            </span>
                        </div>

                        {/* Live Photo Preview */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 group">
                            <div className="relative h-48 sm:h-64 w-full">
                                <img
                                    src={content?.mission?.image || content?.mission_image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80'}
                                    alt="Mission Banner Preview"
                                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/30 pointer-events-none" />

                                {/* Action Buttons Top Right */}
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                    {(content?.mission?.image || content?.mission_image) && (
                                        <button
                                            type="button"
                                            onClick={() => updateSectionField('mission', 'image', '')}
                                            className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Reset to Default Photo</span>
                                        </button>
                                    )}
                                </div>

                                {/* Floating details at bottom */}
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                                    <span className="font-mono truncate max-w-xs sm:max-w-md bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                                        {content?.mission?.image || content?.mission_image || 'Default Photo: Unsplash (Students with Advisor)'}
                                    </span>
                                    <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-xs ${
                                        (content?.mission?.image || content?.mission_image)
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-blue-600/80 text-white'
                                    }`}>
                                        {(content?.mission?.image || content?.mission_image) ? 'Custom Mission Photo Active' : 'Default Photo Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Upload & Direct URL Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-6">
                                <label className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl border-2 border-dashed ${
                                    isUploadingMissionImg
                                        ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 cursor-wait'
                                        : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer'
                                } transition-all`}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploadingMissionImg}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleMissionImageUpload(e.target.files[0]);
                                            }
                                        }}
                                        className="hidden"
                                    />
                                    {isUploadingMissionImg ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                            <span className="text-xs font-bold">Uploading photo...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-bold">
                                                {(content?.mission?.image || content?.mission_image) ? 'Upload Replacement Mission Photo' : 'Upload Mission Photo from Computer'}
                                            </span>
                                        </>
                                    )}
                                </label>
                            </div>

                            <div className="sm:col-span-6">
                                <input
                                    type="text"
                                    value={content?.mission?.image || content?.mission_image || ''}
                                    placeholder="Or paste external photo URL..."
                                    onChange={(e) => updateSectionField('mission', 'image', e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {missionImgUploadError && (
                            <p className="text-xs text-rose-500 font-semibold">{missionImgUploadError}</p>
                        )}
                    </div>

                    {/* 2. SECTION TITLE & HIGHLIGHT QUOTE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Section Left Title
                            </label>
                            <input
                                type="text"
                                value={content?.mission?.title || ''}
                                placeholder="Our mission"
                                onChange={(e) => updateSectionField('mission', 'title', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Main Highlight Quote
                            </label>
                            <input
                                type="text"
                                value={content?.mission?.quote || ''}
                                placeholder='"To bridge the gap between students and prestigious institutions..."'
                                onChange={(e) => updateSectionField('mission', 'quote', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* 3. MISSION STATEMENT */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Detailed Mission Statement / Narrative
                        </label>
                        <textarea
                            rows={3}
                            value={content?.mission?.description || ''}
                            placeholder="Our diverse student community comes from Europe, South Asia, the Middle East and Africa..."
                            onChange={(e) => updateSectionField('mission', 'description', e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Floating Badges on Image */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Image Floating Badge 1 (Unbiased Counseling)
                            </span>
                            <input
                                type="text"
                                value={content?.mission?.badge1_title || ''}
                                placeholder="100% Unbiased Counseling"
                                onChange={(e) => updateSectionField('mission', 'badge1_title', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                            />
                            <input
                                type="text"
                                value={content?.mission?.badge1_text || ''}
                                placeholder="Guiding students from Europe, South Asia, Middle East & Africa"
                                onChange={(e) => updateSectionField('mission', 'badge1_text', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Image Floating Badge 2 (Right Corner Pill)
                            </span>
                            <input
                                type="text"
                                value={content?.mission?.badge2_text || ''}
                                placeholder="Zero Hidden Costs"
                                onChange={(e) => updateSectionField('mission', 'badge2_text', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none mt-2"
                            />
                        </div>
                    </div>

                    {/* 3 Pillars */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            3 Mission Pillar Cards
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[1, 2, 3].map((num) => {
                                const defaultTitles = ['Global Community', 'Student-First Policy', '100% Free Services'];
                                const defaultDescs = ['Students from 40+ nations worldwide.', 'Unbiased recommendations always.', 'From first enquiry to final enrolment.'];
                                const titleKey = `pillar${num}_title`;
                                const descKey = `pillar${num}_desc`;
                                return (
                                    <div key={num} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">
                                            Pillar #{num}
                                        </span>
                                        <input
                                            type="text"
                                            value={content?.mission?.[titleKey] || ''}
                                            placeholder={defaultTitles[num - 1]}
                                            onChange={(e) => updateSectionField('mission', titleKey, e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                        />
                                        <textarea
                                            rows={2}
                                            value={content?.mission?.[descKey] || ''}
                                            placeholder={defaultDescs[num - 1]}
                                            onChange={(e) => updateSectionField('mission', descKey, e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 3: VALUES ("WHAT WE STAND FOR") */}
            {activeTab === 'values' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Section Title
                            </label>
                            <input
                                type="text"
                                value={content?.values?.title || ''}
                                placeholder="What we stand for"
                                onChange={(e) => updateSectionField('values', 'title', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Section Subtitle
                            </label>
                            <input
                                type="text"
                                value={content?.values?.subtitle || ''}
                                placeholder="Our foundational values guide every counseling session..."
                                onChange={(e) => updateSectionField('values', 'subtitle', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            4 Core Value Cards
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentValues.map((val, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                            Value Card #{idx + 1}
                                        </span>
                                        <div className="w-32">
                                            <input
                                                type="text"
                                                value={val.badge || ''}
                                                placeholder={defaultValues[idx].badge}
                                                onChange={(e) => updateArrayItem('values', 'items', idx, 'badge', e.target.value, defaultValues)}
                                                className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-right text-slate-700 dark:text-slate-200 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Card Heading
                                        </label>
                                        <input
                                            type="text"
                                            value={val.title || ''}
                                            placeholder={defaultValues[idx].title}
                                            onChange={(e) => updateArrayItem('values', 'items', idx, 'title', e.target.value, defaultValues)}
                                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                                            Card Narrative / Description
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={val.text || ''}
                                            placeholder={defaultValues[idx].text}
                                            onChange={(e) => updateArrayItem('values', 'items', idx, 'text', e.target.value, defaultValues)}
                                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 4: COMMITMENT & ACCREDITATION */}
            {activeTab === 'commitment' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Section Tagline (Top Blue Text)
                            </label>
                            <input
                                type="text"
                                value={content?.commitment?.tagline || ''}
                                placeholder="Our commitment"
                                onChange={(e) => updateSectionField('commitment', 'tagline', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Section Main Title
                            </label>
                            <input
                                type="text"
                                value={content?.commitment?.title || ''}
                                placeholder="Ethical practice & certified advisors"
                                onChange={(e) => updateSectionField('commitment', 'title', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Section Main Descriptive Paragraph
                        </label>
                        <textarea
                            rows={3}
                            value={content?.commitment?.description || ''}
                            placeholder="We're committed to the principles of the AQF and the National Code of Ethical Practice..."
                            onChange={(e) => updateSectionField('commitment', 'description', e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Trust Guarantee / Lock Callout Text
                        </label>
                        <input
                            type="text"
                            value={content?.commitment?.quote || ''}
                            placeholder="Certified counseling guarantees 100% genuine university applications with zero misleading promises."
                            onChange={(e) => updateSectionField('commitment', 'quote', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                        />
                    </div>

                    {/* 3 Commitment Cards */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            3 Accreditation & Code Badges (Right Column)
                        </h4>
                        <div className="space-y-3">
                            {currentCommitments.map((com, idx) => (
                                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                        Accreditation Item #{idx + 1}
                                    </span>
                                    <input
                                        type="text"
                                        value={com.title || ''}
                                        placeholder={defaultCommitments[idx].title}
                                        onChange={(e) => updateArrayItem('commitment', 'items', idx, 'title', e.target.value, defaultCommitments)}
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                                    />
                                    <textarea
                                        rows={2}
                                        value={com.description || ''}
                                        placeholder={defaultCommitments[idx].description}
                                        onChange={(e) => updateArrayItem('commitment', 'items', idx, 'description', e.target.value, defaultCommitments)}
                                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 5: WORKFORCE / TEAM BANNER */}
            {activeTab === 'team_banner' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                            Team Section Headings & Workforce Counter
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            You can override the team headings and the global employee counter banner here without modifying global settings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Team Section Title
                            </label>
                            <input
                                type="text"
                                value={content?.team?.heading || ''}
                                placeholder="Meet our global education leadership"
                                onChange={(e) => updateSectionField('team', 'heading', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Team Section Subtitle
                            </label>
                            <input
                                type="text"
                                value={content?.team?.subheading || ''}
                                placeholder="Driven by ethics, academic expertise, and student success..."
                                onChange={(e) => updateSectionField('team', 'subheading', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Counter Display (e.g. 50+ Global Team Members)
                            </label>
                            <input
                                type="text"
                                value={content?.team?.employee_count || ''}
                                placeholder="50+ Global Team Members"
                                onChange={(e) => updateSectionField('team', 'employee_count', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Counter Subtext / Narrative
                            </label>
                            <input
                                type="text"
                                value={content?.team?.employee_stat_subtext || ''}
                                placeholder="Dedicated education consultants, visa case officers..."
                                onChange={(e) => updateSectionField('team', 'employee_stat_subtext', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 6: FAQ SECTION DISPLAY SETTINGS */}
            {activeTab === 'faq_settings' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                            FAQ Accordion Section Visibility
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Control whether the dynamic Frequently Asked Questions accordion section appears on the About page.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>Display FAQ Accordion on About Page</span>
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {content?.show_faqs !== false && !content?.hide_faqs
                                        ? 'The FAQ section is currently visible to students and visitors.'
                                        : 'The FAQ section is currently hidden from the About page.'}
                                </p>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={content?.show_faqs !== false && !content?.hide_faqs}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        onChange({
                                            ...content,
                                            show_faqs: checked,
                                            hide_faqs: !checked,
                                        });
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Status preview banner */}
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
                            content?.show_faqs !== false && !content?.hide_faqs
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300'
                        }`}>
                            <div className={`p-2 rounded-xl shrink-0 ${
                                content?.show_faqs !== false && !content?.hide_faqs
                                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600'
                                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-600'
                            }`}>
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="text-xs font-semibold">
                                {content?.show_faqs !== false && !content?.hide_faqs
                                    ? 'FAQ section is active. Visitors can browse and expand answers at the bottom of /about.'
                                    : 'FAQ section is hidden. The page will cleanly end after the accreditation/ethics and dynamic builder blocks.'}
                            </div>
                        </div>

                        {/* Link to central FAQs manager */}
                        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <span className="text-slate-500 dark:text-slate-400">
                                Need to add, update, or reorder questions?
                            </span>
                            <a
                                href="/admin/faqs"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                <span>Open Central FAQs Manager</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
