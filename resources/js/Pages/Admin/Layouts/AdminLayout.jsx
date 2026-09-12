import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { useTheme } from '../../../Contexts/ThemeProvider';
import {
    LayoutDashboard,
    Settings,
    FileText,
    Building2,
    BookOpen,
    Newspaper,
    Handshake,
    Mail,
    LogOut,
    Sun,
    Moon,
    GraduationCap,
    Menu,
    X,
    UserCircle,
    Bell,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    Globe,
    Globe2,
    Users,
    ShieldCheck,
    HelpCircle,
    Layers,
    MessageSquare,
    UserCheck,
    BellOff,
    CheckCheck,
    Sliders,
    Award
} from 'lucide-react';
import axios from 'axios';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    const { url, props } = usePage();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMarkingRead, setIsMarkingRead] = useState(false);
    const userMenuRef = useRef(null);
    const notificationsRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentUser = props?.auth?.user;
    const notifications = currentUser?.notifications || currentUser?.unreadNotifications || [];
    const unreadCount = typeof currentUser?.unread_notifications_count === 'number'
        ? currentUser.unread_notifications_count
        : (currentUser?.unreadNotifications?.length || 0);

    const formatRelativeTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInSeconds = Math.floor((now - date) / 1000);

            if (diffInSeconds < 60) return 'Just now';
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours}h ago`;
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays < 7) return `${diffInDays}d ago`;
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } catch {
            return '';
        }
    };

    const handleMarkAllAsRead = async () => {
        if (isMarkingRead || unreadCount === 0) return;
        setIsMarkingRead(true);
        try {
            await (window.axios || axios).post('/admin/notifications/mark-read');
            router.reload({ only: ['auth'] });
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        } finally {
            setIsMarkingRead(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        setIsNotificationsOpen(false);
        if (!notification.read_at) {
            try {
                await (window.axios || axios).post('/admin/notifications/mark-read', { id: notification.id });
                router.reload({ only: ['auth'] });
            } catch (error) {
                console.error('Failed to mark notification as read', error);
            }
        }
    };
    const adminName = currentUser?.name || 'Administrator';
    const adminEmail = currentUser?.email || 'admin@kampusedu.com';
    const isSuperAdmin = currentUser?.is_super_admin || currentUser?.roles?.includes('Super Admin') || currentUser?.id === 1;
    const userPermissions = currentUser?.permissions || [];
    const primaryRole = currentUser?.roles?.[0] || (isSuperAdmin ? 'Super Admin' : 'Staff');

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Global Settings', href: '/admin/settings', icon: Settings, permission: 'manage-settings' },
        { name: 'Environment (.env)', href: '/admin/settings/env', icon: Sliders, permission: 'manage-settings' },
        { name: 'Hero Slideshow', href: '/admin/slideshow', icon: Layers, permission: 'manage-settings' },
        { name: 'Pages & SEO', href: '/admin/pages', icon: FileText, permission: 'manage-pages' },
        { name: 'Services', href: '/admin/services', icon: Layers, permission: 'manage-pages' },
        { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle, permission: 'manage-pages' },
        { name: 'Global Branches', href: '/admin/branches', icon: Globe2, permission: 'manage-pages' },
        { name: 'Team & Employees', href: '/admin/employees', icon: UserCheck, permission: 'manage-pages' },
        { name: 'Countries', href: '/admin/countries', icon: Globe, permission: 'manage-countries' },
        { name: 'Universities', href: '/admin/universities', icon: Building2, permission: 'manage-universities' },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen, permission: 'manage-courses' },
        { name: 'Blog Posts', href: '/admin/blog', icon: Newspaper, permission: 'manage-blogs' },
        { name: 'Partner Applications', href: '/admin/partners', icon: Handshake, permission: 'manage-partners' },
        { name: 'Student Profiles', href: '/admin/students', icon: Award, permission: 'manage-inquiries' },
        { name: 'Student Applications', href: '/admin/student-applications', icon: GraduationCap, permission: 'manage-inquiries', badge: props?.pending_applications_count },
        { name: 'Student Messages', href: '/admin/messages', icon: MessageSquare, permission: 'manage-inquiries', badge: props?.unread_admin_messages_count },
        { name: 'Inquiries & Contact', href: '/admin/inquiries', icon: Mail, permission: 'manage-inquiries', badge: props?.unread_admin_inquiries_count },
    ];

    const accessControlLinks = [
        { name: 'User Management', href: '/admin/users', icon: Users, permission: 'manage-users' },
        { name: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck, permission: 'manage-roles' },
    ];

    const visibleSidebarLinks = sidebarLinks.filter(link => {
        if (!link.permission) return true;
        return isSuperAdmin || userPermissions.includes(link.permission);
    });

    const visibleAccessLinks = accessControlLinks.filter(link => {
        return isSuperAdmin || userPermissions.includes(link.permission);
    });

    const totalUnreadNotifications = (props?.unread_admin_inquiries_count || 0) + (props?.unread_admin_messages_count || 0) + (props?.pending_applications_count || 0);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">

            {/* 1. FIXED LEFT SIDEBAR (DARK THEME) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div>
                    {/* Brand Header */}
                    <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
                        <Link href="/admin/dashboard" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-base tracking-tight text-white">
                                    Kampus <span className="text-blue-400">{primaryRole === 'Partner' ? 'Partner' : 'CMS'}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    {primaryRole === 'Partner' ? 'Partner Portal' : 'Admin Panel'}
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Menu Links */}
                    <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Menu
                        </div>

                        {visibleSidebarLinks.map((link) => {
                            const IconComp = link.icon;
                            const isActive = link.href === '/admin/settings'
                                ? (url === '/admin/settings' || url === '/admin/settings/')
                                : url.startsWith(link.href);
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                        <span>{link.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {link.badge > 0 && (
                                            <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-500 text-white shadow-xs">
                                                {link.badge}
                                            </span>
                                        )}
                                        {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                                    </div>
                                </Link>
                            );
                        })}

                        {/* Access Control Navigation Section */}
                        {visibleAccessLinks.length > 0 && (
                            <>
                                <div className="px-3 py-2 pt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-800/80 mt-2">
                                    Access Control
                                </div>
                                {visibleAccessLinks.map((link) => {
                                    const IconComp = link.icon;
                                    const isActive = url.startsWith(link.href);
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                                <span>{link.name}</span>
                                            </div>
                                            {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                                        </Link>
                                    );
                                })}
                            </>
                        )}
                    </nav>
                </div>

                {/* Bottom Footer: Live Website Link */}
                <div className="p-4 border-t border-slate-800">
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-blue-400" />
                            <span>View Live Website</span>
                        </div>
                        <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded font-mono">127.0.0.1</span>
                    </a>
                </div>
            </aside>

            {/* OVERLAY FOR MOBILE SIDEBAR */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
                />
            )}

            {/* 2. RIGHT WRAPPER (TOP HEADER + MAIN CONTENT) */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">

                {/* TOP HEADER */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs transition-colors">

                    {/* Left: Mobile Hamburger & Page Title */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Right: Theme Toggle, Admin User Profile & Logout */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        {/* Interactive Notification Bell Dropdown */}
                        <div className="relative" ref={notificationsRef}>
                            <button
                                type="button"
                                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                                className={`p-2 rounded-full transition-colors cursor-pointer relative focus:outline-none ${isNotificationsOpen
                                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                aria-label="Notifications"
                                title="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <>
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping opacity-75" />
                                        <span className="absolute -top-1 -right-1 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900 leading-none">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* Floating Notifications Dropdown Menu */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                    {/* Dropdown Header */}
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                                Notifications
                                            </h3>
                                            {unreadCount > 0 ? (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                    {unreadCount} new
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                    0 unread
                                                </span>
                                            )}
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleMarkAllAsRead}
                                                disabled={isMarkingRead}
                                                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer disabled:opacity-50 transition-colors flex items-center gap-1"
                                            >
                                                {isMarkingRead ? (
                                                    <span>Marking...</span>
                                                ) : (
                                                    <>
                                                        <CheckCheck className="w-3.5 h-3.5" />
                                                        <span>Mark all read</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown Notification List */}
                                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                                        {notifications.length === 0 ? (
                                            <div className="py-10 px-4 text-center">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-500">
                                                    <BellOff className="w-6 h-6" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    No notifications yet
                                                </p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                    You'll be alerted when new inquiries or applications arrive!
                                                </p>
                                            </div>
                                        ) : (
                                            notifications.map((notif) => {
                                                const isUnread = !notif.read_at;
                                                const data = notif.data || {};
                                                const title = data.title || 'Notification';
                                                const message = data.message || '';
                                                const targetUrl = data.url || '/admin/inquiries';
                                                const timeAgo = formatRelativeTime(notif.created_at);

                                                return (
                                                    <Link
                                                        key={notif.id}
                                                        href={targetUrl}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className={`group flex items-start gap-3 p-3.5 transition-colors text-left border-l-4 ${
                                                            isUnread
                                                                ? 'bg-blue-50/60 dark:bg-blue-950/25 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                                                                : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80 hover:opacity-100'
                                                        }`}
                                                    >
                                                        <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                                                            isUnread
                                                                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/80'
                                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                                                        }`}>
                                                            <Bell className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                                <p className={`text-xs truncate transition-colors ${
                                                                    isUnread
                                                                        ? 'font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                                        : 'font-semibold text-slate-600 dark:text-slate-300'
                                                                }`}>
                                                                    {title}
                                                                </p>
                                                                {timeAgo && (
                                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                                                                        {timeAgo}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className={`text-[11px] line-clamp-2 leading-relaxed ${
                                                                isUnread
                                                                    ? 'text-slate-700 dark:text-slate-200 font-medium'
                                                                    : 'text-slate-500 dark:text-slate-400'
                                                            }`}>
                                                                {message}
                                                            </p>
                                                        </div>
                                                        {isUnread && (
                                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0 ring-2 ring-blue-200 dark:ring-blue-900" />
                                                        )}
                                                    </Link>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Dropdown Footer */}
                                    <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between gap-2 text-xs">
                                        {unreadCount > 0 ? (
                                            <button
                                                type="button"
                                                onClick={handleMarkAllAsRead}
                                                disabled={isMarkingRead}
                                                className="w-full py-1.5 px-3 rounded-xl font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 text-center"
                                            >
                                                {isMarkingRead ? 'Processing...' : 'Mark all as read'}
                                            </button>
                                        ) : (
                                            <div className="w-full flex items-center justify-between px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                <Link href="/admin/inquiries" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    All Inquiries
                                                </Link>
                                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                                <Link href="/admin/student-applications" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                    All Applications
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dark / Light Mode Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                            aria-label="Toggle Theme"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-700" />
                            )}
                        </button>

                        <div className="h-6 border-l border-slate-200 dark:border-slate-700 hidden sm:block" />

                        {/* Interactive Admin User Profile Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                className="flex items-center gap-3 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none"
                                aria-expanded={isUserMenuOpen}
                                aria-haspopup="true"
                            >
                                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
                                    <UserCircle className="w-5 h-5" />
                                </div>
                                <div className="hidden sm:flex flex-col text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-extrabold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            {adminName}
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                                            {primaryRole}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                        {adminEmail}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Floating Profile Dropdown Menu: Appears only when hitting the user name */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsUserMenuOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                        <span>Profile</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Quick Logout Action Button */}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                            title="Sign Out"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>

                    </div>
                </header>

                {/* 3. MAIN CONTENT AREA WITH SOFT BACKGROUND */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
                    {/* Flash Notifications */}
                    {props?.flash?.success && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                            {props.flash.success}
                        </div>
                    )}
                    {props?.flash?.status && (
                        <div className="mb-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                            {props.flash.status}
                        </div>
                    )}
                    {props?.flash?.error && (
                        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm font-semibold">
                            {props.flash.error}
                        </div>
                    )}
                    {Array.isArray(props?.flash?.import_errors) && props.flash.import_errors.length > 0 && (
                        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-sm">
                            <div className="font-bold flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                                <span>Bulk Upload Notice ({props.flash.import_errors.length} issue{props.flash.import_errors.length > 1 ? 's' : ''} detected):</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-xs opacity-90 pl-1 max-h-48 overflow-y-auto">
                                {props.flash.import_errors.map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {children}
                </main>

            </div>
        </div>
    );
}
