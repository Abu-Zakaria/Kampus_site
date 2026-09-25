import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Layers,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    ArrowUpDown,
    Filter,
    GraduationCap,
    Award,
    FileSpreadsheet,
    Compass,
    Plane,
    BookOpenCheck,
    Eye,
    ListOrdered
} from 'lucide-react';

const ICON_MAP = {
    GraduationCap,
    Award,
    FileSpreadsheet,
    Compass,
    Plane,
    BookOpenCheck,
    Sparkles,
    Layers
};

export default function Index({ services = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filteredServices = services.filter(s => {
        const matchesSearch =
            s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.badge || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Active' && s.is_active) ||
            (statusFilter === 'Inactive' && !s.is_active);
        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete the service: "${title}"? This action cannot be undone.`)) {
            router.delete(`/admin/services/${id}`);
        }
    };

    const handleToggleStatus = (id) => {
        router.patch(`/admin/services/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Services Management">
            <Head title="Services Management —  RMS CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER & CREATE ACTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>SERVICES & CONSULTANCY</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Student Services Directory
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage all counseling and guidance services displayed on the public Services page.
                        </p>
                    </div>

                    <Link
                        href="/admin/services/create"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Service</span>
                    </Link>
                </div>

                {/* SEARCH & FILTER BAR */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title, badge, or description..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>

                    <div className="flex items-center gap-2">
                        {['All', 'Active', 'Inactive'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${statusFilter === status
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* SERVICES DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-6">Service</th>
                                    <th className="py-4 px-6">Badge / Category</th>
                                    <th className="py-4 px-6">Key Highlights</th>
                                    <th className="py-4 px-6">Order</th>
                                    <th className="py-4 px-6 text-center">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredServices.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                                            No services found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredServices.map((service) => {
                                        const IconComponent = ICON_MAP[service.icon] || Layers;
                                        const bullets = Array.isArray(service.bullets) ? service.bullets : [];

                                        return (
                                            <tr key={service.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">

                                                {/* Title & Cover Image */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-200 dark:border-slate-700">
                                                            {service.image ? (
                                                                <img
                                                                    src={service.image}
                                                                    alt={service.title}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-blue-500">
                                                                    <IconComponent className="w-5 h-5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col max-w-sm">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                                    #{service.number || String(service.id).padStart(2, '0')}
                                                                </span>
                                                                <span className="font-bold text-slate-900 dark:text-white text-sm">
                                                                    {service.title}
                                                                </span>
                                                            </div>
                                                            <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5">
                                                                {service.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Badge */}
                                                <td className="py-4 px-6">
                                                    {service.badge ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-[11px] border border-blue-200/60 dark:border-blue-800">
                                                            <IconComponent className="w-3 h-3" />
                                                            <span>{service.badge}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">—</span>
                                                    )}
                                                </td>

                                                {/* Bullets Count */}
                                                <td className="py-4 px-6 text-slate-600 dark:text-slate-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="font-semibold">{bullets.length} Highlights</span>
                                                    </div>
                                                </td>

                                                {/* Sort Order */}
                                                <td className="py-4 px-6 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {service.sort_order}
                                                </td>

                                                {/* Active Status */}
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(service.id)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${service.is_active
                                                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                                            }`}
                                                    >
                                                        {service.is_active ? (
                                                            <>
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span>Active</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="w-3.5 h-3.5" />
                                                                <span>Hidden</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/services/${service.id}/edit`}
                                                            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                                                            title="Edit Service"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(service.id, service.title)}
                                                            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                                            title="Delete Service"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
