import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    HelpCircle,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    ArrowUpDown,
    Filter,
    MessageSquare
} from 'lucide-react';

export default function Index({ faqs = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredFaqs = faqs.filter(f => {
        const matchesSearch =
            f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (f.answer || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Active' && f.is_active) ||
            (statusFilter === 'Inactive' && !f.is_active);
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id, question) => {
        if (confirm(`Are you sure you want to delete this FAQ: "${question}"?`)) {
            router.delete(`/admin/faqs/${id}`);
        }
    };

    const handleToggleStatus = (id) => {
        router.patch(`/admin/faqs/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="FAQs Management">
            <Head title="FAQs Management —  RMS CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER & CREATE ACTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>HOMEPAGE FAQ ACCORDION</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage questions, answers, and display order shown in the Home page FAQ section.
                        </p>
                    </div>

                    <Link
                        href="/admin/faqs/create"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New FAQ</span>
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
                            placeholder="Search questions or answers..."
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

                {/* FAQS DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    <th className="py-4 px-6 w-20">Order</th>
                                    <th className="py-4 px-6">Question & Answer Preview</th>
                                    <th className="py-4 px-6 w-36 text-center">Status</th>
                                    <th className="py-4 px-6 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                                {filteredFaqs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                                            <HelpCircle className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                            <p className="font-semibold text-sm">No FAQs found matching your query.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFaqs.map((faq) => (
                                        <tr
                                            key={faq.id}
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            {/* Order */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {faq.sort_order}
                                                </span>
                                            </td>

                                            {/* Question & Answer preview */}
                                            <td className="py-4 px-6 space-y-1 max-w-xl">
                                                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                                                    <span>{faq.question}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </td>

                                            {/* Status Toggle Switch */}
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(faq.id)}
                                                    className="inline-flex items-center gap-2 cursor-pointer group focus:outline-none"
                                                    title="Click to toggle Active / Inactive status"
                                                >
                                                    <div
                                                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${faq.is_active
                                                                ? 'bg-emerald-500 justify-end'
                                                                : 'bg-slate-300 dark:bg-slate-700 justify-start'
                                                            }`}
                                                    >
                                                        <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                                                    </div>
                                                    <span className={`text-[11px] font-bold ${faq.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                                                        }`}>
                                                        {faq.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </button>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/faqs/${faq.id}/edit`}
                                                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                                                        title="Edit FAQ"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(faq.id, faq.question)}
                                                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
                                                        title="Delete FAQ"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
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
