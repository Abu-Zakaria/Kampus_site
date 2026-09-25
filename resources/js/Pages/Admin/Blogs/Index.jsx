import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Newspaper,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    Image,
    Filter,
    Tag,
    Star
} from 'lucide-react';

export default function Index({ blogs = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredBlogs = blogs.filter(b => {
        const matchesSearch =
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Published' && b.is_published) ||
            (statusFilter === 'Draft' && !b.is_published);
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            router.delete(`/admin/blog/${id}`);
        }
    };

    const handleToggleFeatured = (id) => {
        router.patch(`/admin/blogs/${id}/toggle-featured`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Blog Posts Management">
            <Head title="Blog Posts —  RMS CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER & CREATE BUTTON */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>BLOG CONTENT & SUCCESS STORIES</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Blog Posts & Success Stories
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Publish study abroad guides, student success stories, and toggle "Home Featured" to display them on the homepage carousel.
                        </p>
                    </div>

                    <Link
                        href="/admin/blog/create"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Post</span>
                    </Link>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title or category..."
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                    </div>

                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs appearance-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                        <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                </div>

                {/* BLOG POSTS DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">Post Title</th>
                                    <th className="py-4 px-6 font-extrabold">Category</th>
                                    <th className="py-4 px-6 font-extrabold">Status</th>
                                    <th className="py-4 px-6 font-extrabold text-center">Home Featured</th>
                                    <th className="py-4 px-6 font-extrabold">Created</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredBlogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No blog posts found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBlogs.map((blog) => (
                                        <tr key={blog.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">

                                            {/* Title with Thumbnail */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 overflow-hidden shrink-0 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
                                                        {blog.image ? (
                                                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Newspaper className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                                                            {blog.title}
                                                        </span>
                                                        <span className="text-[11px] font-mono text-slate-400">
                                                            /{blog.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center gap-1.5 text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md font-bold border border-indigo-200/60 dark:border-indigo-800">
                                                    <Tag className="w-3 h-3" />
                                                    {blog.category}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">
                                                {blog.is_published ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        Draft
                                                    </span>
                                                )}
                                            </td>

                                            {/* Home Featured Toggle Switch */}
                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeatured(blog.id)}
                                                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${blog.is_featured ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                                                        }`}
                                                    title={blog.is_featured ? 'Featured on Home (Click to remove)' : 'Not featured on Home (Click to feature)'}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${blog.is_featured ? 'translate-x-5' : 'translate-x-0'
                                                            }`}
                                                    />
                                                </button>
                                            </td>

                                            {/* Created Date */}
                                            <td className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <Link
                                                    href={`/admin/blog/${blog.id}/edit`}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(blog.id, blog.title)}
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
