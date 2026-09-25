import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    MapPin,
    Mail,
    Phone,
    Clock,
    Send,
    CheckCircle2,
    Sparkles,
    Building2
} from 'lucide-react';

const extractMapUrl = (input) => {
    if (!input) return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.915783307521!2d-0.05716182337775242!3d51.51478190950346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876033580555555%3A0x123456789abcdef!2sJubilee%20St%2C%20London!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk';
    const match = input.match(/src=["']([^"']+)["']/);
    return match ? match[1] : input;
};

export default function ContactContent({ content = {} }) {
    const { props } = usePage();
    const globalSettings = props?.globalSettings || {};

    const formTitle = content?.form_title || 'Send us a message';
    const formSubtitle = content?.form_subtitle || 'Have questions about application deadlines, university rankings, or visa criteria? Drop your inquiry below.';

    const contactTitle = content?.info_title || globalSettings.contact_info_title || 'Contact Information';
    const contactSubtitle = content?.info_subtitle || globalSettings.contact_info_subtitle || 'London Global HQ & Regional Advisory Center';
    const contactAddress = content?.address || globalSettings.contact_info_address || '1st Floor, Botanical Works, 2 Jubilee Street, London E1 3FU';
    const contactEmail = content?.email || globalSettings.contact_info_email || globalSettings.contact_email || 'info@ RMS-group.com';
    const contactPhone = content?.phone || globalSettings.contact_info_phone || '020 7423 9333';
    const contactHours = content?.operating_hours || globalSettings.contact_info_hours || globalSettings.operating_hours || 'Monday - Friday: 9:00 AM - 6:00 PM GMT';
    const mapSrc = extractMapUrl(content?.map_iframe || globalSettings.contact_map_iframe);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        topic: 'General Inquiry',
        message: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);

        router.post('/contact/submit', {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            topic: formData.topic,
            message: formData.message,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert('Thank you for reaching out! A counselor will respond within 24 hours.');
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    topic: 'General Inquiry',
                    message: ''
                });
            },
            onError: () => {
                alert('There was an error sending your message. Please check your details and try again.');
            },
            onFinish: () => {
                setIsSubmitted(false);
            }
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* LEFT COLUMN: THE INQUIRY FORM (7 COLS ON DESKTOP) */}
                    <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-800/60 p-7 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {formTitle}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                                {formSubtitle}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Full Name <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Tanvir Ahmed"
                                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Email Address <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="tanvir@example.com"
                                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Phone Number & Topic */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Phone / WhatsApp <span className="text-blue-600">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+880 1712 345678"
                                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Inquiry Category
                                    </label>
                                    <select
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                    >
                                        <option value="General Inquiry">General Study Abroad Inquiry</option>
                                        <option value="UK Admissions">UK University Admissions</option>
                                        <option value="USA Admissions">USA Admissions & STEM OPT</option>
                                        <option value="Canada Admissions">Canada Universities & Permits</option>
                                        <option value="Finland/Europe Admissions">Finland & EU Admissions</option>
                                        <option value="Visa & Compliance">Student Visa & Compliance</option>
                                        <option value="Institutional Partnership">B2B Institutional Partnership</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message Area */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    Your Message / Specific Question <span className="text-blue-600">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Please share details about your target study level, budget, or preferred intake..."
                                    className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitted}
                                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                <span>{isSubmitted ? 'Sending Your Message...' : 'Submit Inquiry'}</span>
                            </button>

                        </form>
                    </div>

                    {/* RIGHT COLUMN: CONTACT INFORMATION & GOOGLE MAPS (5 COLS ON DESKTOP) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* DISTINCT CARD CONTAINER */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 p-7 lg:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-6">

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {contactTitle}
                                </h3>
                                {contactSubtitle && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {contactSubtitle}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-5 text-sm">

                                {/* Address */}
                                {contactAddress && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-bold uppercase text-slate-400">HQ Address</div>
                                            <div className="font-semibold text-slate-900 dark:text-white leading-snug whitespace-pre-line">
                                                {contactAddress}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                {contactEmail && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-bold uppercase text-slate-400">Email Us</div>
                                            <a href={`mailto:${contactEmail}`} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                {contactEmail}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Phone */}
                                {contactPhone && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-bold uppercase text-slate-400">Call Us</div>
                                            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
                                                {contactPhone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Office Hours */}
                                {contactHours && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-bold uppercase text-slate-400">Office Hours</div>
                                            <div className="font-semibold text-slate-900 dark:text-white">
                                                {contactHours}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* GOOGLE MAPS EMBEDDED IFRAME */}
                        {mapSrc && (
                            <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 h-52 bg-slate-900 relative">
                                <iframe
                                    title={contactTitle || 'Location Map'}
                                    src={mapSrc}
                                    className="w-full h-full border-0 opacity-90 filter grayscale-[20%] contrast-105"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </section>
    );
}
