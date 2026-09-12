import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Award,
    Search,
    User,
    Mail,
    Phone,
    Globe,
    Calendar,
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    ExternalLink,
    Download,
    Eye,
    GraduationCap,
    Sparkles,
    Filter,
    ChevronRight,
    X,
    Building2,
    BookOpen,
    ShieldCheck,
    MessageSquare,
    AlertCircle
} from 'lucide-react';

export default function Index({ students = [], stats = {}, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeModalTab, setActiveModalTab] = useState('certificates');
    const [verifyingCert, setVerifyingCert] = useState(null);
    const [remarks, setRemarks] = useState('');

    const certForm = useForm({
        status: 'verified',
        counselor_remarks: '',
    });

    const achieveForm = useForm({
        status: 'verified',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.students.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetSearch = () => {
        setSearchTerm('');
        router.get(route('admin.students.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleOpenStudentModal = (student) => {
        setSelectedStudent(student);
        setActiveModalTab('certificates');
        setVerifyingCert(null);
    };

    const handleVerifyCertificate = (cert, status) => {
        certForm.setData({
            status: status,
            counselor_remarks: remarks,
        });

        certForm.patch(route('admin.students.certificates.verify', cert.id), {
            preserveScroll: true,
            onSuccess: () => {
                setVerifyingCert(null);
                setRemarks('');
                // Update local state for current student
                if (selectedStudent) {
                    const updatedCerts = (selectedStudent.certificates || []).map(c =>
                        c.id === cert.id ? { ...c, status: status, counselor_remarks: remarks, verified_at: status === 'verified' ? new Date().toISOString() : null } : c
                    );
                    setSelectedStudent({ ...selectedStudent, certificates: updatedCerts });
                }
            },
        });
    };

    const handleVerifyAchievement = (achieve, status) => {
        achieveForm.setData({
            status: status,
        });

        achieveForm.patch(route('admin.students.achievements.verify', achieve.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedStudent) {
                    const updatedAchieves = (selectedStudent.achievements || []).map(a =>
                        a.id === achieve.id ? { ...a, status: status } : a
                    );
                    setSelectedStudent({ ...selectedStudent, achievements: updatedAchieves });
                }
            },
        });
    };

    return (
        <AdminLayout title="Student Profiles & Credentials">
            <Head title="Student Profiles & Credentials — Kampus CMS" />

            <div className="space-y-6">

                {/* 1. HEADER BANNER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>STUDENT TALENT & PORTFOLIO HUB</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Student Profiles & Verified Credentials
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Inspect student profiles, review academic certifications, verify achievements, and access original documentation.
                        </p>
                    </div>
                </div>

                {/* 2. STAT TILES */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Students</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.total_students || 0}</p>
                        <p className="text-[11px] text-slate-400">Registered candidates</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">Certificates</p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{stats.total_certificates || 0}</p>
                        <p className="text-[11px] text-slate-400">Total uploaded</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Verified</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.verified_certificates || 0}</p>
                        <p className="text-[11px] text-slate-400">Audited credentials</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Under Review</p>
                        <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.pending_certificates || 0}</p>
                        <p className="text-[11px] text-slate-400">Requires verification</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
                        <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">Achievements</p>
                        <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{stats.total_achievements || 0}</p>
                        <p className="text-[11px] text-slate-400">Honors & activities</p>
                    </div>
                </div>

                {/* 3. SEARCH & FILTER BAR */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by student name, email, nationality, or target destination..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
                            >
                                Search
                            </button>
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={handleResetSearch}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 4. STUDENTS LIST TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50/75 dark:bg-slate-800/50 text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">Student Profile</th>
                                    <th className="px-6 py-4">Contact & Location</th>
                                    <th className="px-6 py-4">Academic Background</th>
                                    <th className="px-6 py-4">Certificates</th>
                                    <th className="px-6 py-4">Achievements</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500">
                                            <Award className="w-12 h-12 mx-auto mb-3 opacity-30 text-purple-400" />
                                            <p className="font-semibold text-base">No students found matching query</p>
                                            <p className="text-xs mt-1">Try refining your search parameters</p>
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => {
                                        const profile = student.studentProfile || {};
                                        const certs = student.certificates || [];
                                        const achieves = student.achievements || [];
                                        const verifiedCount = certs.filter(c => c.status === 'verified').length;
                                        const pendingCount = certs.filter(c => c.status === 'submitted').length;

                                        return (
                                            <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                                {/* Student Profile */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm shrink-0">
                                                            {student.name ? student.name.charAt(0) : 'S'}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-extrabold text-slate-900 dark:text-white truncate">
                                                                {student.name}
                                                            </div>
                                                            <div className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                                                                <Mail className="w-3 h-3 text-slate-400" />
                                                                <span>{student.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact & Location */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-0.5 text-xs">
                                                        {profile.phone ? (
                                                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                                                                <Phone className="w-3 h-3 text-purple-400" />
                                                                <span>{profile.phone}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400">Phone not added</span>
                                                        )}
                                                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                                            <Globe className="w-3 h-3 text-slate-400" />
                                                            <span>
                                                                {[profile.city, profile.nationality || profile.country].filter(Boolean).join(', ') || 'Global'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Academic Background */}
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                                                            {profile.current_education_level || 'General Student'}
                                                        </span>
                                                        {profile.target_destination && (
                                                            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                                                                <span>Target: {profile.target_destination}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Certificates */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-extrabold flex items-center gap-1">
                                                            <FileText className="w-3.5 h-3.5" />
                                                            <span>{certs.length} Total</span>
                                                        </span>
                                                        {verifiedCount > 0 && (
                                                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                                                                {verifiedCount} Verified
                                                            </span>
                                                        )}
                                                        {pendingCount > 0 && (
                                                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold animate-pulse">
                                                                {pendingCount} New
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Achievements */}
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/60 dark:border-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-extrabold inline-flex items-center gap-1">
                                                        <Award className="w-3.5 h-3.5" />
                                                        <span>{achieves.length} Honors</span>
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleOpenStudentModal(student)}
                                                        className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs transition-colors inline-flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 cursor-pointer shadow-xs"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>View Portfolio</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5. STUDENT PORTFOLIO & CREDENTIALS MODAL / DRAWER */}
                {selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
                            
                            {/* Modal Header */}
                            <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl font-black uppercase text-white shadow-inner">
                                        {selectedStudent.name ? selectedStudent.name.charAt(0) : 'S'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-black text-white">{selectedStudent.name}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/30 text-[11px] font-bold text-purple-200">
                                                Student Portfolio
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Mail className="w-3 h-3 text-purple-300" />
                                                {selectedStudent.email}
                                            </span>
                                            {selectedStudent.studentProfile?.phone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-3 h-3 text-purple-300" />
                                                    {selectedStudent.studentProfile.phone}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Navigation Tabs */}
                            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900">
                                <button
                                    onClick={() => setActiveModalTab('certificates')}
                                    className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                                        activeModalTab === 'certificates'
                                            ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Certificates & Credentials</span>
                                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                        {selectedStudent.certificates?.length || 0}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveModalTab('achievements')}
                                    className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                                        activeModalTab === 'achievements'
                                            ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <Award className="w-4 h-4" />
                                    <span>Achievements & Honors</span>
                                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                        {selectedStudent.achievements?.length || 0}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveModalTab('profile')}
                                    className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer border-b-2 ${
                                        activeModalTab === 'profile'
                                            ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                >
                                    <User className="w-4 h-4" />
                                    <span>Academic Profile Details</span>
                                </button>
                            </div>

                            {/* Modal Body (Scrollable) */}
                            <div className="p-6 overflow-y-auto space-y-6 flex-1">

                                {/* TAB 1: CERTIFICATES */}
                                {activeModalTab === 'certificates' && (
                                    <div className="space-y-4">
                                        {(!selectedStudent.certificates || selectedStudent.certificates.length === 0) ? (
                                            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                                <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                                <p className="font-bold text-slate-600 dark:text-slate-300">No certificates uploaded yet</p>
                                                <p className="text-xs text-slate-400 mt-1">The student has not submitted any certificates or test scores</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedStudent.certificates.map((cert) => {
                                                    const isVerified = cert.status === 'verified';
                                                    const isRejected = cert.status === 'rejected';

                                                    return (
                                                        <div
                                                            key={cert.id}
                                                            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                                                                isVerified
                                                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                                                                    : isRejected
                                                                    ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                                                                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                                                            }`}
                                                        >
                                                            <div className="space-y-3">
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div>
                                                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                                                            {cert.issuing_organization}
                                                                        </span>
                                                                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                                                                            {cert.title}
                                                                        </h4>
                                                                    </div>
                                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 ${
                                                                        isVerified
                                                                            ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                                                                            : isRejected
                                                                            ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                                                                            : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                                                                    }`}>
                                                                        {isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : isRejected ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                                                        <span>{cert.status ? cert.status.toUpperCase() : 'SUBMITTED'}</span>
                                                                    </span>
                                                                </div>

                                                                {/* Details Grid */}
                                                                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60">
                                                                    {cert.score && (
                                                                        <div>
                                                                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Score / Grade</span>
                                                                            <span className="font-extrabold text-purple-700 dark:text-purple-300 text-sm">{cert.score}</span>
                                                                        </div>
                                                                    )}
                                                                    {cert.issue_date && (
                                                                        <div>
                                                                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Issued</span>
                                                                            <span className="font-medium text-slate-700 dark:text-slate-200">{cert.issue_date}</span>
                                                                        </div>
                                                                    )}
                                                                    {cert.expiry_date && (
                                                                        <div>
                                                                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Expires</span>
                                                                            <span className="font-medium text-slate-700 dark:text-slate-200">{cert.expiry_date}</span>
                                                                        </div>
                                                                    )}
                                                                    {cert.credential_id && (
                                                                        <div>
                                                                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Credential ID</span>
                                                                            <span className="font-mono text-slate-700 dark:text-slate-200 truncate block">{cert.credential_id}</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {cert.description && (
                                                                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl">
                                                                        {cert.description}
                                                                    </p>
                                                                )}

                                                                {cert.counselor_remarks && (
                                                                    <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                                                                        <span className="font-bold block text-[10px] uppercase">Counselor Remarks:</span>
                                                                        <span>{cert.counselor_remarks}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Actions & Verification Buttons */}
                                                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    {cert.file_path ? (
                                                                        <a
                                                                            href={cert.file_path}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                                                                        >
                                                                            <Download className="w-3.5 h-3.5" />
                                                                            <span>View File</span>
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-[11px] text-slate-400 italic">No document file</span>
                                                                    )}

                                                                    {cert.credential_url && (
                                                                        <a
                                                                            href={cert.credential_url}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                                                                        >
                                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                                            <span>Verify Link</span>
                                                                        </a>
                                                                    )}
                                                                </div>

                                                                {/* Verification Trigger */}
                                                                <div className="flex items-center gap-1.5">
                                                                    {verifyingCert === cert.id ? (
                                                                        <div className="flex flex-col gap-2 w-full mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Counselor verification note (optional)..."
                                                                                value={remarks}
                                                                                onChange={(e) => setRemarks(e.target.value)}
                                                                                className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                                                            />
                                                                            <div className="flex items-center justify-end gap-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setVerifyingCert(null)}
                                                                                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleVerifyCertificate(cert, 'rejected')}
                                                                                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                                                                                >
                                                                                    Reject
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleVerifyCertificate(cert, 'verified')}
                                                                                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                                                                                >
                                                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                                                    <span>Verify</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setVerifyingCert(cert.id);
                                                                                setRemarks(cert.counselor_remarks || '');
                                                                            }}
                                                                            className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-purple-600 dark:hover:bg-purple-500 text-white dark:text-slate-900 hover:text-white dark:hover:text-white font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                                                                        >
                                                                            <ShieldCheck className="w-3.5 h-3.5" />
                                                                            <span>{isVerified ? 'Change Status' : 'Audit / Verify'}</span>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: ACHIEVEMENTS */}
                                {activeModalTab === 'achievements' && (
                                    <div className="space-y-4">
                                        {(!selectedStudent.achievements || selectedStudent.achievements.length === 0) ? (
                                            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                                <Award className="w-12 h-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                                <p className="font-bold text-slate-600 dark:text-slate-300">No achievements recorded yet</p>
                                                <p className="text-xs text-slate-400 mt-1">The student has not added any honors or extracurricular awards</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {selectedStudent.achievements.map((achieve) => (
                                                    <div
                                                        key={achieve.id}
                                                        className="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-extrabold uppercase">
                                                                    {achieve.category || 'General Honor'}
                                                                </span>
                                                                {achieve.achievement_date && (
                                                                    <span className="text-xs text-slate-400 font-medium">
                                                                        {achieve.achievement_date}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                                                                {achieve.title}
                                                            </h4>
                                                            {achieve.issuer_or_organization && (
                                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                                    Presented by: {achieve.issuer_or_organization}
                                                                </p>
                                                            )}
                                                            {achieve.description && (
                                                                <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl mt-2">
                                                                    {achieve.description}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                                                            {achieve.file_path ? (
                                                                <a
                                                                    href={achieve.file_path}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                    <span>Download Proof</span>
                                                                </a>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-400 italic">No document attached</span>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() => handleVerifyAchievement(achieve, achieve.status === 'verified' ? 'submitted' : 'verified')}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                                                    achieve.status === 'verified'
                                                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                                                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200'
                                                                }`}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span>{achieve.status === 'verified' ? 'Verified' : 'Mark Verified'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 3: ACADEMIC PROFILE */}
                                {activeModalTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Education Level</span>
                                                <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">
                                                    {selectedStudent.studentProfile?.current_education_level || 'Not provided'}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Study Destination</span>
                                                <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">
                                                    {selectedStudent.studentProfile?.target_destination || 'Open to all'}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Degree</span>
                                                <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">
                                                    {selectedStudent.studentProfile?.target_degree_level || 'Not specified'}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nationality</span>
                                                <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">
                                                    {selectedStudent.studentProfile?.nationality || 'Not specified'}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">City / Country</span>
                                                <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">
                                                    {[selectedStudent.studentProfile?.city, selectedStudent.studentProfile?.country].filter(Boolean).join(', ') || 'Not specified'}
                                                </span>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Intake</span>
                                                <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 block">
                                                    {selectedStudent.studentProfile?.target_intake_year || 'Not specified'}
                                                </span>
                                            </div>
                                        </div>

                                        {selectedStudent.studentProfile?.bio && (
                                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                                                <h4 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">
                                                    Statement of Purpose / Bio
                                                </h4>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                                    {selectedStudent.studentProfile.bio}
                                                </p>
                                            </div>
                                        )}

                                        {/* External Links */}
                                        {(selectedStudent.studentProfile?.linkedin_url || selectedStudent.studentProfile?.portfolio_website) && (
                                            <div className="flex items-center gap-3">
                                                {selectedStudent.studentProfile.linkedin_url && (
                                                    <a
                                                        href={selectedStudent.studentProfile.linkedin_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold text-xs inline-flex items-center gap-1.5"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        <span>LinkedIn Profile</span>
                                                    </a>
                                                )}
                                                {selectedStudent.studentProfile.portfolio_website && (
                                                    <a
                                                        href={selectedStudent.studentProfile.portfolio_website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 font-bold text-xs inline-flex items-center gap-1.5"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        <span>Portfolio Website</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={() => setSelectedStudent(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity cursor-pointer"
                                >
                                    Close Portfolio
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
