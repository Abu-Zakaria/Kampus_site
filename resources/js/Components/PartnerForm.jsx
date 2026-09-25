import React, { useState } from 'react';
import {
    Send,
    Handshake,
    CheckCircle2,
    Building2,
    User,
    Mail,
    Phone,
    Globe,
    Calendar,
    MessageSquare,
    Sparkles
} from 'lucide-react';

export default function PartnerForm({ content = {} }) {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        country: '',
        website: '',
        yearsInBusiness: '1-3 years',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            alert('Thank you for applying! Our Partner Relations Team will review your application and contact you within 48 hours.');
            setFormData({
                companyName: '',
                contactPerson: '',
                email: '',
                phone: '',
                country: '',
                website: '',
                yearsInBusiness: '1-3 years',
                message: ''
            });
            setIsSubmitted(false);
        }, 600);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* CENTERED MAX-WIDTH CONTAINER STYLED AS A LARGE CARD */}
                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 lg:p-12 space-y-8">
                    
                    {/* SECTION TITLE & SUBTITLE */}
                    <div className="text-center space-y-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                            <Handshake className="w-3.5 h-3.5" />
                            <span>{content?.form_badge || 'PARTNER APPLICATION'}</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {content?.form_title || 'Apply for Partnership'}
                        </h2>

                        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto">
                            {content?.form_subtitle || 'Fill out the form below to register your agency. Our partnerships team will get back to you within 48 hours.'}
                        </p>
                    </div>

                    {/* FORM FIELDS WITH FULL DARK MODE SUPPORT & FOCUS RINGS */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* ROW 1 (2 COLUMNS): COMPANY NAME & CONTACT PERSON */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Company / Agency Name <span className="text-purple-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Global Edu Advisory"
                                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Contact Person Name <span className="text-purple-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Sarah Jenkins"
                                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ROW 2 (2 COLUMNS): EMAIL ADDRESS & PHONE NUMBER */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Email Address <span className="text-purple-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="partner@agency.com"
                                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Phone Number (WhatsApp) <span className="text-purple-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+880 1812713814"
                                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ROW 3 (2 COLUMNS): COUNTRY/LOCATION & WEBSITE LINK */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Country / Location <span className="text-purple-600">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Bangladesh / India / Kenya"
                                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Website / Social Media Link
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://www.agency.com"
                                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ROW 4 (FULL WIDTH): YEARS IN BUSINESS DROPDOWN */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Years in Business
                            </label>
                            <select
                                name="yearsInBusiness"
                                value={formData.yearsInBusiness}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer"
                            >
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1-3 years">1-3 years</option>
                                <option value="3-5 years">3-5 years</option>
                                <option value="5+ years">5+ years</option>
                            </select>
                        </div>

                        {/* ROW 5 (FULL WIDTH): MESSAGE OR ADDITIONAL INFORMATION */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Message or Additional Information
                            </label>
                            <textarea
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about your agency student volume, recruitment focus, and goals..."
                                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* SUBMIT BUTTON: FULL-WIDTH SOLID BRAND-COLORED BUTTON */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitted}
                                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitted ? 'Submitting Application...' : 'Submit Application'}</span>
                            </button>
                        </div>

                    </form>

                </div>

            </div>
        </section>
    );
}
