import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    MessageSquare,
    Send,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    User,
    Mail,
    PlusCircle,
    X,
    Trash2,
    RotateCcw,
    GraduationCap,
    ExternalLink,
    AlertCircle,
    Sparkles,
    Check
} from 'lucide-react';

export default function Index({
    conversations = [],
    activeConversation = null,
    studentApplications = [],
    studentsList = [],
    stats = {},
    filters = {}
}) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [currentFilter, setCurrentFilter] = useState(filters.filter || 'all');
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const messagesContainerRef = useRef(null);
    const textareaRef = useRef(null);

    // Form for replying to the active conversation
    const {
        data: replyData,
        setData: setReplyData,
        post: postReply,
        processing: replyProcessing,
        reset: resetReply,
        errors: replyErrors
    } = useForm({
        message: '',
    });

    // Form for starting a new conversation with a student
    const {
        data: newConvData,
        setData: setNewConvData,
        post: postNewConv,
        processing: newConvProcessing,
        reset: resetNewConv,
        errors: newConvErrors
    } = useForm({
        user_id: '',
        subject: '',
        message: '',
        priority: 'normal',
    });

    // Scroll ONLY the inner chat messages container to the bottom
    const scrollToBottom = (smooth = false) => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom(false);
        }, 50);
        return () => clearTimeout(timer);
    }, [activeConversation?.id, activeConversation?.messages?.length]);

    // Handle filter & search change
    const handleFilterChange = (filterName) => {
        setCurrentFilter(filterName);
        router.get(route('admin.messages.index'), {
            filter: filterName,
            search: searchQuery,
            conversation_id: activeConversation?.id,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.messages.index'), {
            filter: currentFilter,
            search: searchQuery,
            conversation_id: activeConversation?.id,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    // Select a conversation from the list
    const selectConversation = (id) => {
        router.get(route('admin.messages.index'), {
            filter: currentFilter,
            search: searchQuery,
            conversation_id: id,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Submit reply
    const handleReplySubmit = (e) => {
        if (e) e.preventDefault();
        if (!replyData.message.trim() || !activeConversation) return;

        postReply(route('admin.messages.reply', activeConversation.id), {
            preserveScroll: true,
            onSuccess: () => {
                resetReply();
                setTimeout(() => scrollToBottom(true), 100);
            },
        });
    };

    // Handle Ctrl+Enter in reply textarea
    const handleKeyDown = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleReplySubmit(e);
        }
    };

    // Toggle status (open <-> resolved)
    const handleToggleStatus = () => {
        if (!activeConversation) return;
        router.patch(route('admin.messages.toggle-status', activeConversation.id), {}, {
            preserveScroll: true,
        });
    };

    // Delete conversation
    const handleDeleteConversation = () => {
        if (!activeConversation) return;
        if (window.confirm('Are you sure you want to delete this conversation thread? All message history will be permanently deleted.')) {
            router.delete(route('admin.messages.destroy', activeConversation.id));
        }
    };

    // Quick canned responses
    const cannedResponses = [
        {
            title: "Received & Reviewing",
            message: "Thank you for contacting us! We have received your query and our admissions team is evaluating the details.",
        },
        {
            title: "Documents Verified",
            message: "Your academic documents have been successfully verified. We will proceed with your application shortly.",
        },
        {
            title: "Request Transcripts/IELTS",
            message: "Please provide your updated academic transcripts and English proficiency certificate (IELTS/PTE) to continue.",
        },
        {
            title: "Offer Stage Update",
            message: "Great news! Your university application has moved to the offer stage. Please check your student portal for updates.",
        },
        {
            title: "Visa Guidance Checklist",
            message: "We have prepared your visa guidance checklist. Please review your financial documents and contact us if you need help with your visa appointment.",
        },
    ];

    const applyCannedResponse = (text) => {
        setReplyData('message', text);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    // Submit new conversation
    const handleNewConvSubmit = (e) => {
        e.preventDefault();
        postNewConv(route('admin.messages.store'), {
            onSuccess: () => {
                setIsNewModalOpen(false);
                resetNewConv();
            },
        });
    };

    return (
        <AdminLayout title="Student Messages">
            <Head title="Student Messages & Chat — Admin Workstation" />

            <div className="space-y-6">
                
                {/* 1. TOP HEADER & STATS BAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <MessageSquare className="w-7 h-7 text-blue-600" />
                            <span>Student Messages & Chat</span>
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Direct two-way consultation messaging with registered prospective students.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsNewModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>New Message to Student</span>
                        </button>
                    </div>
                </div>

                {/* STATS TILES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{stats.total || 0}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">All Threads</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400">{stats.unread || 0}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unread From Students</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">{stats.open || 0}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active / Open</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.resolved || 0}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resolved Threads</p>
                        </div>
                    </div>
                </div>

                {/* 2. CHAT WORKSTATION (TWO COLUMN CONTAINER) */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[720px]">
                    
                    {/* LEFT SIDEBAR: THREAD LIST */}
                    <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                        
                        {/* Search & Filter Header */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by student, email, topic..."
                                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                            </form>

                            {/* Filter Pills */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('all')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        currentFilter === 'all'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    All ({stats.total || 0})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('unread')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        currentFilter === 'unread'
                                            ? 'bg-rose-600 text-white shadow-xs'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Unread ({stats.unread || 0})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('open')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        currentFilter === 'open'
                                            ? 'bg-amber-600 text-white shadow-xs'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Open ({stats.open || 0})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('resolved')}
                                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                                        currentFilter === 'resolved'
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    Resolved ({stats.resolved || 0})
                                </button>
                            </div>
                        </div>

                        {/* Conversations Scrollable List */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No conversations found</p>
                                    <p className="text-[11px] text-slate-400">Try adjusting your search or filter</p>
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const isSelected = activeConversation?.id === conv.id;
                                    const hasUnread = conv.admin_unread_count > 0;

                                    return (
                                        <div
                                            key={conv.id}
                                            onClick={() => selectConversation(conv.id)}
                                            className={`p-4 transition-all cursor-pointer relative ${
                                                isSelected
                                                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                                                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                
                                                {/* Student Initial Avatar */}
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                                                    {conv.student?.name ? conv.student.name.charAt(0).toUpperCase() : 'S'}
                                                </div>

                                                <div className="flex-1 min-w-0 space-y-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <p className={`text-xs truncate ${hasUnread ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-800 dark:text-slate-200'}`}>
                                                            {conv.student?.name || 'Student'}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 shrink-0">
                                                            {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                                        </span>
                                                    </div>

                                                    <p className={`text-xs truncate ${hasUnread ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {conv.subject}
                                                    </p>

                                                    <p className="text-[11px] text-slate-400 truncate">
                                                        {conv.latest_message ? conv.latest_message.message : 'No messages yet'}
                                                    </p>

                                                    <div className="flex items-center gap-2 pt-1">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                            conv.status === 'open'
                                                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                                                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                                        }`}>
                                                            {conv.status}
                                                        </span>

                                                        {hasUnread && (
                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                                                                {conv.admin_unread_count} new
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                    </div>

                    {/* RIGHT MAIN PANEL: ACTIVE CONVERSATION */}
                    {activeConversation ? (
                        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900">
                            
                            {/* Chat Header */}
                            <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 z-10">
                                
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                                        {activeConversation.student?.name ? activeConversation.student.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                                                {activeConversation.student?.name || 'Student'}
                                            </h2>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                                activeConversation.status === 'open'
                                                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                            }`}>
                                                {activeConversation.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-slate-400" />
                                            <span>{activeConversation.student?.email}</span>
                                            <span>•</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">Topic: {activeConversation.subject}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons (Status Toggle & Delete) */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleToggleStatus}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                                            activeConversation.status === 'open'
                                                ? 'border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                                : 'border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                        }`}
                                    >
                                        {activeConversation.status === 'open' ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Mark as Resolved</span>
                                            </>
                                        ) : (
                                            <>
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                <span>Reopen Thread</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDeleteConversation}
                                        title="Delete Conversation"
                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                            </div>

                            {/* Student Context Banner: Admission Applications if present */}
                            {studentApplications.length > 0 && (
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs overflow-x-auto">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                        <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
                                        <span className="font-bold">Student Application Context:</span>
                                        <span>{studentApplications[0].course_title} at {studentApplications[0].university_name}</span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                            {studentApplications[0].status}
                                        </span>
                                    </div>
                                    <Link
                                        href="/admin/student-applications"
                                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 shrink-0 ml-3"
                                    >
                                        <span>View Applications</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            )}

                            {/* Scrollable Message Timeline */}
                            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-[#0c0a18]">
                                {activeConversation.messages?.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 text-xs">
                                        No messages in this conversation yet. Send the first response below!
                                    </div>
                                ) : (
                                    activeConversation.messages?.map((msg) => {
                                        const isStudent = msg.sender_type === 'student';

                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex items-start gap-3 ${isStudent ? 'justify-start' : 'justify-end'}`}
                                            >
                                                {/* Student avatar on left */}
                                                {isStudent && (
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-1">
                                                        {activeConversation.student?.name ? activeConversation.student.name.charAt(0).toUpperCase() : 'S'}
                                                    </div>
                                                )}

                                                <div className={`max-w-lg lg:max-w-xl space-y-1 ${isStudent ? 'items-start' : 'items-end'}`}>
                                                    
                                                    {/* Sender header name & time */}
                                                    <div className={`flex items-center gap-2 text-[11px] ${isStudent ? 'text-slate-500 dark:text-slate-400' : 'text-blue-600 dark:text-blue-400 justify-end'}`}>
                                                        <span className="font-bold">
                                                            {isStudent ? (activeConversation.student?.name || 'Student') : (msg.sender?.name || 'Kampus Counselor')}
                                                        </span>
                                                        {!isStudent && (
                                                            <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-300">
                                                                Counselor
                                                            </span>
                                                        )}
                                                        <span className="text-[10px] text-slate-400">
                                                            {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    {/* Message bubble */}
                                                    <div
                                                        className={`p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                                                            isStudent
                                                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl rounded-tl-sm border border-slate-200/80 dark:border-slate-700'
                                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-blue-600/20 font-medium'
                                                        }`}
                                                    >
                                                        {msg.message}
                                                    </div>

                                                </div>

                                                {/* Admin avatar on right */}
                                                {!isStudent && (
                                                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-1">
                                                        {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'A'}
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Reply Composer Bar */}
                            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                                
                                {/* Quick Canned Responses Chips */}
                                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                                    <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
                                        <Sparkles className="w-3 h-3 text-purple-500" />
                                        <span>Quick Replies:</span>
                                    </span>
                                    {cannedResponses.map((res, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => applyCannedResponse(res.message)}
                                            title={res.message}
                                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap cursor-pointer font-medium"
                                        >
                                            {res.title}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleReplySubmit} className="space-y-2">
                                    <div className="relative">
                                        <textarea
                                            ref={textareaRef}
                                            rows={3}
                                            value={replyData.message}
                                            onChange={(e) => setReplyData('message', e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={`Type your reply to ${activeConversation.student?.name || 'student'}... (Ctrl + Enter to send)`}
                                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                                        />
                                    </div>

                                    {replyErrors.message && (
                                        <p className="text-xs text-rose-500">{replyErrors.message}</p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] text-slate-400 hidden sm:block">
                                            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border text-[10px] font-mono">Ctrl + Enter</kbd> to quickly send reply
                                        </p>

                                        <button
                                            type="submit"
                                            disabled={replyProcessing || !replyData.message.trim()}
                                            className="ml-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
                                        >
                                            <Send className="w-4 h-4" />
                                            <span>{replyProcessing ? 'Sending...' : 'Send Reply'}</span>
                                        </button>
                                    </div>
                                </form>

                            </div>

                        </div>
                    ) : (
                        /* Empty State when no conversation is selected */
                        <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="max-w-sm text-center space-y-3">
                                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-sm">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                    No Conversation Selected
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Select a student message thread from the left to start replying, or click "New Message to Student" to initiate a new guidance thread.
                                </p>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            {/* 3. NEW CONVERSATION MODAL (ADMIN INITIATES) */}
            {isNewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                        
                        <button
                            type="button"
                            onClick={() => setIsNewModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Initiate Message to Student
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Reach out directly to a prospective student registered on Kampus.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleNewConvSubmit} className="space-y-4">
                            
                            {/* Student Selection */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Select Student <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={newConvData.user_id}
                                    onChange={(e) => setNewConvData('user_id', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                >
                                    <option value="">— Choose a student account —</option>
                                    {studentsList.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name} ({st.email})
                                        </option>
                                    ))}
                                </select>
                                {newConvErrors.user_id && (
                                    <p className="text-xs text-rose-500">{newConvErrors.user_id}</p>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Subject / Discussion Topic <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Admission Application Review, Visa Documents Required..."
                                    value={newConvData.subject}
                                    onChange={(e) => setNewConvData('subject', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                                />
                                {newConvErrors.subject && (
                                    <p className="text-xs text-rose-500">{newConvErrors.subject}</p>
                                )}
                            </div>

                            {/* Message Body */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Initial Message <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Type your message to the student..."
                                    value={newConvData.message}
                                    onChange={(e) => setNewConvData('message', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                                />
                                {newConvErrors.message && (
                                    <p className="text-xs text-rose-500">{newConvErrors.message}</p>
                                )}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={newConvProcessing}
                                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{newConvProcessing ? 'Sending Message...' : 'Send Message to Student'}</span>
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
