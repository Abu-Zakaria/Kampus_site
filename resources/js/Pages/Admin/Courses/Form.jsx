import React from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Save,
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Clock,
    DollarSign,
    CalendarDays,
    Sparkles,
    Eye,
    EyeOff
} from 'lucide-react';

export default function Form({ course = null, universities = [] }) {
    const isEdit = !!course;

    const { data, setData, processing, errors } = useForm({
        university_id: course?.university_id || '',
        title: course?.title || '',
        slug: course?.slug || '',
        level: course?.level || 'Postgraduate',
        duration: course?.duration || '',
        tuition_fee: course?.tuition_fee || '',
        show_tuition_fee: course ? Boolean(course.show_tuition_fee) : true,
        intake: course?.intake || '',
    });

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setData((prev) => ({
            ...prev,
            title: val,
            slug: isEdit
                ? prev.slug
                : val.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            router.put(`/admin/courses/${course.id}`, data, {
                onSuccess: () => {
                    alert(`Course "${data.title}" updated successfully!`);
                }
            });
        } else {
            router.post('/admin/courses', data, {
                onSuccess: () => {
                    alert(`Course "${data.title}" created successfully!`);
                }
            });
        }
    };

    const levelOptions = ['Undergraduate', 'Postgraduate', 'Foundation', 'PhD'];

    return (
        <AdminLayout title={isEdit ? `Edit Course: ${course.title}` : 'Add New Course'}>
            <Head title={isEdit ? `Edit ${course.title} — Kampus CMS` : 'Add Course — Kampus CMS'} />

            <div className="max-w-4xl mx-auto space-y-8">

                {/* HEADER ROW */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/courses"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Courses</span>
                    </Link>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* SECTION 1: COURSE DETAILS */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Course Information
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Define the course title, affiliated university, and program level
                                </p>
                            </div>
                        </div>

                        {/* University Select */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                University / Institution *
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={data.university_id}
                                    onChange={(e) => setData('university_id', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">— Select a University —</option>
                                    {universities.map((uni) => (
                                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                                    ))}
                                </select>
                                <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            </div>
                            {errors.university_id && <span className="text-xs text-rose-500 font-semibold">{errors.university_id}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Course Title */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g. MSc in Computer Science & AI"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.title && <span className="text-xs text-rose-500 font-semibold">{errors.title}</span>}
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
                                    placeholder="e.g. msc-computer-science-oxford"
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                {errors.slug && <span className="text-xs text-rose-500 font-semibold">{errors.slug}</span>}
                            </div>
                        </div>

                        {/* Study Level */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Study Level *
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={data.level}
                                    onChange={(e) => setData('level', e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                                >
                                    {levelOptions.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                <Sparkles className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                            </div>
                            {errors.level && <span className="text-xs text-rose-500 font-semibold">{errors.level}</span>}
                        </div>
                    </div>

                    {/* SECTION 2: ACADEMIC DETAILS */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <CalendarDays className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Academic & Fee Details
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Specify program duration, annual tuition fee, and intake schedule
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Duration */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Program Duration *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        placeholder="e.g. 1 Year Full-Time"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                </div>
                                {errors.duration && <span className="text-xs text-rose-500 font-semibold">{errors.duration}</span>}
                            </div>

                            {/* Tuition Fee */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Annual Tuition Fee *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={data.tuition_fee}
                                        onChange={(e) => setData('tuition_fee', e.target.value)}
                                        placeholder="e.g. £32,500 / year"
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <DollarSign className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                </div>
                                {errors.tuition_fee && <span className="text-xs text-rose-500 font-semibold">{errors.tuition_fee}</span>}
                            </div>
                        </div>

                        {/* Tuition Fee Visibility Toggle Box */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    {data.show_tuition_fee ? (
                                        <Eye className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <EyeOff className="w-4 h-4 text-slate-400" />
                                    )}
                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        Annual Tuition Fee Display
                                    </span>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                        data.show_tuition_fee
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                    }`}>
                                        {data.show_tuition_fee ? 'Visible Publicly' : 'Hidden Publicly'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {data.show_tuition_fee
                                        ? 'The fee will be displayed on public course cards, course finder search, and enquiry modals.'
                                        : 'The exact fee will be hidden from the website and displayed as "Tuition on Request".'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setData('show_tuition_fee', !data.show_tuition_fee)}
                                className="inline-flex items-center cursor-pointer focus:outline-none shrink-0"
                            >
                                <div
                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                                        data.show_tuition_fee
                                            ? 'bg-emerald-500 justify-end'
                                            : 'bg-slate-300 dark:bg-slate-700 justify-start'
                                    }`}
                                >
                                    <div className="bg-white w-4 h-4 rounded-full shadow-md transition-transform" />
                                </div>
                            </button>
                        </div>

                        {/* Intake */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Intake / Start Date *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={data.intake}
                                    onChange={(e) => setData('intake', e.target.value)}
                                    placeholder="e.g. September 2026"
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <CalendarDays className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                            </div>
                            {errors.intake && <span className="text-xs text-rose-500 font-semibold">{errors.intake}</span>}
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
                            <span>{processing ? 'Saving...' : (isEdit ? 'Update Course' : 'Create Course')}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
