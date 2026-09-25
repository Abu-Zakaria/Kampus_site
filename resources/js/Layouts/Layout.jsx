import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTheme } from '../Contexts/ThemeProvider';
import TopBar from '../Components/TopBar';
import BookCallModal from '../Components/BookCallModal';
import AiCourseMatcher from '../Components/AiCourseMatcher';
import BranchDetailsModal from '../Components/BranchDetailsModal';
import {
    GraduationCap,
    Globe,
    Sparkles,
    PhoneCall,
    Calendar,
    Search,
    Menu,
    X,
    ChevronRight,
    MapPin,
    Mail,
    Phone,
    Clock,
    ArrowUp,
    CheckCircle2,
    Award,
    BookOpen,
    Building2,
    Users,
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Send,
    Sun,
    Moon
} from 'lucide-react';

export default function Layout({ children }) {
    const { url, props } = usePage();
    const { nav_pages = [], footer_pages = [], globalBranches = [], globalSettings = {} } = props;
    const { theme, toggleTheme } = useTheme();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
    const [isBookCallOpen, setIsBookCallOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        const handleOpenModal = () => setIsBookCallOpen(true);
        window.addEventListener('open-book-call-modal', handleOpenModal);

        const handleOpenAiMatcher = () => setIsAiSearchOpen(true);
        window.addEventListener('open-ai-matcher-modal', handleOpenAiMatcher);

        const handleOpenBranchModal = (e) => {
            if (e.detail) setSelectedBranch(e.detail);
        };
        window.addEventListener('open-branch-modal', handleOpenBranchModal);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('open-book-call-modal', handleOpenModal);
            window.removeEventListener('open-ai-matcher-modal', handleOpenAiMatcher);
            window.removeEventListener('open-branch-modal', handleOpenBranchModal);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const staticNavLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Universities', href: '/universities' },
        { name: 'Courses', href: '/courses' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
        { name: 'About', href: '/about' },
    ];

    // Combine static nav links with dynamic navbar pages enabled by Admin
    const dynamicNavLinks = (nav_pages || []).map(p => ({
        name: p.name,
        href: p.slug === 'home' || p.slug === '/' ? '/' : `/${p.slug.replace(/^\//, '')}`
    }));

    const navLinks = [
        ...staticNavLinks,
        ...dynamicNavLinks.filter(d => !staticNavLinks.some(s => s.href.toLowerCase() === d.href.toLowerCase()))
    ];

    const staticQuickLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Counseling Services', href: '/services' },
        { name: 'Partner Universities', href: '/universities' },
        { name: 'Popular Courses', href: '/courses' },
        { name: 'Scholarship Finder', href: '/scholarships' },
        { name: 'Student Visa Guide', href: '/visa-guide' },
    ];

    // Combine static footer links with dynamic footer pages enabled by Admin (excluding legal/policy pages which belong in bottom copyright bar)
    const legalPages = ['privacy-policy', 'terms-of-service', 'terms', 'accreditation'];
    const dynamicFooterLinks = (footer_pages || []).map(p => ({
        name: p.name,
        href: p.slug === 'home' || p.slug === '/' ? '/' : `/${p.slug.replace(/^\//, '')}`
    }));

    const quickLinks = [
        ...staticQuickLinks,
        ...dynamicFooterLinks.filter(d => {
            const cleanHref = d.href.replace(/^\//, '').toLowerCase();
            const isStatic = staticQuickLinks.some(s => s.href.toLowerCase() === d.href.toLowerCase());
            const isLegal = legalPages.includes(cleanHref);
            return !isStatic && !isLegal;
        })
    ];



    return (
        <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 antialiased">
            
            {/* 1. GLOBAL TOP BAR */}
            <TopBar />

            {/* STICKY NAVBAR */}
            <header
                className={`sticky top-0 z-40 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-md border-b border-slate-200/70 dark:border-slate-800/70 py-3'
                        : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 py-4'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        
                        {/* 1. Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
                            {globalSettings?.site_logo ? (
                                <img
                                    src={`/storage/${globalSettings.site_logo}`}
                                    alt={globalSettings?.site_name || 'Logo'}
                                    className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                                        {globalSettings?.site_name || 'Kampus Edu'}
                                    </span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 tracking-wide dark:text-slate-400">
                                    {globalSettings?.header_subtitle || 'Educational Consultancy'}
                                </span>
                            </div>
                        </Link>

                        {/* 2. Center: Navigation Links (Including Admin Dynamic Nav Pages) */}
                        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/50">
                            {navLinks.map((link) => {
                                const isActive = url === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                                                : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                            <button
                                onClick={() => setIsAiSearchOpen(true)}
                                className="ml-1 px-3.5 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 text-indigo-700 dark:text-indigo-300 hover:from-indigo-600 hover:to-blue-600 hover:text-white transition-all duration-300 flex items-center gap-1.5 border border-indigo-200/50 dark:border-indigo-800/50 group cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:text-white animate-pulse" />
                                <span>AI Search</span>
                            </button>
                        </nav>

                        {/* 3. Controls & CTA */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60"
                                aria-label="Toggle Dark/Light Mode"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-4 h-4 text-amber-400" />
                                ) : (
                                    <Moon className="w-4 h-4 text-slate-700" />
                                )}
                            </button>

                            <button
                                onClick={() => setIsAiSearchOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                aria-label="Open AI Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsBookCallOpen(true)}
                                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <PhoneCall className="w-4 h-4" />
                                <span>Book a Call</span>
                            </button>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Toggle Mobile Navigation"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200 shadow-xl">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                                        url === link.href
                                            ? 'bg-blue-600 text-white font-semibold'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Direct Hotlines for UK & BD */}
                        <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
                            {(globalSettings?.contact_uk_hotline || '+44 20 7946 0912') && (
                                <a
                                    href={`tel:${(globalSettings?.contact_uk_hotline || '+44 20 7946 0912').replace(/\s+/g, '')}`}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:text-blue-600 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                                >
                                    <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">UK</span>
                                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                                    <span>{globalSettings?.contact_uk_hotline || '+44 20 7946 0912'}</span>
                                </a>
                            )}
                            {(globalSettings?.contact_bd_hotline || '+880 1812713814') && (
                                <a
                                    href={`tel:${(globalSettings?.contact_bd_hotline || '+880 1812713814').replace(/\s+/g, '')}`}
                                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:text-purple-600 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                                >
                                    <span className="bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">BD</span>
                                    <Phone className="w-3.5 h-3.5 text-purple-500" />
                                    <span>{globalSettings?.contact_bd_hotline || '+880 1812713814'}</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 w-full">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
                        
                        {/* COL 1: Logo & Brand Information */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                {globalSettings?.footer_logo ? (
                                    <img
                                        src={`/storage/${globalSettings.footer_logo}`}
                                        alt={globalSettings?.footer_name || 'Footer Logo'}
                                        className="w-10 h-10 object-contain rounded-xl shadow-lg"
                                    />
                                ) : globalSettings?.site_logo ? (
                                    <img
                                        src={`/storage/${globalSettings.site_logo}`}
                                        alt={globalSettings?.footer_name || 'Footer Logo'}
                                        className="w-10 h-10 object-contain rounded-xl shadow-lg"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-extrabold text-xl text-white tracking-tight">
                                        {globalSettings?.footer_name || globalSettings?.site_name || 'Kampus EduConsult'}
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                        {globalSettings?.footer_subtitle || globalSettings?.site_tagline || 'Global Higher Education Advisers'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                                {globalSettings?.footer_description || 'Empowering ambitious students worldwide to gain admission into top global universities in UK, USA, Canada, Australia, & Europe.'}
                            </p>
                        </div>

                        {/* COL 2: Quick Links (Including Admin Dynamic Footer Pages) */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-white tracking-wide border-l-2 border-blue-500 pl-3">
                                Quick Links
                            </h3>
                            <ul className="space-y-2.5 text-sm">
                                {quickLinks.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all group"
                                        >
                                            <ChevronRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* COL 3: Global Branches */}
                        <div className="space-y-4" id="branches">
                            <h3 className="text-base font-bold text-white tracking-wide border-l-2 border-blue-500 pl-3">
                                Global Branches
                            </h3>
                            {globalBranches && globalBranches.length > 0 ? (
                                <div className="flex flex-col space-y-3 max-h-[280px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50">
                                    {globalBranches.map((branch) => (
                                        <div 
                                            key={branch.id} 
                                            onClick={() => setSelectedBranch(branch)}
                                            className="flex items-center justify-between p-3 border border-slate-700/50 rounded-xl bg-slate-800/30 hover:bg-slate-800/80 hover:border-slate-600 transition-all cursor-pointer shrink-0 group"
                                            title={`Click to view ${branch.country_name} branch location and map`}
                                        >
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <span className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors shrink-0">{branch.country_code}</span>
                                                <span className="text-slate-300 text-sm truncate group-hover:text-white transition-colors">{branch.country_name}</span>
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded-full border border-teal-500/30 text-teal-400 bg-teal-500/10 shrink-0 ml-2 group-hover:bg-teal-500/20 transition-colors">
                                                {branch.status_text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500">No branch locations available.</p>
                            )}
                        </div>

                        {/* COL 4: Head Office Contact */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-white tracking-wide border-l-2 border-blue-500 pl-3">
                                Head Office Contact
                            </h3>
                            <div className="space-y-3 text-sm text-slate-400">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {globalSettings?.head_office_address || globalSettings?.contact_address || '124 Education Avenue, Suite 400, Oxford Street, London W1B 3AG, United Kingdom'}
                                </p>
                                <p className="font-medium text-slate-300">
                                    {globalSettings?.head_office_phone || 'UK: +44 20 7946 0912 | BD: +880 1812713814'}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Legal Links */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                        <div>
                            © {new Date().getFullYear()} <span className="text-white font-medium">RMS Educational Consultancy Ltd</span>. All rights reserved.
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/accreditation" className="hover:text-white transition-colors">Accreditation</Link>
                            {dynamicFooterLinks
                                .filter(d => !['/', '/about', '/services', '/universities', '/courses', '/scholarships', '/visa-guide', '/privacy-policy', '/terms-of-service', '/terms', '/accreditation'].includes(d.href.toLowerCase()))
                                .map(p => (
                                    <Link key={p.name} href={p.href} className="hover:text-blue-400 text-slate-300 font-medium transition-colors">
                                        {p.name}
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </footer>

            {/* 7-Step Interactive AI Course Matcher Modal */}
            <AiCourseMatcher isOpen={isAiSearchOpen} onClose={() => setIsAiSearchOpen(false)} />

            {/* Multi-Step Book a Call Modal */}
            <BookCallModal isOpen={isBookCallOpen} onClose={() => setIsBookCallOpen(false)} />

            {/* Global Branch Location & Map Modal */}
            <BranchDetailsModal branch={selectedBranch} onClose={() => setSelectedBranch(null)} />
        </div>
    );
}
