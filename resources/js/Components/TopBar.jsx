import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Phone, Handshake, X, Send, GraduationCap, LogIn, UserPlus, LogOut, ChevronDown, LayoutDashboard, FileText } from 'lucide-react';
import TopbarSearch from './TopbarSearch';

export default function TopBar({ onSearch }) {
    const { props } = usePage();
    const hotline = props?.globalSettings?.contact_bd_hotline || '+880 1812713814';
    const partnerModalParagraph = props?.globalSettings?.partner_modal_paragraph
        || 'Join our global higher education network. Register your agency below to collaborate with top universities worldwide and streamline student admissions.';
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);
    const [isIntroDismissed, setIsIntroDismissed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        country: '',
        yearsInBusiness: '1-3 years',
        message: ''
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        router.post('/partner/apply', {
            company_name: formData.companyName,
            contact_person: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            years_in_business: formData.yearsInBusiness,
            message: formData.message,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Thank you! Your agency partnership application has been submitted successfully. Our team will contact you shortly.');
                setFormData({
                    companyName: '',
                    contactPerson: '',
                    email: '',
                    phone: '',
                    country: '',
                    yearsInBusiness: '1-3 years',
                    message: ''
                });
                setIsPartnerModalOpen(false);
            },
            onError: () => {
                alert('There was an error submitting your application. Please check your details and try again.');
            },
            onFinish: () => {
                setIsSubmitted(false);
            }
        });
    };

    return (
        <>
            <div className="w-full bg-[#1E1B3A] text-white py-3 px-4 md:px-8 border-b border-slate-800/80 relative z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                    {/* CENTER/LEFT: LIVE DEBOUNCED SCOUT SEARCH */}
                    <TopbarSearch onSearch={onSearch} />

                    {/* RIGHT SIDE: CONTACT & BECOME A PARTNER ACTION */}
                    <div className="flex items-center gap-3 sm:gap-6 shrink-0">

                        {/* Country Code & Phone Hotline */}
                        <div className="hidden sm:flex items-center gap-2.5 text-xs font-extrabold text-white">
                            <span className="bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded-md border border-purple-700/50">
                                BD
                            </span>
                            <a
                                href={`tel:${hotline.replace(/\s+/g, '')}`}
                                className="flex items-center gap-1.5 hover:text-purple-300 transition-colors"
                            >
                                <Phone className="w-3.5 h-3.5 text-white" />
                                <span className="tracking-wide">{hotline}</span>
                            </a>
                        </div>

                        {/* Vertical Divider Line */}
                        <div className="hidden sm:block border-l border-slate-700 h-5" />

                        {/* Partner Button: OPENS DIALOGUE POPUP MODAL */}
                        <button
                            onClick={() => setIsPartnerModalOpen(true)}
                            className="bg-white hover:bg-slate-100 text-slate-900 dark:bg-slate-100 dark:hover:bg-white font-extrabold text-xs px-3.5 sm:px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                            <Handshake className="w-3.5 h-3.5 text-purple-700" />
                            <span>Become a Partner</span>
                        </button>

                        {/* STUDENT PORTAL & AUTH DROPDOWN */}
                        <div className="relative shrink-0">
                            {!props?.auth?.user ? (
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs px-3.5 sm:px-4 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer border border-purple-400/30"
                                    >
                                        <GraduationCap className="w-4 h-4 text-purple-200" />
                                        <span>Student Portal</span>
                                        <ChevronDown className={`w-3 h-3 text-purple-200 transition-transform duration-200 ${isStudentDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Guest Dropdown */}
                                    {isStudentDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsStudentDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-100">
                                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white">Student Account</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Track queries & admission status</p>
                                                </div>
                                                <Link
                                                    href="/login?type=student"
                                                    onClick={() => setIsStudentDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                >
                                                    <LogIn className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span>Student Login</span>
                                                </Link>
                                                <Link
                                                    href="/register?type=student"
                                                    onClick={() => setIsStudentDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                >
                                                    <UserPlus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                    <span>Register as Student</span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                /* Logged-in User Menu */
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                                        className="bg-slate-800/90 hover:bg-slate-700 text-white font-extrabold text-xs px-3 sm:px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-purple-500/40"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                                            {props.auth.user.name ? props.auth.user.name.charAt(0) : 'S'}
                                        </div>
                                        <span className="max-w-[80px] sm:max-w-[110px] truncate">
                                            {props.auth.user.name.split(' ')[0]}
                                        </span>
                                        <ChevronDown className={`w-3 h-3 text-purple-300 transition-transform duration-200 ${isStudentDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isStudentDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsStudentDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-800 dark:text-slate-100">
                                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{props.auth.user.name}</p>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{props.auth.user.email}</p>
                                                </div>
                                                {props.auth.user.roles?.includes('Student') || !props.auth.user.is_super_admin ? (
                                                    <>
                                                        <Link
                                                            href="/student/dashboard"
                                                            onClick={() => setIsStudentDropdownOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                        >
                                                            <LayoutDashboard className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                            <span>Student Dashboard</span>
                                                        </Link>
                                                        <Link
                                                            href="/student/dashboard#applications"
                                                            onClick={() => setIsStudentDropdownOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                        >
                                                            <GraduationCap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                            <span>Track Applications</span>
                                                        </Link>
                                                        <Link
                                                            href="/student/dashboard#queries"
                                                            onClick={() => setIsStudentDropdownOpen(false)}
                                                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                            <span>Queries & Replies</span>
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <Link
                                                        href="/admin/dashboard"
                                                        onClick={() => setIsStudentDropdownOpen(false)}
                                                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                    >
                                                        <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                )}
                                                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsStudentDropdownOpen(false);
                                                        router.post('/logout');
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                >
                                                    <LogOut className="w-3.5 h-3.5" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            {/* PARTNER REGISTRATION DIALOGUE POPUP MODAL */}
            {isPartnerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setIsPartnerModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                            aria-label="Close dialogue"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* MODAL HEADER */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                                <Handshake className="w-7 h-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Become a Kampus Partner
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    Global Higher Education Network
                                </p>
                            </div>
                        </div>

                        {/* CONFIGURABLE INTRO PARAGRAPH (EDITABLE VIA ADMIN PANEL & DISMISSIBLE) */}
                        {partnerModalParagraph && !isIntroDismissed && (
                            <div className="relative mb-5 p-3.5 pr-8 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100/80 dark:border-purple-900/40 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 animate-in fade-in duration-150">
                                <p className="whitespace-pre-line">{partnerModalParagraph}</p>
                                <button
                                    type="button"
                                    onClick={() => setIsIntroDismissed(true)}
                                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors cursor-pointer"
                                    aria-label="Dismiss message"
                                    title="Dismiss message"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {/* PARTNER REGISTRATION FORM */}
                        <form onSubmit={handleFormSubmit} className="space-y-4">

                            {/* Agency Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Company / Agency Name <span className="text-purple-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="e.g. Overseas Edu Consultancy"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Contact Person */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Contact Person Name <span className="text-purple-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    placeholder="e.g. Tanvir Ahmed"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Email & Phone Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Email Address <span className="text-purple-600">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="partner@agency.com"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Phone (WhatsApp) <span className="text-purple-600">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+880 1812713814"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Country & Years in Business Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Country / Location <span className="text-purple-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        placeholder="e.g. Bangladesh"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Years in Business
                                    </label>
                                    <select
                                        value={formData.yearsInBusiness}
                                        onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    >
                                        <option value="Less than 1 year">Less than 1 year</option>
                                        <option value="1-3 years">1-3 years</option>
                                        <option value="3-5 years">3-5 years</option>
                                        <option value="5+ years">5+ years</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message / Additional Information */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                    Additional Information / Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Tell us briefly about your student volume or target recruitment destinations..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={isSubmitted}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-extrabold text-sm shadow-md shadow-purple-600/30 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitted ? 'Submitting Application...' : 'Submit Partner Application'}</span>
                            </button>

                        </form>

                    </div>
                </div>
            )}
        </>
    );
}
