import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    GraduationCap,
    Search,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Building2,
    Calendar,
    User,
    Mail,
    Phone,
    Filter,
    Edit3,
    X,
    Sparkles,
    Send,
    MessageSquareQuote,
    Check,
    ArrowUpRight
} from 'lucide-react';

export default function Index({
    applications = [],
    stats = {},
    stages = {},
    filters = {}
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [selectedAppModal, setSelectedAppModal] = useState(null);

    // Modal Form for updating status & remarks
    const { data: updateData, setData: setUpdateData, put: putStatus, processing: updateProcessing, reset: resetUpdate } = useForm({
        status: 'pending',
        counselor_remarks: '',
    });

    const handleOpenModal = (app) => {
        setSelectedAppModal(app);
        setUpdateData({
            status: app.status || 'pending',
            counselor_remarks: app.counselor_remarks || '',
        });
    };

    const handleStatusSubmit = (e) => {
        e.preventDefault();
        if (!selectedAppModal) return;

        putStatus(route('admin.student-applications.update-status', selectedAppModal.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedAppModal(null);
                resetUpdate();
            },
        });
    };

    const handleDelete = (id, appNo) => {
        if (confirm(`Are you sure you want to delete application "${appNo}"? This action cannot be undone.`)) {
            router.delete(route('admin.student-applications.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Client-side search & filtering
    const filteredApps = applications.filter((app) => {
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        if (!searchTerm.trim()) return matchesStatus;

        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (app.applicant_name || '').toLowerCase().includes(term) ||
            (app.applicant_email || '').toLowerCase().includes(term) ||
            (app.application_no || '').toLowerCase().includes(term) ||
            (app.university_name || '').toLowerCase().includes(term) ||
            (app.course_title || '').toLowerCase().includes(term);

        return matchesStatus && matchesSearch;
    });

    return (
        <AdminLayout title="Student Applications">
            <Head title="Student Applications — Kampus CMS" />

            <div className="space-y-6">
                
                {/* 1. HEADER BANNER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>ADMISSIONS DESK</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Student University Applications
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Track and advance university admission stages, add counselor notes, and guide applicants through their enrollment journey.
                        </p>
                    </div>
                </div>

                {/* 2. STAT TILES */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total || 0}</p>
                        <p className="text-[11px] text-slate-400">All applications</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Submitted</p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats.pending || 0}</p>
                        <p className="text-[11px] text-slate-400">New & pending review</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Reviewing</p>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.processing || 0}</p>
                        <p className="text-[11px] text-slate-400">Document auditing</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">Lodged</p>
                        <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{stats.submitted || 0}</p>
                        <p className="text-[11px] text-slate-400">At university committee</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Offers</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.offer_issued || 0}</p>
                        <p className="text-[11px] text-slate-400">Offer letters received</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Enrolled</p>
                        <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.accepted || 0}</p>
                        <p className="text-[11px] text-slate-400">Visa & enrolled</p>
                    </div>

                </div>

                {/* 3. FILTERS & SEARCH */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'pending', label: 'Submitted' },
                            { key: 'processing', label: 'Reviewing' },
                            { key: 'submitted_to_university', label: 'At Uni' },
                            { key: 'offer_issued', label: 'Offers' },
                            { key: 'visa_processing', label: 'Visa' },
                            { key: 'accepted', label: 'Enrolled' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFilter(tab.key)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                                    statusFilter === tab.key
                                        ? 'bg-purple-600 text-white shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-80 shrink-0">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by student, ref, university..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                </div>

                {/* 4. APPLICATIONS TABLE / LIST */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    {filteredApps.length === 0 ? (
                        <div className="text-center py-16 px-4 space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                                <GraduationCap className="w-7 h-7" />
                            </div>
                            <p className="text-base font-extrabold text-slate-900 dark:text-white">
                                No Applications Found
                            </p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                No student applications match your current search or status filter.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                        <th className="py-4 px-6">Application Ref & Date</th>
                                        <th className="py-4 px-6">Applicant</th>
                                        <th className="py-4 px-6">University & Course</th>
                                        <th className="py-4 px-6">Intake & Level</th>
                                        <th className="py-4 px-6">Status Stage</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {filteredApps.map((app) => {
                                        const stageInfo = stages[app.status] || {
                                            label: app.status,
                                            badge_color: 'bg-purple-100 text-purple-800'
                                        };

                                        return (
                                            <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                                                
                                                {/* Ref & Date */}
                                                <td className="py-4 px-6">
                                                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800 text-[11px]">
                                                        {app.application_no}
                                                    </span>
                                                    <p className="text-[11px] text-slate-400 mt-1">
                                                        {new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </p>
                                                </td>

                                                {/* Applicant */}
                                                <td className="py-4 px-6">
                                                    <div className="space-y-0.5">
                                                        <p className="font-extrabold text-slate-900 dark:text-white">
                                                            {app.applicant_name}
                                                        </p>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-slate-400" />
                                                            <span>{app.applicant_email}</span>
                                                        </p>
                                                        {app.applicant_phone && (
                                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                                <Phone className="w-3 h-3 text-slate-400" />
                                                                <span>{app.applicant_phone}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* University & Course */}
                                                <td className="py-4 px-6">
                                                    <div className="space-y-0.5 max-w-xs">
                                                        <p className="font-extrabold text-slate-900 dark:text-white truncate">
                                                            {app.course_title}
                                                        </p>
                                                        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 truncate">
                                                            <Building2 className="w-3 h-3 shrink-0" />
                                                            <span>{app.university_name}</span>
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Intake & Level */}
                                                <td className="py-4 px-6">
                                                    <div className="space-y-0.5">
                                                        <p className="font-semibold text-slate-900 dark:text-white">
                                                            {app.intake || 'Not specified'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            {app.level || 'Degree'}
                                                        </p>
                                                    </div>
                                                </td>

                                                {/* Status Stage */}
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border ${stageInfo.badge_color || 'bg-slate-100 text-slate-800'}`}>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                        <span>{stageInfo.label}</span>
                                                    </span>
                                                    {app.counselor_remarks && (
                                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 truncate max-w-xs flex items-center gap-1">
                                                            <MessageSquareQuote className="w-3 h-3 shrink-0" />
                                                            <span>Remarks attached</span>
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(app)}
                                                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                            <span>Stage & Remarks</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(app.id, app.application_no)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
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
                    )}
                </div>

            </div>

            {/* 5. UPDATE STAGE & REMARKS MODAL */}
            {selectedAppModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                        
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedAppModal(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <GraduationCap className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Update Admission Status
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Application Ref: <strong className="text-purple-600 dark:text-purple-400">{selectedAppModal.application_no}</strong> • {selectedAppModal.applicant_name}
                                </p>
                            </div>
                        </div>

                        {/* Program Summary */}
                        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                            <p className="font-extrabold text-slate-900 dark:text-white">
                                {selectedAppModal.course_title}
                            </p>
                            <p className="text-purple-600 dark:text-purple-400 font-semibold">
                                {selectedAppModal.university_name}
                            </p>
                            {selectedAppModal.notes && (
                                <p className="text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                                    Applicant Note: "{selectedAppModal.notes}"
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleStatusSubmit} className="space-y-4">
                            
                            {/* Admission Stage Selector */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Current Admission Stage <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={updateData.status}
                                    onChange={(e) => setUpdateData('status', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="pending">1. Application Submitted (Pending Review)</option>
                                    <option value="processing">2. Document Review & Evaluation</option>
                                    <option value="submitted_to_university">3. Formally Submitted to University Committee</option>
                                    <option value="offer_issued">4. Offer Letter Issued by University</option>
                                    <option value="visa_processing">5. Visa Lodgement & Processing</option>
                                    <option value="accepted">6. Admitted & Enrolled</option>
                                    <option value="rejected">Unsuccessful / Retracted</option>
                                </select>
                            </div>

                            {/* Counselor Remarks / Instructions */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Counselor Remarks & Guidance (Visible to Student)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter status updates, document requests, or advice for the applicant..."
                                    value={updateData.counselor_remarks}
                                    onChange={(e) => setUpdateData('counselor_remarks', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                                />
                                <p className="text-[11px] text-slate-400">
                                    This remark will immediately appear in the student's portal progress card.
                                </p>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={updateProcessing}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>{updateProcessing ? 'Saving Stage...' : 'Save & Update Student Portal'}</span>
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
