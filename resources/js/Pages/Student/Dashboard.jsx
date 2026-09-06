import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Layout from '../../Layouts/Layout';
import {
    GraduationCap,
    Clock,
    CheckCircle2,
    AlertCircle,
    FileText,
    Send,
    MessageSquare,
    ExternalLink,
    ChevronRight,
    Building2,
    Calendar,
    User,
    Mail,
    Phone,
    Award,
    Sparkles,
    Search,
    BookOpen,
    Filter,
    ArrowRight,
    MessageSquareQuote,
    X,
    PlusCircle,
    Check,
    HelpCircle
} from 'lucide-react';

export default function Dashboard({
    student,
    applications = [],
    inquiries = [],
    stats = {},
    stages = {},
    universities = [],
}) {
    // Detect URL hash for direct tab navigation
    const [activeTab, setActiveTab] = useState('applications');
    const [selectedInquiryModal, setSelectedInquiryModal] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [queryFilter, setQueryFilter] = useState('all');
    const [appSearch, setAppSearch] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'queries' || hash === 'inquiries') {
                setActiveTab('queries');
            } else if (hash === 'applications') {
                setActiveTab('applications');
            }
        }
    }, []);

    // Direct Application Modal Form
    const { data: applyData, setData: setApplyData, post: postApply, processing: applyProcessing, reset: resetApply, errors: applyErrors } = useForm({
        university_name: '',
        course_title: '',
        intake: 'September 2026',
        level: 'Postgraduate',
        phone: '',
        notes: '',
    });

    const handleApplySubmit = (e) => {
        e.preventDefault();
        postApply(route('student.applications.apply'), {
            onSuccess: () => {
                setIsApplyModalOpen(false);
                resetApply();
            },
        });
    };

    // Stage order mapping for visual progress bar
    const stageOrder = [
        { key: 'pending', title: 'Submitted', short: 'Submitted' },
        { key: 'processing', title: 'Document Review', short: 'Review' },
        { key: 'submitted_to_university', title: 'Submitted to Uni', short: 'Lodged' },
        { key: 'offer_issued', title: 'Offer Letter', short: 'Offer' },
        { key: 'visa_processing', title: 'Visa Processing', short: 'Visa' },
        { key: 'accepted', title: 'Admitted & Enrolled', short: 'Enrolled' },
    ];

    const getStageIndex = (statusKey) => {
        const idx = stageOrder.findIndex(s => s.key === statusKey);
        return idx !== -1 ? idx : 0;
    };

    // Filtered Inquiries
    const filteredInquiries = inquiries.filter(item => {
        if (queryFilter === 'replied') return Boolean(item.reply_message);
        if (queryFilter === 'pending') return !item.reply_message;
        return true;
    });

    // Filtered Applications
    const filteredApplications = applications.filter(app => {
        if (!appSearch.trim()) return true;
        const term = appSearch.toLowerCase();
        return (
            (app.course_title || '').toLowerCase().includes(term) ||
            (app.university_name || '').toLowerCase().includes(term) ||
            (app.application_no || '').toLowerCase().includes(term)
        );
    });

    return (
        <Layout>
            <Head title="Student Portal & Dashboard — Kampus" />

            <div className="min-h-screen bg-slate-50 dark:bg-[#0E0C1B] text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* 1. STUDENT WELCOME & STATS BANNER */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B3A] via-[#2A2456] to-[#16132F] text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-purple-900/40">
                        {/* Decorative background glow circles */}
                        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-1/3 -mb-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            
                            {/* Profile Info */}
                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-xl shrink-0">
                                    <div className="w-full h-full rounded-[14px] bg-[#1E1B3A] flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider">
                                        {student.name ? student.name.charAt(0) : 'S'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider">
                                            Student Portal
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            Member since {student.created_at}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                                        Welcome back, {student.name}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-purple-400" />
                                        <span>{student.email}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Apply for University</span>
                                </button>
                                <Link
                                    href="/courses"
                                    className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm border border-white/10 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <BookOpen className="w-4 h-4 text-purple-300" />
                                    <span>Browse Courses</span>
                                </Link>
                            </div>

                        </div>

                        {/* STATS TILES */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-purple-900/40">
                            
                            {/* 1. Total Applications */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-black text-white">{stats.total_applications || 0}</p>
                                    <p className="text-xs text-slate-400 font-medium">Applications</p>
                                </div>
                            </div>

                            {/* 2. Active Applications */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-black text-amber-300">{stats.active_applications || 0}</p>
                                    <p className="text-xs text-slate-400 font-medium">In Progress</p>
                                </div>
                            </div>

                            {/* 3. Inquiries Lodged */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-black text-white">{stats.total_inquiries || 0}</p>
                                    <p className="text-xs text-slate-400 font-medium">Total Queries</p>
                                </div>
                            </div>

                            {/* 4. Replies Received */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center gap-3.5">
                                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300">
                                    <MessageSquareQuote className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-black text-emerald-300">{stats.replied_inquiries || 0}</p>
                                    <p className="text-xs text-slate-400 font-medium">Replies Received</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 2. NAVIGATION TABS */}
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('applications')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'applications'
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Application Status Tracker</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                activeTab === 'applications' ? 'bg-purple-800 text-purple-200' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                {applications.length}
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('queries')}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'queries'
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Query History & Replies</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                activeTab === 'queries' ? 'bg-purple-800 text-purple-200' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                                {inquiries.length}
                            </span>
                        </button>
                    </div>

                    {/* 3. TAB CONTENT: APPLICATION STATUS TRACKER */}
                    {activeTab === 'applications' && (
                        <div className="space-y-6">
                            
                            {/* Search & Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        University Admission Tracker
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                        Monitor the real-time stage of your university applications from initial lodgement to enrollment.
                                    </p>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search applications..."
                                        value={appSearch}
                                        onChange={(e) => setAppSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            {/* Applications List */}
                            {filteredApplications.length === 0 ? (
                                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                                        <GraduationCap className="w-8 h-8" />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-1">
                                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                            No Applications Found
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            You haven't submitted any direct university applications yet. Browse our course catalog or submit an application directly.
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-3 pt-2">
                                        <button
                                            onClick={() => setIsApplyModalOpen(true)}
                                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all cursor-pointer"
                                        >
                                            Submit Direct Application
                                        </button>
                                        <Link
                                            href="/courses"
                                            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition-all"
                                        >
                                            Explore Courses
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {filteredApplications.map((app) => {
                                        const currentStageIdx = getStageIndex(app.status);
                                        const stageInfo = stages[app.status] || {
                                            label: app.status,
                                            description: 'Application is being processed by admissions committee.',
                                            badge_color: 'bg-purple-100 text-purple-800 border-purple-200'
                                        };

                                        return (
                                            <div
                                                key={app.id}
                                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all hover:border-purple-500/50"
                                            >
                                                {/* APPLICATION HEADER */}
                                                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2.5 flex-wrap">
                                                            <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                                                                {app.application_no}
                                                            </span>
                                                            {app.intake && (
                                                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span>{app.intake}</span>
                                                                </span>
                                                            )}
                                                            {app.level && (
                                                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                                    • {app.level}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                                                            {app.course_title}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                                                            <Building2 className="w-4 h-4" />
                                                            <span>{app.university_name}</span>
                                                        </p>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                                                        <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold border flex items-center gap-2 shadow-xs ${stageInfo.badge_color || 'bg-purple-100 text-purple-800'}`}>
                                                            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                                            <span>{stageInfo.label}</span>
                                                        </div>
                                                        <span className="text-[11px] text-slate-400">
                                                            Applied on {new Date(app.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* VISUAL STAGE PROGRESSION BAR */}
                                                <div className="p-6 sm:p-8 bg-white dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="relative">
                                                        
                                                        {/* Progress line background */}
                                                        <div className="hidden sm:block absolute top-5 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />

                                                        {/* Active progress fill */}
                                                        {app.status !== 'rejected' && (
                                                            <div
                                                                className="hidden sm:block absolute top-5 left-4 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 -z-0"
                                                                style={{
                                                                    width: `${(currentStageIdx / (stageOrder.length - 1)) * 100}%`
                                                                }}
                                                            />
                                                        )}

                                                        {/* Stage Nodes */}
                                                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 sm:gap-2 relative z-10">
                                                            {stageOrder.map((stage, idx) => {
                                                                const isCompleted = currentStageIdx > idx && app.status !== 'rejected';
                                                                const isCurrent = currentStageIdx === idx && app.status !== 'rejected';
                                                                const isRejected = app.status === 'rejected';

                                                                return (
                                                                    <div key={stage.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                                                                        
                                                                        {/* Node Icon Circle */}
                                                                        <div
                                                                            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                                                                                isCompleted
                                                                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                                                                                    : isCurrent
                                                                                    ? 'bg-purple-600 text-white ring-4 ring-purple-100 dark:ring-purple-950/80 shadow-lg shadow-purple-600/40 animate-pulse'
                                                                                    : isRejected
                                                                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                                                            }`}
                                                                        >
                                                                            {isCompleted ? (
                                                                                <Check className="w-5 h-5 stroke-[2.5]" />
                                                                            ) : (
                                                                                <span>{idx + 1}</span>
                                                                            )}
                                                                        </div>

                                                                        {/* Node Text */}
                                                                        <div className="space-y-0.5">
                                                                            <p className={`text-xs font-extrabold ${
                                                                                isCurrent
                                                                                    ? 'text-purple-600 dark:text-purple-400'
                                                                                    : isCompleted
                                                                                    ? 'text-slate-900 dark:text-white'
                                                                                    : 'text-slate-400 dark:text-slate-500'
                                                                            }`}>
                                                                                {stage.title}
                                                                            </p>
                                                                            <p className="text-[10px] text-slate-400 hidden sm:block">
                                                                                {isCurrent ? 'Current Stage' : isCompleted ? 'Completed' : 'Upcoming'}
                                                                            </p>
                                                                        </div>

                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                    </div>

                                                    {/* STAGE DESCRIPTION CALLOUT */}
                                                    <div className="mt-6 p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
                                                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                                                        <div className="space-y-0.5">
                                                            <span className="font-bold text-purple-900 dark:text-purple-200">Current Phase: {stageInfo.label}</span>
                                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{stageInfo.description}</p>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* COUNSELOR REMARKS (IF PROVIDED BY ADMIN) */}
                                                {app.counselor_remarks && (
                                                    <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30">
                                                        <div className="flex items-start gap-3.5">
                                                            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 shrink-0">
                                                                <MessageSquareQuote className="w-5 h-5" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                                                                        Counselor Advisory Update
                                                                    </p>
                                                                    {app.status_updated_at && (
                                                                        <span className="text-[11px] text-slate-400">
                                                                            • Updated {new Date(app.status_updated_at).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                                                                    {app.counselor_remarks}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* FOOTER DETAILS & STUDENT NOTES */}
                                                <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                    <div className="flex items-center gap-4 flex-wrap">
                                                        {app.tuition_fee && (
                                                            <span>Tuition: <strong className="text-slate-700 dark:text-slate-200">{app.tuition_fee}</strong></span>
                                                        )}
                                                        {app.notes && (
                                                            <span className="truncate max-w-xs">Your Note: "{app.notes}"</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href="/contact"
                                                            className="text-purple-600 dark:text-purple-400 hover:underline font-bold flex items-center gap-1"
                                                        >
                                                            <span>Contact Assigned Counselor</span>
                                                            <ChevronRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    )}

                    {/* 4. TAB CONTENT: QUERY HISTORY & REPLY TRACKING */}
                    {activeTab === 'queries' && (
                        <div className="space-y-6">
                            
                            {/* Query Filters & Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        Inquiries & Counselor Replies
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                        View every course or university inquiry you have submitted along with the agency counselor's official reply.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <button
                                        onClick={() => setQueryFilter('all')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                                            queryFilter === 'all' ? 'bg-purple-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        All ({inquiries.length})
                                    </button>
                                    <button
                                        onClick={() => setQueryFilter('replied')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                                            queryFilter === 'replied' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        Replied ({stats.replied_inquiries || 0})
                                    </button>
                                    <button
                                        onClick={() => setQueryFilter('pending')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                                            queryFilter === 'pending' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                        }`}
                                    >
                                        Awaiting Response ({stats.pending_replies || 0})
                                    </button>
                                </div>
                            </div>

                            {/* Inquiries List */}
                            {filteredInquiries.length === 0 ? (
                                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                                        <MessageSquare className="w-8 h-8" />
                                    </div>
                                    <div className="max-w-md mx-auto space-y-1">
                                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                            No Inquiries Found
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            You have no inquiries matching the selected filter. Inquire about universities or courses across the site to receive detailed guidance.
                                        </p>
                                    </div>
                                    <div className="flex justify-center gap-3 pt-2">
                                        <Link
                                            href="/courses"
                                            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold transition-all"
                                        >
                                            Find Courses & Inquire
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {filteredInquiries.map((inquiry) => {
                                        const isReplied = Boolean(inquiry.reply_message);

                                        return (
                                            <div
                                                key={inquiry.id}
                                                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 sm:p-7 space-y-5 transition-all hover:border-purple-500/40"
                                            >
                                                {/* INQUIRY TITLE & STATUS BADGE */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-md">
                                                                Query Ref #{inquiry.id}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                • {new Date(inquiry.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                                                            {inquiry.topic || 'General Educational Consultation'}
                                                        </h3>
                                                    </div>

                                                    {/* Reply Status Badge */}
                                                    <div>
                                                        {isReplied ? (
                                                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                                                <span>Replied by Counselor</span>
                                                            </div>
                                                        ) : (
                                                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-extrabold">
                                                                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                                <span>Awaiting Counselor Response</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* STUDENT ORIGINAL QUESTION */}
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5" />
                                                        <span>Your Inquiry Details:</span>
                                                    </p>
                                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                                                        {inquiry.message}
                                                    </div>
                                                </div>

                                                {/* COUNSELOR OFFICIAL REPLY BOX */}
                                                {isReplied ? (
                                                    <div className="space-y-2 pt-2">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                                                <MessageSquareQuote className="w-4 h-4" />
                                                                <span>Official Reply from Kampus Counselor:</span>
                                                            </p>
                                                            {inquiry.replied_at && (
                                                                <span className="text-[11px] text-slate-400">
                                                                    {new Date(inquiry.replied_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-purple-50/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-purple-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs sm:text-sm text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed shadow-xs font-medium">
                                                            {inquiry.reply_message}
                                                            {inquiry.replied_by && (
                                                                <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                                    <span>Signed: <strong>{inquiry.replied_by.name || 'Admissions Counselor'}</strong></span>
                                                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Verified Response</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
                                                        <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                                        <span>
                                                            Your query is queued with our senior counselor desk. You will receive a detailed answer directly here and via email within 24 hours.
                                                        </span>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    )}

                </div>
            </div>

            {/* 5. DIRECT UNIVERSITY APPLICATION MODAL */}
            {isApplyModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                        
                        {/* Close button */}
                        <button
                            onClick={() => setIsApplyModalOpen(false)}
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
                                    Direct University Application
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Apply to top global partner institutions with personalized agency guidance.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleApplySubmit} className="space-y-4">
                            
                            {/* University Name */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Target University <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    list="uni-suggestions"
                                    required
                                    placeholder="e.g. University of Oxford, LMU Munich..."
                                    value={applyData.university_name}
                                    onChange={(e) => setApplyData('university_name', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                                />
                                <datalist id="uni-suggestions">
                                    {universities.map(u => (
                                        <option key={u.id} value={u.name} />
                                    ))}
                                </datalist>
                                {applyErrors.university_name && (
                                    <p className="text-xs text-rose-500">{applyErrors.university_name}</p>
                                )}
                            </div>

                            {/* Course / Program Title */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Course / Degree Program <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. MSc Data Science & AI, Bachelor of Business..."
                                    value={applyData.course_title}
                                    onChange={(e) => setApplyData('course_title', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                                />
                                {applyErrors.course_title && (
                                    <p className="text-xs text-rose-500">{applyErrors.course_title}</p>
                                )}
                            </div>

                            {/* Target Intake & Level of Study */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Target Intake
                                    </label>
                                    <select
                                        value={applyData.intake}
                                        onChange={(e) => setApplyData('intake', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="September 2026">September 2026</option>
                                        <option value="January 2027">January 2027</option>
                                        <option value="May 2027">May 2027</option>
                                        <option value="September 2027">September 2027</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Study Level
                                    </label>
                                    <select
                                        value={applyData.level}
                                        onChange={(e) => setApplyData('level', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="Postgraduate">Postgraduate (Master's)</option>
                                        <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                                        <option value="PhD / Doctorate">PhD / Doctorate</option>
                                        <option value="Foundation">Foundation / Pathway</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact Phone Number */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Phone / WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+880 1812345678"
                                    value={applyData.phone}
                                    onChange={(e) => setApplyData('phone', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Applicant Notes */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Academic Background & Special Notes
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Provide your GPA, English proficiency score (IELTS/TOEFL), or questions..."
                                    value={applyData.notes}
                                    onChange={(e) => setApplyData('notes', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={applyProcessing}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{applyProcessing ? 'Submitting Application...' : 'Confirm & Submit Application'}</span>
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </Layout>
    );
}
