import React, { useState } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Save,
    ArrowLeft,
    Building2,
    Upload,
    Plus,
    Trash2,
    MapPin,
    Image,
    Sparkles,
    Globe,
    ExternalLink
} from 'lucide-react';

export default function Form({ university = null, countries = [] }) {
    const isEdit = !!university;

    const initialFeatures = university?.features || [
        'QS World Ranked Top 100',
        'Generous Merit Scholarships',
        'Post-Study Work Visa Support'
    ];

    const [featuresList, setFeaturesList] = useState(initialFeatures);
    const [newFeatureText, setNewFeatureText] = useState('');
    const [coverPreview, setCoverPreview] = useState(university?.cover_image || '');
    const [logoPreview, setLogoPreview] = useState(university?.logo || '');

    const { data, setData, processing, errors } = useForm({
        country_id: university?.country_id || '',
        name: university?.name || '',
        slug: university?.slug || '',
        location: university?.location || '',
        website: university?.website || '',
        description: university?.description || '',
        features: initialFeatures,
        cover_image: null,
        logo: null,
        meta_title: university?.meta_title || '',
        meta_description: university?.meta_description || '',
    });

    const handleNameChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            name: val,
            slug: isEdit ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
    };

    const handleAddFeature = () => {
        if (newFeatureText.trim() === '') return;
        const updated = [...featuresList, newFeatureText.trim()];
        setFeaturesList(updated);
        setData('features', updated);
        setNewFeatureText('');
    };

    const handleRemoveFeature = (index) => {
        const updated = featuresList.filter((_, i) => i !== index);
        setFeaturesList(updated);
        setData('features', updated);
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('cover_image', file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            ...data,
            features: featuresList,
        };

        if (isEdit) {
            payload._method = 'put';
            router.post(`/admin/universities/${university.id}`, payload, {
                onSuccess: () => alert(`University "${data.name}" updated successfully!`)
            });
        } else {
            router.post('/admin/universities', payload, {
                onSuccess: () => alert(`University "${data.name}" created successfully!`)
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit University: ${university.name}` : 'Add New University'}>
            <Head title={isEdit ? `Edit ${university.name} — Kampus CMS` : 'Add University — Kampus CMS'} />

            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* HEADER ROW */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/universities"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Universities</span>
                    </Link>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving...' : (isEdit ? 'Update University' : 'Create University')}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1: BASIC INFORMATION */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    General Details
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Specify university name, unique slug, country destination, and campus location
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    University Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. University of Oxford"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.name && <span className="text-xs text-rose-500 font-semibold">{errors.name}</span>}
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Route Slug *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g. university-of-oxford"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.slug && <span className="text-xs text-rose-500 font-semibold">{errors.slug}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Country Select */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Destination Country
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.country_id}
                                        onChange={(e) => setData('country_id', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="">-- Select Country --</option>
                                        {countries.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                </div>
                                {errors.country_id && <span className="text-xs text-rose-500 font-semibold">{errors.country_id}</span>}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Location / City & Region *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Oxford, United Kingdom"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                </div>
                                {errors.location && <span className="text-xs text-rose-500 font-semibold">{errors.location}</span>}
                            </div>
                        </div>

                        {/* Official University Website URL */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Official Website URL
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    placeholder="https://www.harvard.edu"
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <ExternalLink className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                            {errors.website && <span className="text-xs text-rose-500 font-semibold">{errors.website}</span>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Overview & Description
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe academic reputation, research facilities, and campus history..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* SECTION 2: UNIVERSITY FEATURES HIGHLIGHT LIST */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Feature Highlights & Badges
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Add key selling points (e.g. "QS Rank #1", "No IELTS Option", "100% Scholarship Available")
                                </p>
                            </div>
                        </div>

                        {/* Add Feature Input Bar */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={newFeatureText}
                                onChange={(e) => setNewFeatureText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                                placeholder="Type a feature badge e.g. 'Top 1% Employability Rate'..."
                                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Badge</span>
                            </button>
                        </div>

                        {/* Badges List */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {featuresList.map((feat, idx) => (
                                <div
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800 text-xs font-bold"
                                >
                                    <span>{feat}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(idx)}
                                        className="text-purple-400 hover:text-rose-600 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 3: IMAGE MEDIA UPLOADS */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <Image className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Media Assets (Logo & Cover Image)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Upload institution logo and campus banner image into storage
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            
                            {/* Logo File Upload */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    University Logo
                                </label>
                                
                                {logoPreview && (
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden mb-3 p-2 flex items-center justify-center">
                                        <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <label className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer flex items-center gap-2">
                                        <Upload className="w-4 h-4 text-blue-500" />
                                        <span>Choose Logo File</span>
                                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Cover Image File Upload */}
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Campus Cover Banner
                                </label>

                                {coverPreview && (
                                    <div className="w-full h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden mb-3">
                                        <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <label className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-200 cursor-pointer flex items-center gap-2">
                                        <Upload className="w-4 h-4 text-blue-500" />
                                        <span>Choose Banner File</span>
                                        <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* SECTION 4: SEO (SEARCH ENGINE OPTIMIZATION) */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    SEO (Search Engine Optimization)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Configure custom metadata for search engine rankings and social sharing
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Meta Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Meta Title
                                    <span className="text-slate-400 font-normal ml-2">(falls back to university name if left blank)</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder={data.name || "e.g. University of Oxford — Rankings, Courses & Admissions"}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.meta_title && <span className="text-xs text-rose-500 font-semibold">{errors.meta_title}</span>}
                            </div>

                            {/* Meta Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Meta Description
                                    <span className="text-slate-400 font-normal ml-2">(falls back to description overview if left blank)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    placeholder={data.description || "A targeted summary for search engine snippet results..."}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.meta_description && <span className="text-xs text-rose-500 font-semibold">{errors.meta_description}</span>}
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON AT BOTTOM */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : (isEdit ? 'Update University' : 'Create University')}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
