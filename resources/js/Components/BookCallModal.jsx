import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import {
    X,
    Calendar,
    Clock,
    User,
    Mail,
    Phone,
    Globe,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    PhoneCall,
    GraduationCap
} from 'lucide-react';

export default function BookCallModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const { props } = usePage();
    const globalCountries = props?.globalCountries || [];

    const destinationOptions = globalCountries.length > 0
        ? globalCountries.map(c => ({ id: c.id || c.name, code: c.country_code || 'GL', name: c.name }))
        : [
            { id: 1, code: 'AU', name: 'Australia' },
            { id: 2, code: 'CA', name: 'Canada' },
            { id: 3, code: 'GB', name: 'United Kingdom' },
            { id: 4, code: 'US', name: 'United States' },
            { id: 5, code: 'FI', name: 'Finland' },
            { id: 6, code: 'AE', name: 'Dubai / UAE' }
        ];

    const residenceCountries = globalCountries.length > 0
        ? globalCountries.map(c => c.name)
        : ['Bangladesh', 'United Kingdom', 'United States', 'India', 'Pakistan', 'Nigeria', 'United Arab Emirates'];

    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Today YYYY-MM-DD for min date attribute
    const todayStr = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        destination: destinationOptions[0]?.name || 'Australia',
        level_of_study: 'Postgraduate (Masters Degree / MSc / MBA)',
        date: todayStr,
        time: 'Morning (09:00 AM - 12:00 PM)',
        name: '',
        email: '',
        phone: '',
        country: residenceCountries[0] || 'Bangladesh',
    });

    useEffect(() => {
        if (!formData.destination && destinationOptions.length > 0) {
            setFormData((prev) => ({ ...prev, destination: destinationOptions[0].name }));
        }
    }, [destinationOptions]);

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const validateStep = () => {
        const newErrors = {};
        if (step === 1) {
            if (!formData.destination) newErrors.destination = 'Please select a destination.';
            if (!formData.level_of_study) newErrors.level_of_study = 'Please select your level of study.';
        } else if (step === 2) {
            if (!formData.date) newErrors.date = 'Please pick a preferred date.';
            if (!formData.time) newErrors.time = 'Please select a preferred time slot.';
        } else if (step === 3) {
            if (!formData.name.trim()) newErrors.name = 'Full name is required.';
            if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required.';
            if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
            if (!formData.country) newErrors.country = 'Country of residence is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (step < 3) {
            setStep(step + 1);
        } else if (step === 3) {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1 && step < 4) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setProcessing(true);
        try {
            await axios.post('/book-call', formData);
            setStep(4);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                alert('Something went wrong. Please check your details and try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleCloseModal = () => {
        setStep(1);
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[calc(100vh-2rem)] sm:max-h-[85vh] transition-all">
                
                {/* 1. TOP PROGRESS BAR HEADER (FIXED HEIGHT / SHRINK-0) */}
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                <PhoneCall className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Book a Consultation Call
                            </span>
                        </div>

                        <button
                            onClick={handleCloseModal}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* 4-SEGMENT PROGRESS BAR */}
                    {step <= 4 && (
                        <div className="grid grid-cols-4 gap-2 pt-1">
                            {[1, 2, 3, 4].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        s <= step
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                                            : 'bg-slate-100 dark:bg-slate-800'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. BODY STEP CONTENT (SCROLLABLE AREA) */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto min-h-0">
                    
                    {/* STEP 1: DESTINATION & LEVEL OF STUDY */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="space-y-1">
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Where do you want to study?
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Select your target destination country and academic level
                                </p>
                            </div>

                            {/* PREFERRED STUDY DESTINATION DROPDOWN */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    PREFERRED STUDY DESTINATION
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.destination}
                                        onChange={(e) => handleFieldChange('destination', e.target.value)}
                                        className="w-full pl-11 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none truncate cursor-pointer"
                                    >
                                        <option value="" disabled>Select target study destination...</option>
                                        {destinationOptions.map((item) => (
                                            <option key={item.id} value={item.name}>
                                                {item.name} {item.code && item.code !== 'GL' ? `(${item.code})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                </div>
                                {errors.destination && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.destination}</p>
                                )}
                            </div>

                            {/* LEVEL OF STUDY DROPDOWN */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    LEVEL OF STUDY
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.level_of_study}
                                        onChange={(e) => handleFieldChange('level_of_study', e.target.value)}
                                        className="w-full pl-11 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none truncate"
                                    >
                                        <option value="Undergraduate (Bachelors)">Undergraduate (Bachelors Degree)</option>
                                        <option value="Postgraduate (Masters Degree / MSc / MBA)">Postgraduate (Masters Degree / MSc / MBA)</option>
                                        <option value="Foundation / Pathway">Foundation / Pre-Masters Pathway</option>
                                        <option value="Doctorate (PhD)">Doctorate (PhD / Research)</option>
                                    </select>
                                    <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                </div>
                                {errors.level_of_study && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.level_of_study}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PREFERRED DATE & TIME */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in duration-200">
                            <div className="space-y-1">
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    When should we call you?
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Choose your preferred date and convenient time slot
                                </p>
                            </div>

                            {/* PREFERRED DATE */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    PREFERRED DATE
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        min={todayStr}
                                        value={formData.date}
                                        onChange={(e) => handleFieldChange('date', e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Calendar className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                </div>
                                {errors.date && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.date}</p>
                                )}
                            </div>

                            {/* PREFERRED TIME */}
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    PREFERRED TIME SLOT
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.time}
                                        onChange={(e) => handleFieldChange('time', e.target.value)}
                                        className="w-full pl-11 pr-8 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                                        <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                                        <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                                    </select>
                                    <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                                </div>
                                {errors.time && (
                                    <p className="text-xs font-semibold text-rose-500 pt-1">{errors.time}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 3: CONTACT DETAILS */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in duration-200">
                            <div className="space-y-1">
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Your Contact Information
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Enter your details so our senior education counselor can reach you
                                </p>
                            </div>

                            {/* FULL NAME */}
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleFieldChange('name', e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                                </div>
                                {errors.name && <p className="text-xs font-semibold text-rose-500 pt-0.5">{errors.name}</p>}
                            </div>

                            {/* EMAIL ADDRESS */}
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                        placeholder="e.g. name@example.com"
                                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                                </div>
                                {errors.email && <p className="text-xs font-semibold text-rose-500 pt-0.5">{errors.email}</p>}
                            </div>

                            {/* PHONE NUMBER */}
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Phone Number (WhatsApp) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                                        placeholder="e.g. +10 700 00000"
                                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                                </div>
                                {errors.phone && <p className="text-xs font-semibold text-rose-500 pt-0.5">{errors.phone}</p>}
                            </div>

                            {/* COUNTRY OF RESIDENCE */}
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Country of Residence *
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.country}
                                        onChange={(e) => handleFieldChange('country', e.target.value)}
                                        className="w-full pl-11 pr-8 py-2.5 sm:py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        {residenceCountries.map((cName) => (
                                            <option key={cName} value={cName}>
                                                {cName}
                                            </option>
                                        ))}
                                        <option value="Other">Other Country</option>
                                    </select>
                                    <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                                </div>
                                {errors.country && <p className="text-xs font-semibold text-rose-500 pt-0.5">{errors.country}</p>}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS CONFIRMATION */}
                    {step === 4 && (
                        <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500/30">
                                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
                            </div>

                            <div className="space-y-2 max-w-md mx-auto">
                                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Call Request Confirmed!
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    We'll call <strong className="text-slate-900 dark:text-white font-bold">{formData.name}</strong> on{' '}
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{formData.date}</span> at{' '}
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{formData.time}</span> to discuss{' '}
                                    <span className="text-slate-900 dark:text-white font-semibold">{formData.level_of_study}</span> programmes in the{' '}
                                    <strong className="text-slate-900 dark:text-white font-bold">{formData.destination}</strong>.
                                </p>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full py-3 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/30 hover:scale-[1.01] transition-transform cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                {/* 3. FOOTER ACTIONS (FOR STEPS 1 - 3) (FIXED HEIGHT / SHRINK-0) */}
                {step <= 3 && (
                    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-3 sm:px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-4 sm:px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={processing}
                                className="px-5 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <span>{processing ? 'Submitting...' : step === 3 ? 'Confirm Booking' : 'Continue'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
