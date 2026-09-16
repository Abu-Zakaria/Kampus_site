import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { GraduationCap, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function GuestLayout({ children }) {
    const { props } = usePage();
    const globalSettings = props?.globalSettings || {};

    const siteName = globalSettings?.site_name || 'RMS Edu';
    const headerSubtitle = globalSettings?.header_subtitle !== undefined && globalSettings.header_subtitle !== null && globalSettings.header_subtitle !== ''
        ? globalSettings.header_subtitle
        : 'Educational Consultancy';
    const footerName = globalSettings?.footer_name || globalSettings?.site_name || 'RMS Educational Consultancy Ltd';
    const siteLogo = globalSettings?.site_logo;

    // Split brand name if multiple words and last word is short (badge style like EDU, HUB, LTD, etc.)
    const brandWords = siteName.trim().split(/\s+/);
    const hasBadge = brandWords.length > 1 && brandWords[brandWords.length - 1].length <= 5;
    const mainTitle = hasBadge ? brandWords.slice(0, -1).join(' ') : siteName;
    const badgeText = hasBadge ? brandWords[brandWords.length - 1] : null;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans antialiased">
            
            {/* Ambient Background Blur Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Navigation Row: Back to Website Link */}
            <div className="w-full max-w-md flex items-center justify-between mb-8 relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-full backdrop-blur-md"
                >
                    <ArrowLeft className="w-4 h-4 text-blue-400" />
                    <span>Back to Website</span>
                </Link>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Secure Portal</span>
                </div>
            </div>

            {/* BRANDING HEADER */}
            <div className="flex flex-col items-center text-center space-y-3 mb-6 relative z-10">
                <Link href="/" className="flex items-center gap-3 group">
                    {siteLogo ? (
                        <img
                            src={`/storage/${siteLogo}`}
                            alt={siteName}
                            className="w-12 h-12 object-contain rounded-2xl shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 bg-white/5 p-1 border border-white/10"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                    )}
                    <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-2xl tracking-tight text-white">
                                {mainTitle}
                            </span>
                            {badgeText && (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                                    {badgeText}
                                </span>
                            )}
                        </div>
                        {headerSubtitle && (
                            <span className="text-xs font-medium text-slate-400 tracking-wide">
                                {headerSubtitle}
                            </span>
                        )}
                    </div>
                </Link>
            </div>

            {/* CARD WRAPPER */}
            <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 relative z-10">
                {children}
            </div>

            {/* FOOTER COPYRIGHT */}
            <div className="mt-8 text-center text-xs text-slate-500 relative z-10">
                © {new Date().getFullYear()}{' '}
                <span className="text-slate-400 font-medium">
                    {footerName}
                </span>
                . All rights reserved.
            </div>

        </div>
    );
}
