import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    Award,
    Plus,
    Edit3,
    Trash2,
    Copy,
    MoveUp,
    MoveDown,
    Eye,
    EyeOff,
    CheckCircle2,
    X,
    Search,
    Calendar,
    Globe,
    GraduationCap,
    DollarSign,
    Sparkles,
    SlidersHorizontal,
    Save,
    AlertCircle,
    Check
} from 'lucide-react';

const BADGE_COLOR_OPTIONS = [
    { value: 'blue', label: 'Ocean Blue', classes: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800' },
    { value: 'purple', label: 'Royal Purple', classes: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800' },
    { value: 'indigo', label: 'Deep Indigo', classes: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800' },
    { value: 'emerald', label: 'Emerald Green', classes: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800' },
    { value: 'amber', label: 'Warm Amber', classes: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800' },
    { value: 'rose', label: 'Rose Pink', classes: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800' },
];

export const getCountryFlagEmoji = (code, countryName = '') => {
    if (code && typeof code === 'string' && code.trim().length === 2) {
        try {
            return String.fromCodePoint(
                ...code.trim().toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
            );
        } catch {
            // fallback
        }
    }
    const nameMap = {
        'united kingdom': '🇬🇧',
        'uk': '🇬🇧',
        'great britain': '🇬🇧',
        'united states': '🇺🇸',
        'united states of america': '🇺🇸',
        'usa': '🇺🇸',
        'us': '🇺🇸',
        'finland': '🇫🇮',
        'united arab emirates': '🇦🇪',
        'uae': '🇦🇪',
        'dubai': '🇦🇪',
        'dubai (uae)': '🇦🇪',
        'canada': '🇨🇦',
        'australia': '🇦🇺',
        'germany': '🇩🇪',
        'ireland': '🇮🇪',
        'india': '🇮🇳',
        'nigeria': '🇳🇬',
        'japan': '🇯🇵',
        'brazil': '🇧🇷',
        'south africa': '🇿🇦',
        'france': '🇫🇷',
        'china': '🇨🇳',
        'malaysia': '🇲🇾',
        'sweden': '🇸🇪',
        'netherlands': '🇳🇱',
        'new zealand': '🇳🇿',
        'singapore': '🇸🇬',
        'italy': '🇮🇹',
        'spain': '🇪🇸',
        'switzerland': '🇨🇭',
        'south korea': '🇰🇷',
    };
    if (countryName) {
        const lower = countryName.trim().toLowerCase();
        if (nameMap[lower]) return nameMap[lower];
    }
    return '🌍';
};

export const getBadgeClasses = (colorName) => {
    const found = BADGE_COLOR_OPTIONS.find(c => c.value === colorName);
    return found ? found.classes : BADGE_COLOR_OPTIONS[0].classes;
};

export default function ScholarshipsManager({
    content = {},
    onChange,
    countries = [],
    onSave = null,
    isSaving = false,
}) {
    const heading = content?.scholarships_heading || 'Available Scholarships';
    const subtitle = content?.scholarships_subtitle || 'Verified funding opportunities for Fall 2026 / Spring 2027 intakes';
    const rawScholarships = Array.isArray(content?.scholarships) ? content.scholarships : [];

    const [scholarships, setScholarships] = useState(rawScholarships);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [justSavedMessage, setJustSavedMessage] = useState('');

    // Keep state synced with incoming content prop
    useEffect(() => {
        if (Array.isArray(content?.scholarships)) {
            setScholarships(content.scholarships);
        }
    }, [content?.scholarships]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); // null = new, number = edit
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        flag: '',
        type: 'Postgraduate',
        amount: '',
        deadline: '',
        description: '',
        badgeColor: 'blue',
        is_active: true,
    });

    const updateAll = (newHeading, newSubtitle, newList, triggerSaveNow = false) => {
        setScholarships(newList);
        setHasUnsavedChanges(true);

        const updatedContent = {
            ...content,
            scholarships_heading: newHeading,
            scholarships_subtitle: newSubtitle,
            scholarships: newList,
        };

        onChange(updatedContent);

        if (triggerSaveNow && onSave) {
            onSave(updatedContent);
            setHasUnsavedChanges(false);
            setJustSavedMessage('Scholarships successfully saved and published!');
            setTimeout(() => setJustSavedMessage(''), 4000);
        }
    };

    const handleHeadingChange = (val) => {
        updateAll(val, subtitle, scholarships);
    };

    const handleSubtitleChange = (val) => {
        updateAll(heading, val, scholarships);
    };

    const openAddModal = () => {
        setEditingIndex(null);
        setFormErrors({});
        setFormData({
            name: '',
            country: 'UK',
            flag: '🇬🇧',
            type: 'Postgraduate',
            amount: '',
            deadline: '',
            description: '',
            badgeColor: 'blue',
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (index) => {
        const item = scholarships[index];
        setEditingIndex(index);
        setFormErrors({});
        setFormData({
            name: item.name || '',
            country: item.country || '',
            flag: item.flag || '',
            type: item.type || 'Postgraduate',
            amount: item.amount || '',
            deadline: item.deadline || '',
            description: item.description || '',
            badgeColor: item.badgeColor || 'blue',
            is_active: item.is_active !== false,
        });
        setIsModalOpen(true);
    };

    const handleSaveScholarship = (saveImmediately = false) => {
        const errors = {};
        if (!formData.name?.trim()) errors.name = 'Scholarship name is required';
        if (!formData.country?.trim()) errors.country = 'Destination country is required';
        if (!formData.amount?.trim()) errors.amount = 'Award amount is required';
        if (!formData.description?.trim()) errors.description = 'Eligibility / description details are required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});
        let updatedList = [...scholarships];

        if (editingIndex === null) {
            // Create
            const newItem = {
                ...formData,
                id: Date.now(),
            };
            updatedList.push(newItem);
        } else {
            // Update
            updatedList[editingIndex] = {
                ...updatedList[editingIndex],
                ...formData,
            };
        }

        updateAll(heading, subtitle, updatedList, saveImmediately);
        setIsModalOpen(false);
    };

    const handleDelete = (index) => {
        const item = scholarships[index];
        if (window.confirm(`Are you sure you want to remove "${item.name}"?`)) {
            const updated = scholarships.filter((_, i) => i !== index);
            updateAll(heading, subtitle, updated);
        }
    };

    const handleDuplicate = (index) => {
        const item = scholarships[index];
        const duplicated = {
            ...item,
            id: Date.now(),
            name: `${item.name} (Copy)`,
        };
        const updated = [...scholarships];
        updated.splice(index + 1, 0, duplicated);
        updateAll(heading, subtitle, updated);
    };

    const handleToggleActive = (index) => {
        const updated = [...scholarships];
        updated[index] = {
            ...updated[index],
            is_active: updated[index].is_active === false ? true : false,
        };
        updateAll(heading, subtitle, updated);
    };

    const handleMove = (index, dir) => {
        const target = index + dir;
        if (target < 0 || target >= scholarships.length) return;
        const updated = [...scholarships];
        const temp = updated[index];
        updated[index] = updated[target];
        updated[target] = temp;
        updateAll(heading, subtitle, updated);
    };

    // Filter scholarships for display in admin
    const filteredScholarships = scholarships.filter((s) => {
        const matchesSearch =
            (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.country || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.amount || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === 'All' || s.type === filterLevel;
        return matchesSearch && matchesLevel;
    });

    const activeCount = scholarships.filter(s => s.is_active !== false).length;
    const countriesCount = new Set(scholarships.map(s => s.country)).size;

    return (
        <div className="space-y-6">

            {/* SECTION HEADER & STATS CARD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3" />
                                <span>SCHOLARSHIPS DIRECTORY</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Scholarships & Funding Opportunities
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Manage the scholarship cards, award amounts, deadlines, and degree filters shown on the public site.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {hasUnsavedChanges && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 animate-pulse">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Unsaved Changes</span>
                            </span>
                        )}

                        {onSave && hasUnsavedChanges && (
                            <button
                                type="button"
                                onClick={() => {
                                    onSave();
                                    setHasUnsavedChanges(false);
                                    setJustSavedMessage('Changes saved and published to database & live site!');
                                    setTimeout(() => setJustSavedMessage(''), 4000);
                                }}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:scale-[1.02] transition-all cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSaving ? 'Publishing...' : 'Save & Publish Now'}</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add New Scholarship</span>
                        </button>
                    </div>
                </div>

                {/* JUST SAVED SUCCESS ALERT */}
                {justSavedMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{justSavedMessage}</span>
                    </div>
                )}

                {/* SECTION HEADING & SUBTITLE SETTINGS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Section Main Heading
                        </label>
                        <input
                            type="text"
                            value={heading}
                            onChange={(e) => handleHeadingChange(e.target.value)}
                            placeholder="Available Scholarships"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                            Appears above the scholarship grid (e.g. "Available Scholarships (6)")
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                            Section Subtitle / Description
                        </label>
                        <input
                            type="text"
                            value={subtitle}
                            onChange={(e) => handleSubtitleChange(e.target.value)}
                            placeholder="Verified funding opportunities for Fall 2026 / Spring 2027 intakes"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                            Helper text explaining intake periods or qualification criteria
                        </p>
                    </div>
                </div>

                {/* METRICS ROW */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Listed</span>
                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">{scholarships.length}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Active Publicly</span>
                        <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{activeCount}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Countries Covered</span>
                        <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{countriesCount}</span>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search scholarship name, country, or amount..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Level:</span>
                    {['All', 'Postgraduate', 'Undergraduate'].map((lvl) => (
                        <button
                            key={lvl}
                            type="button"
                            onClick={() => setFilterLevel(lvl)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                filterLevel === lvl
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* SCHOLARSHIPS CARDS LIST */}
            {filteredScholarships.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <Award className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                    <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                        {scholarships.length === 0 ? 'No scholarships added yet' : 'No matching scholarships found'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        {scholarships.length === 0
                            ? 'Click "Add New Scholarship" above to list your first funding opportunity.'
                            : 'Try adjusting your search query or degree level filter.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredScholarships.map((item) => {
                        const originalIndex = scholarships.findIndex(s => s.id === item.id);
                        const isFirst = originalIndex === 0;
                        const isLast = originalIndex === scholarships.length - 1;
                        const isActive = item.is_active !== false;

                        return (
                            <div
                                key={item.id || originalIndex}
                                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 ${
                                    isActive
                                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400/80 shadow-xs'
                                        : 'bg-slate-50/80 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-700 opacity-60'
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    
                                    {/* Left Details */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shrink-0 border border-slate-200 dark:border-slate-700">
                                            {item.flag || '🎓'}
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                    {item.name}
                                                </h4>
                                                
                                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeClasses(item.badgeColor)}`}>
                                                    {item.type}
                                                </span>

                                                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800">
                                                    {item.amount || 'Tuition Grant'}
                                                </span>

                                                {!isActive && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        Draft / Hidden
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-2xl">
                                                {item.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500 font-medium pt-1">
                                                <span className="flex items-center gap-1.5">
                                                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                                                    <span>Destination: <strong className="text-slate-700 dark:text-slate-300">{item.country}</strong></span>
                                                </span>
                                                {item.deadline && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Deadline: <strong className="text-slate-700 dark:text-slate-300">{item.deadline}</strong></span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 self-end lg:self-center shrink-0">
                                        {/* Move Up */}
                                        <button
                                            type="button"
                                            disabled={isFirst}
                                            onClick={() => handleMove(originalIndex, -1)}
                                            title="Move Up"
                                            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                                                isFirst ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        >
                                            <MoveUp className="w-4 h-4" />
                                        </button>

                                        {/* Move Down */}
                                        <button
                                            type="button"
                                            disabled={isLast}
                                            onClick={() => handleMove(originalIndex, 1)}
                                            title="Move Down"
                                            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                                                isLast ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                        >
                                            <MoveDown className="w-4 h-4" />
                                        </button>

                                        {/* Toggle Active */}
                                        <button
                                            type="button"
                                            onClick={() => handleToggleActive(originalIndex)}
                                            title={isActive ? 'Hide on Public Site' : 'Publish on Public Site'}
                                            className={`p-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer ${
                                                isActive
                                                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>

                                        {/* Duplicate */}
                                        <button
                                            type="button"
                                            onClick={() => handleDuplicate(originalIndex)}
                                            title="Duplicate Scholarship"
                                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>

                                        {/* Edit */}
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(originalIndex)}
                                            title="Edit Details"
                                            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200/80 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(originalIndex)}
                                            title="Delete Scholarship"
                                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200/80 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL: ADD / EDIT SCHOLARSHIP (RENDERED VIA PORTAL OUTSIDE ANY FORMS) */}
            {isModalOpen && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
                    <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    {editingIndex === null ? 'Add New Scholarship' : 'Edit Scholarship Details'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body (Explicit DIV - NO NESTED FORM TAG) */}
                        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                            
                            {/* Scholarship Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Scholarship Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                                    }}
                                    placeholder="e.g. UK GREAT Scholarship"
                                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                        formErrors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                />
                                {formErrors.name && (
                                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{formErrors.name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Country & Flag Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                                        <span>Destination Country *</span>
                                        {countries && countries.length > 0 && (
                                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium normal-case">
                                                Admin Countries ({countries.length})
                                            </span>
                                        )}
                                    </label>
                                    {countries && countries.length > 0 ? (
                                        <select
                                            value={formData.country}
                                            onChange={(e) => {
                                                const selectedName = e.target.value;
                                                const matched = countries.find(c => c.name === selectedName);
                                                const flagEmoji = matched ? getCountryFlagEmoji(matched.country_code, matched.name) : getCountryFlagEmoji('', selectedName);
                                                setFormData({
                                                    ...formData,
                                                    country: selectedName,
                                                    flag: flagEmoji || formData.flag
                                                });
                                                if (formErrors.country) setFormErrors({ ...formErrors, country: '' });
                                            }}
                                            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer ${
                                                formErrors.country ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                        >
                                            <option value="">-- Select Country --</option>
                                            {countries.map(c => (
                                                <option key={c.id} value={c.name}>
                                                    {c.name} {getCountryFlagEmoji(c.country_code, c.name)}
                                                </option>
                                            ))}
                                            {/* Preserve custom or legacy values like UK / USA */}
                                            {formData.country && !countries.some(c => c.name === formData.country) && (
                                                <option value={formData.country}>
                                                    {formData.country} (Custom)
                                                </option>
                                            )}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => {
                                                setFormData({ ...formData, country: e.target.value });
                                                if (formErrors.country) setFormErrors({ ...formErrors, country: '' });
                                            }}
                                            placeholder="e.g. UK, USA, Finland, Canada"
                                            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                                formErrors.country ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                            }`}
                                        />
                                    )}
                                    {formErrors.country && (
                                        <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>{formErrors.country}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Country Flag / Emoji
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.flag}
                                        onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                                        placeholder="e.g. 🇬🇧 or 🇺🇸"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Degree Level & Amount Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Degree Level / Target *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        placeholder="e.g. Postgraduate, Undergraduate, PhD"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Award Amount / Grant *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.amount}
                                        onChange={(e) => {
                                            setFormData({ ...formData, amount: e.target.value });
                                            if (formErrors.amount) setFormErrors({ ...formErrors, amount: '' });
                                        }}
                                        placeholder="e.g. Up to £10,000 or 100% Fully Funded"
                                        className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            formErrors.amount ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                        }`}
                                    />
                                    {formErrors.amount && (
                                        <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>{formErrors.amount}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Deadline & Badge Theme Color */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Application Deadline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        placeholder="e.g. June 2026 or Rolling"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Badge Accent Color
                                    </label>
                                    <select
                                        value={formData.badgeColor}
                                        onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer font-medium"
                                    >
                                        {BADGE_COLOR_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Description & Eligibility Details *
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData({ ...formData, description: e.target.value });
                                        if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
                                    }}
                                    placeholder="Provide comprehensive details about eligibility, university participation, and funding coverage..."
                                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                        formErrors.description ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                />
                                {formErrors.description && (
                                    <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span>{formErrors.description}</span>
                                    </p>
                                )}
                            </div>

                            {/* Status Checkbox */}
                            <div className="pt-2">
                                <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(formData.is_active)}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                    />
                                    <div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                                            Active / Published on Public Website
                                        </span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                                            When checked, this scholarship appears immediately in the public directory and search filters.
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <div className="flex items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => handleSaveScholarship(false)}
                                        className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all cursor-pointer"
                                    >
                                        {editingIndex === null ? 'Add to List' : 'Apply Changes'}
                                    </button>

                                    {onSave && (
                                        <button
                                            type="button"
                                            onClick={() => handleSaveScholarship(true)}
                                            disabled={isSaving}
                                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:scale-[1.01] transition-transform flex items-center gap-2 cursor-pointer"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>
                                                {isSaving
                                                    ? 'Saving...'
                                                    : editingIndex === null
                                                    ? 'Add & Save Page Now'
                                                    : 'Save & Publish Now'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>,
                document.body
            )}

        </div>
    );
}
