import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    Award,
    FileText,
    PlusCircle,
    CheckCircle2,
    Clock,
    XCircle,
    ExternalLink,
    Download,
    Edit3,
    Trash2,
    X,
    User,
    Phone,
    Globe,
    Calendar,
    Sparkles,
    ShieldCheck,
    UploadCloud,
    Check,
    FileCheck
} from 'lucide-react';

export default function StudentPortfolioSection({
    student,
    studentProfile = {},
    certificates = [],
    achievements = []
}) {
    // Modals state
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [isAchieveModalOpen, setIsAchieveModalOpen] = useState(false);
    const [editingAchieve, setEditingAchieve] = useState(null);

    // Profile Form
    const profileForm = useForm({
        phone: studentProfile?.phone || '',
        date_of_birth: studentProfile?.date_of_birth || '',
        gender: studentProfile?.gender || 'Prefer not to say',
        nationality: studentProfile?.nationality || '',
        city: studentProfile?.city || '',
        country: studentProfile?.country || '',
        current_education_level: studentProfile?.current_education_level || "Bachelor's Degree",
        target_destination: studentProfile?.target_destination || 'United Kingdom',
        target_degree_level: studentProfile?.target_degree_level || 'Postgraduate',
        target_intake_year: studentProfile?.target_intake_year || 'September 2026',
        target_subject_area: studentProfile?.target_subject_area || '',
        bio: studentProfile?.bio || '',
        linkedin_url: studentProfile?.linkedin_url || '',
        portfolio_website: studentProfile?.portfolio_website || '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        profileForm.put(route('student.profile.update'), {
            preserveScroll: true,
            onSuccess: () => setIsProfileModalOpen(false),
        });
    };

    // Certificate Form
    const certForm = useForm({
        title: '',
        issuing_organization: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        score: '',
        description: '',
        file: null,
    });

    const handleOpenCertModal = (cert = null) => {
        if (cert) {
            setEditingCert(cert);
            certForm.setData({
                title: cert.title,
                issuing_organization: cert.issuing_organization,
                issue_date: cert.issue_date || '',
                expiry_date: cert.expiry_date || '',
                credential_id: cert.credential_id || '',
                credential_url: cert.credential_url || '',
                score: cert.score || '',
                description: cert.description || '',
                file: null,
            });
        } else {
            setEditingCert(null);
            certForm.reset();
        }
        setIsCertModalOpen(true);
    };

    const handleCertSubmit = (e) => {
        e.preventDefault();
        if (editingCert) {
            certForm.post(route('student.certificates.update', editingCert.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCertModalOpen(false);
                    certForm.reset();
                    setEditingCert(null);
                },
            });
        } else {
            certForm.post(route('student.certificates.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCertModalOpen(false);
                    certForm.reset();
                },
            });
        }
    };

    const handleDeleteCert = (id, title) => {
        if (confirm(`Are you sure you want to remove the certificate "${title}"?`)) {
            router.delete(route('student.certificates.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Achievement Form
    const achieveForm = useForm({
        title: '',
        category: 'Academic',
        issuer_or_organization: '',
        achievement_date: '',
        description: '',
        file: null,
    });

    const handleOpenAchieveModal = (achieve = null) => {
        if (achieve) {
            setEditingAchieve(achieve);
            achieveForm.setData({
                title: achieve.title,
                category: achieve.category || 'Academic',
                issuer_or_organization: achieve.issuer_or_organization || '',
                achievement_date: achieve.achievement_date || '',
                description: achieve.description || '',
                file: null,
            });
        } else {
            setEditingAchieve(null);
            achieveForm.reset();
        }
        setIsAchieveModalOpen(true);
    };

    const handleAchieveSubmit = (e) => {
        e.preventDefault();
        if (editingAchieve) {
            achieveForm.post(route('student.achievements.update', editingAchieve.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAchieveModalOpen(false);
                    achieveForm.reset();
                    setEditingAchieve(null);
                },
            });
        } else {
            achieveForm.post(route('student.achievements.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAchieveModalOpen(false);
                    achieveForm.reset();
                },
            });
        }
    };

    const handleDeleteAchieve = (id, title) => {
        if (confirm(`Are you sure you want to remove the achievement "${title}"?`)) {
            router.delete(route('student.achievements.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            
            {/* 1. PROFILE HEADER CARD */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-md shrink-0">
                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-900 flex items-center justify-center text-2xl font-black text-purple-600 dark:text-purple-400 uppercase">
                                {student.name ? student.name.charAt(0) : 'S'}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {student.name}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold">
                                    Candidate
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                {studentProfile?.current_education_level || 'Prospective Scholar'} • Target Destination: <strong className="text-purple-600 dark:text-purple-400">{studentProfile?.target_destination || 'Global Study'}</strong>
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-4 flex-wrap pt-0.5">
                                {studentProfile?.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-purple-400" />
                                        {studentProfile.phone}
                                    </span>
                                )}
                                {studentProfile?.nationality && (
                                    <span className="flex items-center gap-1">
                                        <Globe className="w-3 h-3 text-purple-400" />
                                        {studentProfile.nationality}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex-1 md:flex-initial px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Academic Profile</span>
                        </button>
                    </div>
                </div>

                {/* Bio statement */}
                {studentProfile?.bio && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        <p className="font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider text-[10px]">Academic Summary & Interests:</p>
                        {studentProfile.bio}
                    </div>
                )}
            </div>

            {/* 2. CERTIFICATES & CREDENTIALS SECTION */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span>Certificates & Official Test Scores</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                {certificates.length}
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Upload academic diplomas, IELTS/TOEFL/GRE scores, language credentials, and professional licenses.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenCertModal()}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Certificate</span>
                    </button>
                </div>

                {certificates.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No certificates uploaded yet</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                            Adding your language scores (e.g. IELTS, TOEFL, Duolingo) and degree certificates speeds up university admissions and scholarship evaluations!
                        </p>
                        <button
                            type="button"
                            onClick={() => handleOpenCertModal()}
                            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Upload Your First Certificate</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificates.map((cert) => {
                            const isVerified = cert.status === 'verified';
                            const isRejected = cert.status === 'rejected';

                            return (
                                <div
                                    key={cert.id}
                                    className={`p-5 rounded-3xl border flex flex-col justify-between transition-all bg-white dark:bg-slate-900 shadow-xs hover:border-purple-300 dark:hover:border-purple-800 ${
                                        isVerified
                                            ? 'border-emerald-200 dark:border-emerald-900/60'
                                            : isRejected
                                            ? 'border-rose-200 dark:border-rose-900/60'
                                            : 'border-slate-200 dark:border-slate-800'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                                                {cert.issuing_organization}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
                                                isVerified
                                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                                                    : isRejected
                                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                                            }`}>
                                                {isVerified ? <CheckCircle2 className="w-3 h-3" /> : isRejected ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                <span>{isVerified ? 'VERIFIED' : isRejected ? 'REJECTED' : 'UNDER REVIEW'}</span>
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                                {cert.title}
                                            </h4>
                                            {cert.score && (
                                                <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black">
                                                    Score: {cert.score}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                                            {cert.issue_date && (
                                                <p className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3 text-purple-400" />
                                                    <span>Issued: {cert.issue_date}</span>
                                                    {cert.expiry_date && <span>• Exp: {cert.expiry_date}</span>}
                                                </p>
                                            )}
                                            {cert.credential_id && (
                                                <p className="font-mono text-[11px] truncate">
                                                    ID: {cert.credential_id}
                                                </p>
                                            )}
                                        </div>

                                        {cert.counselor_remarks && (
                                            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-[11px] text-purple-900 dark:text-purple-200">
                                                <strong>Counselor Note:</strong> {cert.counselor_remarks}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footers */}
                                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5">
                                            {cert.file_path && (
                                                <a
                                                    href={cert.file_path}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-colors shadow-xs"
                                                    title="View Document"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                            {cert.credential_url && (
                                                <a
                                                    href={cert.credential_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-xs"
                                                    title="Verify URL"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenCertModal(cert)}
                                                className="p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                                                title="Edit Details"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCert(cert.id, cert.title)}
                                                className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                                title="Delete Certificate"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. ACHIEVEMENTS & EXTRACURRICULAR HONORS */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span>Achievements, Awards & Extracurriculars</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                {achievements.length}
                            </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Showcase your olympiad medals, leadership positions, research papers, competitions, and community service.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleOpenAchieveModal()}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Achievement</span>
                    </button>
                </div>

                {achievements.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center">
                        <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No achievements recorded yet</h4>
                        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                            Highlighting awards, leadership roles, and extracurricular activities makes your university application stand out to scholarship committees!
                        </p>
                        <button
                            type="button"
                            onClick={() => handleOpenAchieveModal()}
                            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Add Your First Achievement</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achieve) => (
                            <div
                                key={achieve.id}
                                className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs hover:border-purple-300 dark:hover:border-purple-800 transition-all"
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black uppercase">
                                            {achieve.category || 'General Honor'}
                                        </span>
                                        {achieve.achievement_date && (
                                            <span className="text-xs text-slate-400">
                                                {achieve.achievement_date}
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                                        {achieve.title}
                                    </h4>

                                    {achieve.issuer_or_organization && (
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            Presented by: {achieve.issuer_or_organization}
                                        </p>
                                    )}

                                    {achieve.description && (
                                        <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl leading-relaxed">
                                            {achieve.description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    {achieve.file_path ? (
                                        <a
                                            href={achieve.file_path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                                        >
                                            <Download className="w-3 h-3" />
                                            <span>Proof Document</span>
                                        </a>
                                    ) : (
                                        <span className="text-[11px] text-slate-400 italic">No document file</span>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenAchieveModal(achieve)}
                                            className="p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-500 hover:text-purple-600 transition-colors cursor-pointer"
                                            title="Edit Achievement"
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAchieve(achieve.id, achieve.title)}
                                            className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                                            title="Delete Achievement"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. MODAL: EDIT ACADEMIC PROFILE */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setIsProfileModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    Edit Academic Profile
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Keep your educational targets and contact details up-to-date for your counselor.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Phone / WhatsApp Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+44 7123 456789"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Nationality
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. British, Bangladeshi, Nigerian..."
                                        value={profileForm.data.nationality}
                                        onChange={(e) => profileForm.setData('nationality', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Current Education Level
                                    </label>
                                    <select
                                        value={profileForm.data.current_education_level}
                                        onChange={(e) => profileForm.setData('current_education_level', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    >
                                        <option value="High School / A-Levels">High School / A-Levels</option>
                                        <option value="Diploma / Foundation">Diploma / Foundation</option>
                                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                                        <option value="Master's Degree">Master's Degree</option>
                                        <option value="Doctorate / PhD">Doctorate / PhD</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Target Destination Country
                                    </label>
                                    <select
                                        value={profileForm.data.target_destination}
                                        onChange={(e) => profileForm.setData('target_destination', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    >
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="United States">United States</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Multiple / Open">Multiple / Open to suggestions</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Target Degree Level
                                    </label>
                                    <select
                                        value={profileForm.data.target_degree_level}
                                        onChange={(e) => profileForm.setData('target_degree_level', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    >
                                        <option value="Undergraduate">Undergraduate (BSc / BA)</option>
                                        <option value="Postgraduate">Postgraduate (MSc / MA / MBA)</option>
                                        <option value="Doctorate">Doctorate (PhD / DBA)</option>
                                        <option value="Diploma / Pathway">Diploma / Pathway</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Target Intake
                                    </label>
                                    <select
                                        value={profileForm.data.target_intake_year}
                                        onChange={(e) => profileForm.setData('target_intake_year', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    >
                                        <option value="September 2026">September 2026</option>
                                        <option value="January 2027">January 2027</option>
                                        <option value="May 2027">May 2027</option>
                                        <option value="September 2027">September 2027</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Statement of Purpose / Academic Summary
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Write a brief overview of your academic background, career objectives, and study interests..."
                                    value={profileForm.data.bio}
                                    onChange={(e) => profileForm.setData('bio', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm resize-none font-sans"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        LinkedIn Profile URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        value={profileForm.data.linkedin_url}
                                        onChange={(e) => profileForm.setData('linkedin_url', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Portfolio / Personal Website
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://myportfolio.com"
                                        value={profileForm.data.portfolio_website}
                                        onChange={(e) => profileForm.setData('portfolio_website', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                                >
                                    {profileForm.processing ? 'Saving Profile...' : 'Save Profile Details'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 5. MODAL: ADD / EDIT CERTIFICATE */}
            {isCertModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setIsCertModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <FileCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Provide verified documentation of your tests, qualifications, or credentials.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleCertSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Certificate Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. IELTS Academic, PTE Pearson, BSc Computer Science..."
                                    value={certForm.data.title}
                                    onChange={(e) => certForm.setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Issuing Organization <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. British Council, ETS, University..."
                                        value={certForm.data.issuing_organization}
                                        onChange={(e) => certForm.setData('issuing_organization', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Score / Grade / Division
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Band 7.5, CGPA 3.8/4.0, First Class"
                                        value={certForm.data.score}
                                        onChange={(e) => certForm.setData('score', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Issue Date
                                    </label>
                                    <input
                                        type="date"
                                        value={certForm.data.issue_date}
                                        onChange={(e) => certForm.setData('issue_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Expiry Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={certForm.data.expiry_date}
                                        onChange={(e) => certForm.setData('expiry_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Credential ID / TRF No.
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 23GB001234SMIT001A"
                                        value={certForm.data.credential_id}
                                        onChange={(e) => certForm.setData('credential_id', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Online Verification URL
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={certForm.data.credential_url}
                                        onChange={(e) => certForm.setData('credential_url', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            {/* Document File Upload */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Certificate Document / Scan (PDF, JPG, PNG, max 10MB)
                                </label>
                                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/50">
                                    <UploadCloud className="w-8 h-8 mx-auto text-purple-500 mb-1" />
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                        onChange={(e) => certForm.setData('file', e.target.files[0])}
                                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    {editingCert?.file_path && !certForm.data.file && (
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                                            Current document: {editingCert.file_name || 'Document attached'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={certForm.processing}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                                >
                                    {certForm.processing ? 'Uploading Certificate...' : (editingCert ? 'Update Certificate' : 'Save & Upload Certificate')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 6. MODAL: ADD / EDIT ACHIEVEMENT */}
            {isAchieveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setIsAchieveModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    {editingAchieve ? 'Edit Achievement' : 'Add New Achievement'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Highlight honors, extracurricular leadership, publications, and awards.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAchieveSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Achievement Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. 1st Place National Math Olympiad, Student Council President..."
                                    value={achieveForm.data.title}
                                    onChange={(e) => achieveForm.setData('title', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Category
                                    </label>
                                    <select
                                        value={achieveForm.data.category}
                                        onChange={(e) => achieveForm.setData('category', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    >
                                        <option value="Academic">Academic Honor / Dean's List</option>
                                        <option value="Competition">Competition / Olympiad</option>
                                        <option value="Leadership">Leadership & Student Government</option>
                                        <option value="Research">Research & Publications</option>
                                        <option value="Volunteering">Community & Volunteering</option>
                                        <option value="Sports">Sports & Athletics</option>
                                        <option value="Arts">Arts & Cultural</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Presented / Organized By
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Ministry of Education, University..."
                                        value={achieveForm.data.issuer_or_organization}
                                        onChange={(e) => achieveForm.setData('issuer_or_organization', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Date of Achievement
                                </label>
                                <input
                                    type="date"
                                    value={achieveForm.data.achievement_date}
                                    onChange={(e) => achieveForm.setData('achievement_date', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Description & Impact
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain your contribution, the competition scale, or the significance of this award..."
                                    value={achieveForm.data.description}
                                    onChange={(e) => achieveForm.setData('description', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm resize-none font-sans"
                                />
                            </div>

                            {/* Optional Proof Document */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Supporting Document / Photo (Optional)
                                </label>
                                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center bg-slate-50 dark:bg-slate-800/50">
                                    <UploadCloud className="w-8 h-8 mx-auto text-purple-500 mb-1" />
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                        onChange={(e) => achieveForm.setData('file', e.target.files[0])}
                                        className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                    />
                                    {editingAchieve?.file_path && !achieveForm.data.file && (
                                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                                            Current document: {editingAchieve.file_name || 'Document attached'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={achieveForm.processing}
                                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                                >
                                    {achieveForm.processing ? 'Saving Achievement...' : (editingAchieve ? 'Update Achievement' : 'Save Achievement')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
