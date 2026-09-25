import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Globe2,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    Filter,
    MapPin,
    Building2
} from 'lucide-react';

export default function Index({ branches = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredBranches = branches.filter(b => {
        const matchesSearch =
            b.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.country_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.cities || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.status_text || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Active' && b.is_active) ||
            (statusFilter === 'Inactive' && !b.is_active);
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id, country) => {
        if (confirm(`Are you sure you want to delete the Global Branch for "${country}"?`)) {
            router.delete(`/admin/branches/${id}`);
        }
    };

    const handleToggleStatus = (id) => {
        router.patch(`/admin/branches/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Global Branches Management">
            <Head title="Global Branches —  RMS CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER & CREATE ACTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>GLOBAL ADVISORY NETWORK</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Global Branch Locations
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage country branches displayed in the website Footer marquee and Contact page directory.
                        </p>
                    </div>

                    <Link
                        href="/admin/branches/create"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Branch</span>
                    </Link>
                </div>

                {/* SEARCH & FILTER CONTROLS */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search country, code, cities..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            {['All', 'Active', 'Inactive'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${statusFilter === status
                                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BRANCHES TABLE CONTAINER */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-extrabold tracking-wider text-[11px]">
                                    <th className="py-4 px-6">Country</th>
                                    <th className="py-4 px-6">Cities / Regional Hubs</th>
                                    <th className="py-4 px-6">Status Text</th>
                                    <th className="py-4 px-4 text-center">Order</th>
                                    <th className="py-4 px-6 text-center">Active</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredBranches.length > 0 ? (
                                    filteredBranches.map((branch) => (
                                        <tr
                                            key={branch.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            {/* Country Code & Name */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-slate-800 dark:text-slate-200 shrink-0">
                                                        {branch.country_code}
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                                                            {branch.country_name}
                                                        </div>
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                                            Code: {branch.country_code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cities & Address */}
                                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                        <span>{branch.cities}</span>
                                                    </div>
                                                    {branch.address && (
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">
                                                            {branch.address}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-2 pt-0.5">
                                                        {branch.map_iframe ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                                                ✓ Map Configured
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">
                                                                Auto Location Map
                                                            </span>
                                                        )}
                                                        {branch.phone && (
                                                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                                                📞 {branch.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Text Badge */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10">
                                                    {branch.status_text}
                                                </span>
                                            </td>

                                            {/* Sort Order */}
                                            <td className="py-4 px-4 text-center">
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs">
                                                    {branch.sort_order}
                                                </span>
                                            </td>

                                            {/* Active Switch Toggle */}
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(branch.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${branch.is_active
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                                            : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                                        }`}
                                                >
                                                    {branch.is_active ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3.5 h-3.5" />
                                                            <span>Inactive</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/branches/${branch.id}/edit`}
                                                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                        title="Edit Branch"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(branch.id, branch.country_name)}
                                                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                        title="Delete Branch"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-500 dark:text-slate-400">
                                            <Globe2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                            <p className="font-semibold">No global branch locations found.</p>
                                            <p className="text-[11px]">Click "Add New Branch" to register a branch office.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
