import React, { useState, useRef } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Save,
    ArrowLeft,
    Users,
    UploadCloud,
    X,
    Sparkles,
    CheckCircle2,
    Quote,
    Building2,
    Mail,
    Linkedin,
    Briefcase,
    Eye
} from 'lucide-react';

export default function Form({ employee = null }) {
    const isEdit = Boolean(employee);
    const fileInputRef = useRef(null);

    const { data, setData, processing, errors } = useForm({
        name: employee?.name || '',
        role: employee?.role || '',
        department: employee?.department || '',
        quote: employee?.quote || '',
        image: null,
        image_url: employee?.image || '',
        email: employee?.email || '',
        linkedin_url: employee?.linkedin_url || '',
        sort_order: employee?.sort_order ?? 0,
        is_active: employee ? Boolean(employee.is_active) : true,
    });

    const [imagePreview, setImagePreview] = useState(employee?.image || '');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleClearImage = () => {
        setData('image', null);
        setData('image_url', '');
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            router.post(`/admin/employees/${employee.id}`, {
                ...data,
                _method: 'put',
            }, {
                forceFormData: true,
            });
        } else {
            router.post('/admin/employees', data, {
                forceFormData: true,
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit Team Member: ${employee.name}` : 'Add New Team Member'}>
            <Head title={`${isEdit ? 'Edit' : 'Add'} Team Member — Kampus CMS`} />

            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/employees"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{isEdit ? 'UPDATE PROFILE' : 'NEW TEAM MEMBER'}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                {isEdit ? `Edit: ${employee.name}` : 'Add New Team Member'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/employees"
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Team Member')}</span>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: MAIN FORM (8 COLS) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* BASIC INFORMATION CARD */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                        Personal & Role Information
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Core identity and corporate designation for the About page.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Dr. Eleanor Vance, Sarah Jenkins"
                                        className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border ${
                                            errors.name ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                        } text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-rose-500 mt-1.5">{errors.name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                            Role / Designation <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            placeholder="e.g. Head of UK Admissions"
                                            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border ${
                                                errors.role ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                            } text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                            required
                                        />
                                        {errors.role && (
                                            <p className="text-xs text-rose-500 mt-1.5">{errors.role}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                            Department or Location
                                        </label>
                                        <input
                                            type="text"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            placeholder="e.g. London HQ or South Asia Operations"
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SHORT QUOTE CARD */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                        <Quote className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                            Employee Quote
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            A simple, short, inspiring quote reflecting their passion or advice for students.
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-400">
                                    {data.quote.length} / 300 chars
                                </span>
                            </div>

                            <div>
                                <textarea
                                    rows={3}
                                    value={data.quote}
                                    onChange={(e) => setData('quote', e.target.value)}
                                    placeholder="e.g. Guiding ambitious students to unlock their true potential at world-class British institutions."
                                    className={`w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border ${
                                        errors.quote ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                                    } text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none italic`}
                                />
                                {errors.quote && (
                                    <p className="text-xs text-rose-500 mt-1.5">{errors.quote}</p>
                                )}
                                <span className="text-[11px] text-slate-500 mt-1 block">
                                    Keep quotes between 1-2 sentences for maximum visual impact on the team grid.
                                </span>
                            </div>
                        </div>

                        {/* PHOTO UPLOAD CARD */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                        Profile Image
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Upload a clear headshot or enter a direct image URL (PNG, JPG, WebP).
                                    </p>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-center gap-5">
                                    {/* Preview Box */}
                                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs group">
                                        {imagePreview ? (
                                            <>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleClearImage}
                                                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                                                    title="Remove Image"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        ) : (
                                            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                        )}
                                    </div>

                                    {/* File Picker & Alternative URL */}
                                    <div className="flex-1 space-y-3 w-full">
                                        <div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="employee-image-input"
                                            />
                                            <label
                                                htmlFor="employee-image-input"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
                                            >
                                                <UploadCloud className="w-4 h-4 text-blue-500" />
                                                <span>Choose Photo from Computer</span>
                                            </label>
                                            <span className="text-[11px] text-slate-500 ml-2">Max 5MB (Square or portrait ratio recommended)</span>
                                        </div>

                                        <div className="pt-2">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                Or Paste Image URL Directly:
                                            </label>
                                            <input
                                                type="text"
                                                value={data.image_url}
                                                onChange={(e) => {
                                                    setData('image_url', e.target.value);
                                                    if (!data.image) setImagePreview(e.target.value);
                                                }}
                                                placeholder="https://images.unsplash.com/photo-..."
                                                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errors.image && (
                                    <p className="text-xs text-rose-500">{errors.image}</p>
                                )}
                            </div>
                        </div>

                        {/* CONTACT & SOCIAL DETAILS */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                                Contact & Social Links (Optional)
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="advisor@kampusedu.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                        LinkedIn Profile URL
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={data.linkedin_url}
                                            onChange={(e) => setData('linkedin_url', e.target.value)}
                                            placeholder="https://linkedin.com/in/username"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    {errors.linkedin_url && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.linkedin_url}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: PUBLISHING CONTROLS & LIVE CARD PREVIEW (4 COLS) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* PUBLISH & STATUS CARD */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                                Visibility & Ordering
                            </h3>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                                <div>
                                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">Active on About Page</div>
                                    <div className="text-[11px] text-slate-500">Show in public team grid</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <span className="text-[11px] text-slate-500 mt-1 block">
                                    Lower numbers appear first (e.g. 1, 2, 3).
                                </span>
                            </div>

                            {/* Save Action */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Team Member')}</span>
                            </button>
                        </div>

                        {/* LIVE CARD PREVIEW */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                <span>Live Card Preview on About Page</span>
                            </div>

                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt={data.name || 'Preview'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-lg">
                                                {data.name ? data.name.charAt(0) : 'E'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                                            {data.name || 'Employee Full Name'}
                                        </div>
                                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                                            {data.role || 'Designation / Role'}
                                        </span>
                                    </div>
                                </div>

                                {data.department && (
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                        <Building2 className="w-3 h-3 text-slate-400" />
                                        <span>{data.department}</span>
                                    </div>
                                )}

                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 relative">
                                    <Quote className="w-3.5 h-3.5 text-blue-500/30 absolute top-2 right-2" />
                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 italic pr-3">
                                        "{data.quote || 'Inspiring, short quote from the employee will appear right here.'}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                    {data.email && (
                                        <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">
                                            <Mail className="w-3 h-3" />
                                        </span>
                                    )}
                                    {data.linkedin_url && (
                                        <span className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">
                                            <Linkedin className="w-3 h-3" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
