import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    BookOpen,
    Plus,
    Search,
    Edit3,
    Trash2,
    Building2,
    Clock,
    DollarSign,
    Sparkles,
    GraduationCap,
    Filter,
    Eye,
    EyeOff
} from 'lucide-react';

export default function Index({ courses = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');

    const levels = ['All', ...new Set(courses.map(c => c.level).filter(Boolean))];

    const filteredCourses = courses.filter(c => {
        const matchesSearch =
            c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.university?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.level || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === 'All' || c.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            router.delete(`/admin/courses/${id}`);
        }
    };

    const handleToggleFee = (id) => {
        router.patch(`/admin/courses/${id}/toggle-fee`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Courses Management">
            <Head title="Courses — Kampus CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER & CREATE BUTTON */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>COURSE DATABASE</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Degree & Course Listings
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage all undergraduate, postgraduate, and foundation courses linked to partner universities.
                        </p>
                    </div>

                    <Link
                        href="/admin/courses/create"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Course</span>
                    </Link>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by course title, university name..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    </div>

                    <div className="relative">
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs appearance-none cursor-pointer"
                        >
                            {levels.map((level) => (
                                <option key={level} value={level}>{level === 'All' ? 'All Levels' : level}</option>
                            ))}
                        </select>
                        <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                </div>

                {/* COURSES DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">Course Title</th>
                                    <th className="py-4 px-6 font-extrabold">University</th>
                                    <th className="py-4 px-6 font-extrabold">Study Level</th>
                                    <th className="py-4 px-6 font-extrabold">Duration</th>
                                    <th className="py-4 px-6 font-extrabold">Tuition Fee</th>
                                    <th className="py-4 px-6 font-extrabold">Intake</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredCourses.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No courses found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCourses.map((course) => (
                                        <tr key={course.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">

                                            {/* Course Title */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                                                        <GraduationCap className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                                                            {course.title}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-slate-400">
                                                            /{course.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* University Name */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                    <span>{course.university?.name || '—'}</span>
                                                </div>
                                            </td>

                                            {/* Study Level */}
                                            <td className="py-4 px-6">
                                                <span className="text-[10px] bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md font-bold border border-purple-200/60 dark:border-purple-800">
                                                    {course.level}
                                                </span>
                                            </td>

                                            {/* Duration */}
                                            <td className="py-4 px-6 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span>{course.duration}</span>
                                                </div>
                                            </td>

                                            {/* Tuition Fee & Visibility Toggle */}
                                            <td className="py-4 px-6 text-xs">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`font-bold ${course.show_tuition_fee ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>
                                                        {course.tuition_fee}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleFee(course.id)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold w-fit transition-all cursor-pointer ${
                                                            course.show_tuition_fee
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                                        }`}
                                                        title="Click to toggle Show / Hide fee on public website"
                                                    >
                                                        {course.show_tuition_fee ? (
                                                            <>
                                                                <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                                                <span>Visible</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3 h-3 text-slate-400" />
                                                                <span>Hidden</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Intake */}
                                            <td className="py-4 px-6 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {course.intake}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={`/admin/courses/${course.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(course.id, course.title)}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    <span>Delete</span>
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
