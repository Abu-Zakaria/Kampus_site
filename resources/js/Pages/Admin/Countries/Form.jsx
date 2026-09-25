import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import { ArrowLeft, Save, Globe, Sparkles, Image as ImageIcon, Upload } from 'lucide-react';

export default function Form({ country = null }) {
    const isEdit = !!country;
    const [imagePreview, setImagePreview] = useState(country?.image || null);

    const { data, setData, post, processing, errors } = useForm({
        name: country?.name || '',
        slug: country?.slug || '',
        country_code: country?.country_code || '',
        subtitle: country?.subtitle || '',
        image: country?.image || null,
        _method: isEdit ? 'put' : 'post',
    });

    const handleNameChange = (e) => {
        const value = e.target.value;
        setData((prev) => ({
            ...prev,
            name: value,
            slug: !isEdit && !prev.slugIsCustom ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            // Method spoofing using POST with _method: 'put' for Inertia file uploads
            router.post(`/admin/countries/${country.id}`, {
                ...data,
                _method: 'put',
            });
        } else {
            post('/admin/countries');
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit Country: ${country.name}` : 'Create Destination Country'}>
            <Head title={`${isEdit ? 'Edit Country' : 'Create Country'} —  RMS CMS`} />

            <div className="max-w-3xl mx-auto space-y-6">

                {/* HEADER NAV & ACTION */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/countries"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Countries List</span>
                    </Link>
                </div>

                {/* MAIN FORM CARD */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isEdit ? 'UPDATE DESTINATION' : 'NEW DESTINATION'}</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {isEdit ? 'Edit Destination Details' : 'Add New Destination Country'}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure country names, 2-letter codes, subtitles, and high-res background card images.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* COUNTRY NAME & COUNTRY CODE GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2 space-y-2">
                                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Country Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        placeholder="e.g. United Kingdom, Finland, United States"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="country_code" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Country Code (e.g. GB)
                                </label>
                                <input
                                    id="country_code"
                                    type="text"
                                    maxLength={10}
                                    value={data.country_code}
                                    onChange={(e) => setData('country_code', e.target.value.toUpperCase())}
                                    placeholder="GB, US, FI"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.country_code && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.country_code}</p>
                                )}
                            </div>
                        </div>

                        {/* URL SLUG & SUBTITLE GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="slug" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    URL Slug <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-xs">
                                        /
                                    </div>
                                    <input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="e.g. united-kingdom"
                                        required
                                        className="w-full pl-8 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {errors.slug && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.slug}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subtitle" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Card Subtitle
                                </label>
                                <input
                                    id="subtitle"
                                    type="text"
                                    value={data.subtitle}
                                    onChange={(e) => setData('subtitle', e.target.value)}
                                    placeholder="e.g. 150+ Partner Universities"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.subtitle && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.subtitle}</p>
                                )}
                            </div>
                        </div>

                        {/* BACKGROUND IMAGE UPLOAD */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                Background Card Image
                            </label>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {imagePreview ? (
                                    <div className="relative w-32 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <ImageIcon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-32 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 shrink-0">
                                        <Upload className="w-6 h-6 mb-1" />
                                        <span className="text-[10px]">Upload Image</span>
                                    </div>
                                )}

                                <div className="flex-1 w-full space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-100 dark:file:bg-blue-950 file:text-blue-600 dark:file:text-blue-400 hover:file:bg-blue-200 cursor-pointer"
                                    />
                                    <p className="text-[11px] text-slate-400">
                                        Upload a high quality photo or paste an image URL in storage. Recommended aspect ratio 4:3.
                                    </p>
                                </div>
                            </div>
                            {errors.image && (
                                <p className="text-xs font-semibold text-rose-500 pt-1">{errors.image}</p>
                            )}
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                href="/admin/countries"
                                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Saving...' : isEdit ? 'Update Country' : 'Create Country'}</span>
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </AdminLayout>
    );
}
