import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import BulkUploadModal from '../../../Components/Admin/BulkUploadModal';
import {
    Building2,
    Plus,
    Search,
    MapPin,
    Edit3,
    Trash2,
    Globe,
    BookOpen,
    Sparkles,
    CheckCircle2,
    Download,
    UploadCloud,
    FileSpreadsheet
} from 'lucide-react';

export default function Index({ universities = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

    const filteredUniversities = universities.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.country?.name && u.country.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            router.delete(`/admin/universities/${id}`);
        }
    };

    return (
        <AdminLayout title="Universities Management">
            <Head title="Universities — Kampus CMS" />

            <div className="space-y-6">
                
                {/* HEADER BANNER & ACTION BUTTONS */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>INSTITUTION REPOSITORY</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Partner Universities Database
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add, edit, or remove partner universities, destination country links, campus locations, cover photos, and feature highlights.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* Download Demo Excel */}
                        <a
                            href="/admin/universities/sample-excel"
                            download="universities_demo_template.xlsx"
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
                            title="Download demo Excel template with field headers and sample data"
                        >
                            <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Demo Excel</span>
                        </a>

                        {/* Bulk Upload Excel */}
                        <button
                            type="button"
                            onClick={() => setIsBulkUploadOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer shadow-xs"
                            title="Upload populated Excel file for bulk creation"
                        >
                            <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Bulk Upload Excel</span>
                        </button>

                        {/* Add Single University */}
                        <Link
                            href="/admin/universities/create"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add University</span>
                        </Link>
                    </div>
                </div>

                {/* SEARCH FILTER BAR */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search university by name, location, or country (e.g. Oxford, Finland, United Kingdom)..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                </div>

                {/* UNIVERSITIES DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">University Name</th>
                                    <th className="py-4 px-6 font-extrabold">Country</th>
                                    <th className="py-4 px-6 font-extrabold">Location</th>
                                    <th className="py-4 px-6 font-extrabold">Features</th>
                                    <th className="py-4 px-6 font-extrabold">Courses</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredUniversities.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No universities found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUniversities.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                            
                                            {/* Name & Logo/Cover preview */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                                                        {u.logo ? (
                                                            <img src={u.logo} alt={u.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Building2 className="w-6 h-6 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-slate-900 dark:text-white text-base">
                                                            {u.name}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-slate-400">
                                                            /{u.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Country */}
                                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-xs font-bold">
                                                <div className="flex items-center gap-1.5">
                                                    <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span>{u.country?.name || 'Unassigned'}</span>
                                                </div>
                                            </td>

                                            {/* Location */}
                                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300 text-xs font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span>{u.location}</span>
                                                </div>
                                            </td>

                                            {/* Features Count */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {u.features && u.features.length > 0 ? (
                                                        u.features.slice(0, 2).map((feat, i) => (
                                                            <span key={i} className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-bold border border-blue-200/60 dark:border-blue-800">
                                                                {feat}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">None</span>
                                                    )}
                                                    {u.features && u.features.length > 2 && (
                                                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-bold">
                                                            +{u.features.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Courses Count */}
                                            <td className="py-4 px-6 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                                    <span>{u.courses_count || 0} Listed</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <a
                                                    href={`/universities/${u.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-bold"
                                                    title="View Public Page"
                                                >
                                                    <Globe className="w-4 h-4 text-blue-500" />
                                                </a>

                                                <Link
                                                    href={`/admin/universities/${u.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(u.id, u.name)}
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

                {/* Bulk Upload Modal */}
                <BulkUploadModal
                    isOpen={isBulkUploadOpen}
                    onClose={() => setIsBulkUploadOpen(false)}
                    title="Bulk Upload Universities"
                    description="Upload an Excel or CSV file to import multiple partner universities with photos and features."
                    sampleDownloadUrl="/admin/universities/sample-excel"
                    uploadUrl="/admin/universities/bulk-upload"
                    entityName="Universities"
                    sampleFileName="universities_demo_template.xlsx"
                />

            </div>
        </AdminLayout>
    );
}
