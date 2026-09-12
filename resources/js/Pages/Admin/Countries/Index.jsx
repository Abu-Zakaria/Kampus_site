import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import BulkUploadModal from '../../../Components/Admin/BulkUploadModal';
import {
    Globe,
    Plus,
    Search,
    Edit3,
    Trash2,
    Building2,
    Sparkles,
    MapPin,
    Download,
    UploadCloud,
    FileSpreadsheet
} from 'lucide-react';

export default function Index({ countries = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"? Universities linked to this country will have their country reset.`)) {
            router.delete(`/admin/countries/${id}`);
        }
    };

    return (
        <AdminLayout title="Countries Management">
            <Head title="Countries — Kampus CMS" />

            <div className="space-y-6">
                
                {/* HEADER BANNER & ACTION BUTTONS */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>DESTINATION HIERARCHY</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Countries & Destinations Repository
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage study abroad destination countries linked to your partner universities and courses.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        {/* Download Demo Excel */}
                        <a
                            href="/admin/countries/sample-excel"
                            download="countries_demo_template.xlsx"
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-xs"
                            title="Download demo Excel template with field headers and sample data"
                        >
                            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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

                        {/* Add Single Country */}
                        <Link
                            href="/admin/countries/create"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Country</span>
                        </Link>
                    </div>
                </div>

                {/* SEARCH FILTER BAR */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search country by name or slug (e.g. United Kingdom, Finland)..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                </div>

                {/* COUNTRIES DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">Country Name</th>
                                    <th className="py-4 px-6 font-extrabold">URL Slug</th>
                                    <th className="py-4 px-6 font-extrabold">Linked Universities</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredCountries.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No countries found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCountries.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                            
                                            {/* Country Name */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200/60 dark:border-blue-800 shrink-0 font-bold">
                                                        <Globe className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-extrabold text-slate-900 dark:text-white text-base">
                                                        {c.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Slug */}
                                            <td className="py-4 px-6">
                                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                                    /{c.slug}
                                                </span>
                                            </td>

                                            {/* Universities Count */}
                                            <td className="py-4 px-6 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="w-4 h-4 text-blue-500" />
                                                    <span>{c.universities_count || 0} Universities</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={`/admin/countries/${c.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(c.id, c.name)}
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
                    title="Bulk Upload Countries"
                    description="Upload an Excel or CSV file to import multiple study destination countries."
                    sampleDownloadUrl="/admin/countries/sample-excel"
                    uploadUrl="/admin/countries/bulk-upload"
                    entityName="Countries"
                    sampleFileName="countries_demo_template.xlsx"
                />

            </div>
        </AdminLayout>
    );
}
