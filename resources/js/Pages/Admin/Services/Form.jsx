import React, { useRef, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Save,
    ArrowLeft,
    Layers,
    Upload,
    Sparkles,
    Type,
    Tag,
    FileText,
    Image,
    CheckSquare,
    Plus,
    Trash2,
    GraduationCap,
    Award,
    FileSpreadsheet,
    Compass,
    Plane,
    BookOpenCheck,
    ShieldCheck,
    Globe
} from 'lucide-react';

const ICON_OPTIONS = [
    { id: 'GraduationCap', label: 'Graduation Cap (Admissions)', icon: GraduationCap },
    { id: 'Award', label: 'Award (Scholarships)', icon: Award },
    { id: 'FileSpreadsheet', label: 'File Spreadsheet (Financials)', icon: FileSpreadsheet },
    { id: 'Compass', label: 'Compass (Career / Counselling)', icon: Compass },
    { id: 'Plane', label: 'Plane (Visa & Travel)', icon: Plane },
    { id: 'BookOpenCheck', label: 'Book & Check (Test Prep)', icon: BookOpenCheck },
    { id: 'ShieldCheck', label: 'Shield Check (Compliance / Trust)', icon: ShieldCheck },
    { id: 'Sparkles', label: 'Sparkles (General / Premium)', icon: Sparkles },
    { id: 'Globe', label: 'Globe (International / Global)', icon: Globe },
];

const GRADIENT_PRESETS = [
    { id: 'from-blue-600 via-indigo-600 to-slate-900', label: 'Blue Indigo', glow: 'bg-blue-500/20' },
    { id: 'from-amber-600 via-purple-700 to-slate-900', label: 'Amber Purple', glow: 'bg-amber-500/20' },
    { id: 'from-emerald-600 via-teal-700 to-slate-900', label: 'Emerald Teal', glow: 'bg-emerald-500/20' },
    { id: 'from-indigo-600 via-blue-700 to-slate-900', label: 'Indigo Blue', glow: 'bg-indigo-500/20' },
    { id: 'from-purple-600 via-pink-700 to-slate-900', label: 'Purple Pink', glow: 'bg-purple-500/20' },
    { id: 'from-rose-600 via-amber-700 to-slate-900', label: 'Rose Amber', glow: 'bg-rose-500/20' },
];

