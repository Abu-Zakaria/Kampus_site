import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Mail,
    Search,
    Trash2,
    CheckCircle2,
    Circle,
    X,
    MessageSquare,
    User,
    Phone,
    Tag,
    Sparkles,
    Calendar,
    Eye,
    EyeOff,
    Filter,
    MailOpen,
    GraduationCap,
    Inbox,
    Send,
    Clock,
    Check,
    MessageSquareQuote
} from 'lucide-react';

export default function Index({ messages = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTab, setFilterTab] = useState('All');
    const [readFilter, setReadFilter] = useState('All');
    const [messageModal, setMessageModal] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);

    const totalCount = messages.length;
    const unreadCount = messages.filter(m => !m.is_read).length;
    const courseEnquiriesCount = messages.filter(m => (m.topic || '').toLowerCase().includes('course enquiry')).length;
    const callBookingsCount = messages.filter(m => (m.topic || '').toLowerCase().includes('call booking')).length;

    const filteredMessages = messages.filter(m => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            !term ||
            m.name.toLowerCase().includes(term) ||
            m.email.toLowerCase().includes(term) ||
            (m.phone || '').toLowerCase().includes(term) ||
            (m.topic || '').toLowerCase().includes(term) ||
            (m.message || '').toLowerCase().includes(term);

        const topicLower = (m.topic || '').toLowerCase();
        let matchesTab = true;
        if (filterTab === 'Course Enquiries') matchesTab = topicLower.includes('course enquiry');
        else if (filterTab === 'Call Bookings') matchesTab = topicLower.includes('call booking');
        else if (filterTab === 'General') matchesTab = !topicLower.includes('course enquiry') && !topicLower.includes('call booking');
        else if (filterTab === 'Unread') matchesTab = !m.is_read;

        const matchesRead =
            readFilter === 'All' ||
            (readFilter === 'Unread' && !m.is_read) ||
            (readFilter === 'Read' && m.is_read);

        return matchesSearch && matchesTab && matchesRead;
    });

    const handleToggleRead = (id, currentIsRead) => {
        router.put(`/admin/inquiries/${id}`, {
            is_read: !currentIsRead,
        }, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the message from "${name}"? This action cannot be undone.`)) {
            router.delete(`/admin/inquiries/${id}`);
        }
    };

    const handleViewMessage = (msg) => {
        setMessageModal(msg);
        setReplyText(msg.reply_message || '');
        // Auto-mark as read when viewing
        if (!msg.is_read) {
            handleToggleRead(msg.id, false);
        }
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!messageModal || !replyText.trim()) return;
        setIsSendingReply(true);

        router.post(`/admin/inquiries/${messageModal.id}/reply`, {
            reply_message: replyText
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setMessageModal(prev => prev ? { ...prev, reply_message: replyText, replied_at: new Date().toISOString() } : null);
                setIsSendingReply(false);
            },
            onError: () => {
                setIsSendingReply(false);
            }
        });
    };

    return (
        <AdminLayout title="Inquiries & Messages">
            <Head title="Inquiries — Kampus CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>INBOX</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Student Inquiries & Messages
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage direct course applications, student inquiries, and automated call bookings in real time.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-600/30">
                            <MailOpen className="w-4 h-4" />
                            <span>{unreadCount} Unread Inquiries</span>
                        </div>
                    )}
                </div>

                {/* 4 TOP METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                            <Inbox className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Inquiries</div>
                        </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{courseEnquiriesCount}</div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Course Applications</div>
                        </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-900/50">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{callBookingsCount}</div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Call Bookings</div>
                        </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/50">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{unreadCount}</div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Needs Response</div>
                        </div>
                    </div>
                </div>

                {/* FILTER TABS & SEARCH */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto">
                        {[
                            { id: 'All', label: 'All Inquiries', count: totalCount },
                            { id: 'Course Enquiries', label: 'Course Enquiries', count: courseEnquiriesCount },
                            { id: 'Call Bookings', label: 'Call Bookings', count: callBookingsCount },
                            { id: 'Unread', label: 'Unread', count: unreadCount },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                                    filterTab === tab.id
                                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>{tab.label}</span>
                                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                    filterTab === tab.id
                                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search & Read Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 md:w-64">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search applicant, email, topic..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        </div>

                        <div className="relative">
                            <select
                                value={readFilter}
                                onChange={(e) => setReadFilter(e.target.value)}
                                className="pl-9 pr-8 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs appearance-none cursor-pointer font-bold"
                            >
                                <option value="All">All Status</option>
                                <option value="Unread">Unread Only</option>
                                <option value="Read">Read Only</option>
                            </select>
                            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* MESSAGES TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">Name</th>
                                    <th className="py-4 px-6 font-extrabold">Email</th>
                                    <th className="py-4 px-6 font-extrabold">Topic</th>
                                    <th className="py-4 px-6 font-extrabold">Date</th>
                                    <th className="py-4 px-6 font-extrabold">Status</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No messages found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <tr
                                            key={msg.id}
                                            className={`transition-colors ${
                                                !msg.is_read
                                                    ? 'bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                                                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                                            }`}
                                        >
                                            {/* Name */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    {!msg.is_read && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-pulse" />
                                                    )}
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                                        !msg.is_read
                                                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                    }`}>
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <span className={`text-sm ${!msg.is_read ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                                                        {msg.name}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-4 px-6 text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {msg.email}
                                            </td>

                                            {/* Topic */}
                                            <td className="py-4 px-6">
                                                {msg.topic ? (
                                                    msg.topic.toLowerCase().includes('course enquiry') ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[11px] bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg font-bold border border-blue-200/80 dark:border-blue-800">
                                                            <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                                                            <span className="truncate max-w-[200px]">{msg.topic}</span>
                                                        </span>
                                                    ) : msg.topic.toLowerCase().includes('call booking') ? (
                                                        <span className="inline-flex items-center gap-1.5 text-[11px] bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg font-bold border border-purple-200/80 dark:border-purple-800">
                                                            <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                                            <span className="truncate max-w-[200px]">{msg.topic}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-[11px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md font-bold border border-indigo-200/60 dark:border-indigo-800">
                                                            <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                                            <span className="truncate max-w-[200px]">{msg.topic}</span>
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">—</span>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="py-4 px-6 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span>
                                                        {msg.created_at
                                                            ? new Date(msg.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                            : '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6 space-y-1">
                                                <div>
                                                    {msg.is_read ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Read
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                                            <Circle className="w-3 h-3" />
                                                            Unread
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    {msg.reply_message ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                                            <Check className="w-3 h-3" />
                                                            Replied
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                                            <Clock className="w-3 h-3" />
                                                            Pending Reply
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    onClick={() => handleViewMessage(msg)}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                                                    title="View Message"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View</span>
                                                </button>

                                                <button
                                                    onClick={() => handleToggleRead(msg.id, msg.is_read)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                                                        msg.is_read
                                                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                                                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                                                    }`}
                                                    title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                                                >
                                                    {msg.is_read ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                                    <span>{msg.is_read ? 'Unread' : 'Read'}</span>
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(msg.id, msg.name)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* VIEW & REPLY MESSAGE MODAL */}
            {messageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setMessageModal(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3.5 mb-6">
                            <div className={`p-3 rounded-2xl ${
                                (messageModal.topic || '').toLowerCase().includes('course enquiry')
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                                    : (messageModal.topic || '').toLowerCase().includes('call booking')
                                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                {(messageModal.topic || '').toLowerCase().includes('course enquiry') ? (
                                    <GraduationCap className="w-6 h-6" />
                                ) : (messageModal.topic || '').toLowerCase().includes('call booking') ? (
                                    <Phone className="w-6 h-6" />
                                ) : (
                                    <Mail className="w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                    (messageModal.topic || '').toLowerCase().includes('course enquiry')
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : (messageModal.topic || '').toLowerCase().includes('call booking')
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-emerald-600 dark:text-emerald-400'
                                }`}>
                                    {(messageModal.topic || '').toLowerCase().includes('course enquiry')
                                        ? 'Course Direct Application'
                                        : (messageModal.topic || '').toLowerCase().includes('call booking')
                                        ? 'Automated Call Booking'
                                        : 'General Inquiry'}
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    {messageModal.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {messageModal.topic || 'No topic specified'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="font-semibold">{messageModal.email}</span>
                            </div>
                            {messageModal.phone && (
                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                    <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span>{messageModal.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                                <span>
                                    {messageModal.created_at
                                        ? new Date(messageModal.created_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        {/* STUDENT INQUIRY MESSAGE */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-5">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Student Query Content
                            </p>
                            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                                {messageModal.message}
                            </p>
                        </div>

                        {/* COUNSELOR REPLY FORM */}
                        <form onSubmit={handleSendReply} className="space-y-3 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <MessageSquareQuote className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <span>Counselor Reply (Sent to Student Portal & Email)</span>
                                </p>
                                {messageModal.replied_at && (
                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Replied on {new Date(messageModal.replied_at).toLocaleDateString()}</span>
                                    </span>
                                )}
                            </div>

                            <textarea
                                rows={4}
                                required
                                placeholder="Type your detailed response, counseling advice, or next steps here..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                            />

                            <div className="flex justify-end pt-1">
                                <button
                                    type="submit"
                                    disabled={isSendingReply}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{isSendingReply ? 'Sending Reply...' : messageModal.reply_message ? 'Update Reply' : 'Send Reply to Student'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
