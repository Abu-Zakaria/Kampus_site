import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Award,
    Search,
    Trash2,
    CheckCircle2,
    Clock,
    X,
    User,
    Phone,
    Mail,
    Globe,
    GraduationCap,
    Calendar,
    Eye,
    RotateCcw,
    FileText,
    Sparkles,
    Check,
    Send,
    Filter,
    MessageSquare,
    ExternalLink,
    AlertCircle,
    ChevronDown
} from 'lucide-react';

const STATUS_CONFIG = {
    pending: {
        label: 'Pending Review',
        bg: 'bg-amber-100 dark:bg-amber-950/70',
        text: 'text-amber-800 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-700/80',
        dot: 'bg-amber-500'
    },
    reviewed: {
        label: 'Reviewed',
        bg: 'bg-blue-100 dark:bg-blue-950/70',
        text: 'text-blue-800 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700/80',
        dot: 'bg-blue-500'
    },
    contacted: {
        label: 'Contacted',
        bg: 'bg-purple-100 dark:bg-purple-950/70',
        text: 'text-purple-800 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700/80',
        dot: 'bg-purple-500'
    },
    shortlisted: {
        label: 'Shortlisted',
        bg: 'bg-emerald-100 dark:bg-emerald-950/70',
        text: 'text-emerald-800 dark:text-emerald-300',
        border: 'border-emerald-300 dark:border-emerald-700/80',
        dot: 'bg-emerald-500'
    },
    rejected: {
        label: 'Rejected',
        bg: 'bg-rose-100 dark:bg-rose-950/70',
        text: 'text-rose-800 dark:text-rose-300',
        border: 'border-rose-300 dark:border-rose-700/80',
        dot: 'bg-rose-500'
    },
};