export default function Form({ service = null, nextNumber = '01', nextOrder = 0 }) {
    const isEdit = !!service;
    const fileInputRef = useRef(null);

    const initialBullets = service?.bullets && Array.isArray(service.bullets) && service.bullets.length > 0
        ? service.bullets
        : ['Profile evaluation & university shortlisting', 'Fast-track processing & direct guidance'];

    const [bullets, setBullets] = useState(initialBullets);

    const { data, setData, post, processing, errors } = useForm({
        number: service?.number || nextNumber,
        title: service?.title || '',
        slug: service?.slug || '',
        badge: service?.badge || 'Admissions',
        icon: service?.icon || 'GraduationCap',
        description: service?.description || '',
        bullets: initialBullets,
        image: service?.image || '',
        image_file: null,
        gradient: service?.gradient || 'from-blue-600 via-indigo-600 to-slate-900',
        glow_color: service?.glow_color || 'bg-blue-500/20',
        sort_order: service ? service.sort_order : nextOrder,
        is_active: service ? Boolean(service.is_active) : true,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const [imagePreview, setImagePreview] = useState(service?.image || '');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddBullet = () => {
        const updated = [...bullets, ''];
        setBullets(updated);
        setData('bullets', updated);
    };

    const handleBulletChange = (index, value) => {
        const updated = [...bullets];
        updated[index] = value;
        setBullets(updated);
        setData('bullets', updated);
    };

    const handleRemoveBullet = (index) => {
        const updated = bullets.filter((_, i) => i !== index);
        setBullets(updated);
        setData('bullets', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(`/admin/services/${service.id}`);
        } else {
            post('/admin/services');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Service' : 'Add New Service'}>
            <Head title={`${isEdit ? 'Edit' : 'Create'} Service —  RMS CMS`} />

            <div className="max-w-4xl mx-auto space-y-6">

                {/* TOP BREADCRUMB / BACK */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/services"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Services List</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">
                            {isEdit ? `Editing #${service.number || service.id}` : 'New Service Entry'}
                        </span>
                    </div>
                </div>

                {/* MAIN FORM CARD */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-8">

                    {/* Header Details */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                            {isEdit ? 'Update Service Details' : 'Add New Student Service'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Configure service highlights, icons, descriptions, and media shown in the zig-zag layout.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                        {/* Step Number (e.g. 01, 02) */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Step Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.number}
                                onChange={(e) => setData('number', e.target.value)}
                                placeholder="01"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.number && <span className="text-xs text-rose-500 font-semibold">{errors.number}</span>}
                        </div>

                        {/* Service Title */}
                        <div className="md:col-span-9">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Service Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. College & University Admission"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.title && <span className="text-xs text-rose-500 font-semibold">{errors.title}</span>}
                        </div>

                        {/* Category / Badge */}
                        <div className="md:col-span-6">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Badge / Category Tag *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.badge}
                                onChange={(e) => setData('badge', e.target.value)}
                                placeholder="e.g. Admissions, Scholarships, Financials..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.badge && <span className="text-xs text-rose-500 font-semibold">{errors.badge}</span>}
                        </div>

                        {/* Icon Picker */}
                        <div className="md:col-span-6">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Feature Icon *
                            </label>
                            <select
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            >
                                {ICON_OPTIONS.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            {errors.icon && <span className="text-xs text-rose-500 font-semibold">{errors.icon}</span>}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-12">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Full Service Description *
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the service, benefits for international students, and key outcomes..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                            />
                            {errors.description && <span className="text-xs text-rose-500 font-semibold">{errors.description}</span>}
                        </div>

                        {/* Bullet Highlights List */}
                        <div className="md:col-span-12 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Key Service Highlights (Bullet Points)
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddBullet}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Highlight</span>
                                </button>
                            </div>

                            <div className="space-y-2.5">
                                {bullets.map((bullet, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                                            {idx + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={bullet}
                                            onChange={(e) => handleBulletChange(idx, e.target.value)}
                                            placeholder={`Highlight #${idx + 1} (e.g. Professional SOP & LOR editing)`}
                                            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {bullets.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveBullet(idx)}
                                                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                title="Remove highlight"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload / URL */}
                        <div className="md:col-span-12 space-y-3">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Feature Image
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                {/* Preview Box */}
                                <div className="sm:col-span-4 h-40 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-700 relative">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 text-xs">
                                            <Image className="w-6 h-6 text-slate-400" />
                                            <span>No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Upload / URL Inputs */}
                                <div className="sm:col-span-8 space-y-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4 text-blue-500" />
                                        <span>Upload Image File</span>
                                    </button>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                                            Or enter image URL:
                                        </label>
                                        <input
                                            type="text"
                                            value={data.image || ''}
                                            onChange={(e) => {
                                                setData('image', e.target.value);
                                                setImagePreview(e.target.value);
                                            }}
                                            placeholder="https://images.unsplash.com/photo-..."
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gradient Preset */}
                        <div className="md:col-span-6">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Color Accent Theme
                            </label>
                            <select
                                value={data.gradient}
                                onChange={(e) => {
                                    const preset = GRADIENT_PRESETS.find(p => p.id === e.target.value);
                                    setData((prev) => ({
                                        ...prev,
                                        gradient: e.target.value,
                                        glow_color: preset ? preset.glow : prev.glow_color
                                    }));
                                }}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            >
                                {GRADIENT_PRESETS.map((preset) => (
                                    <option key={preset.id} value={preset.id}>
                                        {preset.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Visibility Active Switch */}
                        <div className="md:col-span-3 flex items-end">
                            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 w-full cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    Active / Visible
                                </span>
                            </label>
                        </div>

                    </div>

                    {/* Form Submit Footer */}
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                        <Link
                            href="/admin/services"
                            className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : isEdit ? 'Update Service' : 'Create Service'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
