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
    MessageSquare
} from 'lucide-react';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    const { url, props } = usePage();
    const { theme, toggleTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Close user dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentUser = props?.auth?.user;
    const adminName = currentUser?.name || 'Administrator';
    const adminEmail = currentUser?.email || 'admin@kampusedu.com';
    const isSuperAdmin = currentUser?.is_super_admin || currentUser?.roles?.includes('Super Admin') || currentUser?.id === 1;
    const userPermissions = currentUser?.permissions || [];
    const primaryRole = currentUser?.roles?.[0] || (isSuperAdmin ? 'Super Admin' : 'Staff');

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Global Settings', href: '/admin/settings', icon: Settings, permission: 'manage-settings' },
        { name: 'Hero Slideshow', href: '/admin/slideshow', icon: Layers, permission: 'manage-settings' },
        { name: 'Pages & SEO', href: '/admin/pages', icon: FileText, permission: 'manage-pages' },
        { name: 'Services', href: '/admin/services', icon: Layers, permission: 'manage-pages' },
        { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle, permission: 'manage-pages' },
        { name: 'Global Branches', href: '/admin/branches', icon: Globe2, permission: 'manage-pages' },
        { name: 'Countries', href: '/admin/countries', icon: Globe, permission: 'manage-countries' },
        { name: 'Universities', href: '/admin/universities', icon: Building2, permission: 'manage-universities' },
        { name: 'Courses', href: '/admin/courses', icon: BookOpen, permission: 'manage-courses' },
        { name: 'Blog Posts', href: '/admin/blog', icon: Newspaper, permission: 'manage-blogs' },
        { name: 'Partner Applications', href: '/admin/partners', icon: Handshake, permission: 'manage-partners' },
        { name: 'Student Applications', href: '/admin/student-applications', icon: GraduationCap, permission: 'manage-inquiries' },
        { name: 'Student Messages', href: '/admin/messages', icon: MessageSquare, permission: 'manage-inquiries', badge: props?.unread_admin_messages_count },
        { name: 'Inquiries & Contact', href: '/admin/inquiries', icon: Mail, permission: 'manage-inquiries' },
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

                        {/* Notification Bell */}
                        <button className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        </button>

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

                    {children}
                </main>

            </div>
        </div>
    );
}