function StatusDropdown({ app, onStatusChange, align = 'left' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggle = () => {
        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // If less than 240px below the button, open upward
            setOpenUpward(spaceBelow < 240);
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const cfg = STATUS_CONFIG[app?.status] || STATUS_CONFIG.pending;

    return (
        <div className={`relative inline-block text-left ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={handleToggle}
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border shadow-xs transition-all cursor-pointer ${cfg.bg} ${cfg.text} ${cfg.border} hover:opacity-90 active:scale-95`}
                title="Click to change status"
            >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                <span>{cfg.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${
                        openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
                    } w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100`}
                >
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Update Status
                    </div>
                    {Object.entries(STATUS_CONFIG).map(([key, item]) => {
                        const isCurrent = app?.status === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    onStatusChange(app.id, key);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors text-left cursor-pointer ${
                                    isCurrent
                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.dot}`} />
                                    <span>{item.label}</span>
                                </div>
                                {isCurrent && (
                                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function Index({ applications = [], stats = {}, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const totalCount = stats?.total ?? applications.length;
    const pendingCount = stats?.pending ?? applications.filter(a => a.status === 'pending').length;
    const contactedCount = stats?.contacted ?? applications.filter(a => a.status === 'contacted').length;
    const shortlistedCount = stats?.shortlisted ?? applications.filter(a => a.status === 'shortlisted').length;
    const rejectedCount = stats?.rejected ?? applications.filter(a => a.status === 'rejected').length;

    const filteredApplications = applications.filter(app => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
            !term ||
            (app.full_name || '').toLowerCase().includes(term) ||
            (app.email || '').toLowerCase().includes(term) ||
            (app.phone || '').toLowerCase().includes(term) ||
            (app.application_no || '').toLowerCase().includes(term) ||
            (app.scholarship_name || '').toLowerCase().includes(term) ||
            (app.destination_country || '').toLowerCase().includes(term) ||
            (app.nationality || '').toLowerCase().includes(term);

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (appId, newStatus) => {
        router.patch(`/admin/scholarship-applications/${appId}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedApplication && selectedApplication.id === appId) {
                    setSelectedApplication(prev => ({ ...prev, status: newStatus }));
                }
            }
        });
    };

    const handleSaveAdminNotes = (e) => {
        e.preventDefault();
        if (!selectedApplication) return;
        setIsSavingNotes(true);
        router.patch(`/admin/scholarship-applications/${selectedApplication.id}/status`, {
            status: selectedApplication.status,
            admin_notes: adminNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSavingNotes(false);
                setSelectedApplication(prev => ({ ...prev, admin_notes: adminNotes }));
            },
            onError: () => setIsSavingNotes(false),
        });
    };

    const handleDelete = (app) => {
        if (confirm(`Are you sure you want to delete application "${app.application_no}" from ${app.full_name}?`)) {
            router.delete(`/admin/scholarship-applications/${app.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedApplication && selectedApplication.id === app.id) {
                        setSelectedApplication(null);
                    }
                }
            });
        }
    };

    const openDetailsModal = (app) => {
        setSelectedApplication(app);
        setAdminNotes(app.admin_notes || '');
    };

    return (
        <AdminLayout title="Scholarship Applications">
            <Head title="Scholarship Applications — Admin Panel" />

            <div className="p-6 space-y-6 max-w-7xl mx-auto">
                
                {/* 1. HEADER & SUMMARY METRICS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                            <Award className="w-7 h-7 text-blue-600" />
                            <span>Scholarship Applications</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Review, shortlist, and contact applicants seeking study abroad scholarships
                        </p>
                    </div>

                    <a
                        href="/scholarships"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
                    >
                        <span>View Live Scholarships</span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    </a>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`p-4 rounded-3xl border text-left transition-all ${
                            statusFilter === 'all'
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                    >
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">Total</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{totalCount}</span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`p-4 rounded-3xl border text-left transition-all ${
                            statusFilter === 'pending'
                                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Pending</span>
                            {pendingCount > 0 && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            )}
                        </div>
                        <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{pendingCount}</span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('contacted')}
                        className={`p-4 rounded-3xl border text-left transition-all ${
                            statusFilter === 'contacted'
                                ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                    >
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold block">Contacted</span>
                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block">{contactedCount}</span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('shortlisted')}
                        className={`p-4 rounded-3xl border text-left transition-all ${
                            statusFilter === 'shortlisted'
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                    >
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">Shortlisted</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{shortlistedCount}</span>
                    </button>

                    <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`p-4 rounded-3xl border text-left transition-all ${
                            statusFilter === 'rejected'
                                ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 shadow-xs'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                    >
                        <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold block">Rejected</span>
                        <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{rejectedCount}</span>
                    </button>
                </div>

                {/* 2. SEARCH & FILTER BAR */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search applicant name, email, phone, reference, or scholarship..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs cursor-pointer"
                        >
                            <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Statuses ({totalCount})</option>
                            <option value="pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Pending ({pendingCount})</option>
                            <option value="reviewed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Reviewed</option>
                            <option value="contacted" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Contacted ({contactedCount})</option>
                            <option value="shortlisted" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Shortlisted ({shortlistedCount})</option>
                            <option value="rejected" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Rejected ({rejectedCount})</option>
                        </select>
                    </div>
                </div>

                {/* 3. APPLICATIONS LIST TABLE */}
                {filteredApplications.length === 0 ? (
                    <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                        <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            No scholarship applications found
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try changing your search keywords or resetting the status filter.'
                                : 'When prospective students apply for scholarships from the website, their submissions will appear here.'}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset Filters</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="overflow-x-auto min-h-[380px] pb-32">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="py-3.5 px-5">Ref & Date</th>
                                        <th className="py-3.5 px-5">Applicant</th>
                                        <th className="py-3.5 px-5">Scholarship</th>
                                        <th className="py-3.5 px-5">Academic Info</th>
                                        <th className="py-3.5 px-5">Status</th>
                                        <th className="py-3.5 px-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {filteredApplications.map((app) => {
                                        const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                        return (
                                            <tr
                                                key={app.id}
                                                className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                {/* Ref & Date */}
                                                <td className="py-4 px-5">
                                                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                                                        {app.application_no}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 block mt-0.5">
                                                        {new Date(app.created_at).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </td>

                                                {/* Applicant */}
                                                <td className="py-4 px-5">
                                                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                                                        {app.full_name}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                        <a href={`mailto:${app.email}`} className="hover:text-blue-600 truncate max-w-[200px]">
                                                            {app.email}
                                                        </a>
                                                        <a href={`tel:${app.phone}`} className="hover:text-blue-600">
                                                            {app.phone}
                                                        </a>
                                                        {app.nationality && (
                                                            <span className="text-slate-400">
                                                                📍 {app.nationality}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Scholarship */}
                                                <td className="py-4 px-5">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 block">
                                                        {app.scholarship_name}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                                                        {app.destination_country || 'International'}
                                                    </span>
                                                </td>

                                                {/* Academic Info */}
                                                <td className="py-4 px-5">
                                                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                                                        {app.highest_qualification || 'N/A'}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                                        {app.gpa ? `GPA: ${app.gpa}` : ''}
                                                        {app.desired_intake ? ` • ${app.desired_intake}` : ''}
                                                    </div>
                                                </td>

                                                {/* Status Selector Dropdown */}
                                                <td className="py-4 px-5">
                                                    <StatusDropdown app={app} onStatusChange={handleStatusChange} />
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => openDetailsModal(app)}
                                                            className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
                                                            title="View Application Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(app)}
                                                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                                                            title="Delete Application"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            {/* 4. APPLICATION DETAILS MODAL */}
            {selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
                                        {selectedApplication.application_no}
                                    </span>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[selectedApplication.status]?.bg} ${STATUS_CONFIG[selectedApplication.status]?.text} ${STATUS_CONFIG[selectedApplication.status]?.border}`}>
                                        {STATUS_CONFIG[selectedApplication.status]?.label}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                                    {selectedApplication.full_name}
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
                            
                            {/* Scholarship Targeted */}
                            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                                        Target Scholarship
                                    </span>
                                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                                        {selectedApplication.scholarship_name}
                                    </h4>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        Destination: <strong>{selectedApplication.destination_country || 'International'}</strong>
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[11px] text-slate-400 block">Submitted On</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {new Date(selectedApplication.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Email Address</span>
                                    <a
                                        href={`mailto:${selectedApplication.email}`}
                                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>{selectedApplication.email}</span>
                                    </a>
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Phone / WhatsApp</span>
                                    <a
                                        href={`https://wa.me/${selectedApplication.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                                    >
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{selectedApplication.phone}</span>
                                    </a>
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Current Country / Nationality</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                                        {selectedApplication.nationality || 'Not specified'}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Desired Intake</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                                        {selectedApplication.desired_intake || 'Not specified'}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">Highest Qualification</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                                        {selectedApplication.highest_qualification || 'Not specified'}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[11px] text-slate-400 font-medium block">GPA / Academic Score</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                                        {selectedApplication.gpa || 'Not specified'}
                                    </span>
                                </div>
                            </div>

                            {/* Applicant Statement / Notes */}
                            <div>
                                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Applicant Statement & Notes
                                </h5>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                                    {selectedApplication.notes || 'No statement or notes provided by applicant.'}
                                </div>
                            </div>

                            {/* Counselor / Admin Internal Remarks */}
                            <form onSubmit={handleSaveAdminNotes} className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Counselor Internal Remarks
                                </label>
                                <textarea
                                    rows={3}
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this applicant (e.g. called on WhatsApp, documents requested, eligible for 50% waiver)..."
                                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSavingNotes}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                    >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>{isSavingNotes ? 'Saving...' : 'Save Remarks'}</span>
                                    </button>
                                </div>
                            </form>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 font-medium">Update Status:</span>
                                <StatusDropdown app={selectedApplication} onStatusChange={handleStatusChange} />
                            </div>

                            <button
                                onClick={() => setSelectedApplication(null)}
                                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
