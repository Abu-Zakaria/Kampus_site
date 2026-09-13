import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '../../../Layouts/Layout';
import SeoHead from '../../../Components/SeoHead';
import {
    Calendar,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    BookOpen,
    Share2,
    CheckCircle2,
    Send,
    User,
    Mail,
    Phone,
    Globe,
    GraduationCap,
    BookMarked
} from 'lucide-react';

export default function BlogShow({ blog = {}, relatedBlogs = [] }) {
    const postDate = blog.created_at
        ? new Date(blog.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Recent Story';

    const imageUrl = blog.image
        ? (blog.image.startsWith('http') ? blog.image : blog.image)
        : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

    // Consultation Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        dialCode: '+234',
        mobile: '',
        studyLevel: '',
        subject: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/contact/submit', {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            country: formData.country,
            dialCode: formData.dialCode,
            mobile: formData.mobile,
            studyLevel: formData.studyLevel,
            subject: formData.subject,
            article_title: blog.title || '',
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setIsSubmitted(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    country: '',
                    dialCode: '+234',
                    mobile: '',
                    studyLevel: '',
                    subject: ''
                });
            },
            onError: () => {
                setIsSubmitting(false);
                alert('Please check the required form fields and try again.');
            }
        });
    };

    return (
        <Layout>
            <SeoHead
                title={blog.meta_title || blog.title}
                description={blog.meta_description || blog.excerpt}
                image={blog.image ? (blog.image.startsWith('http') || blog.image.startsWith('/') ? blog.image : '/storage/' + blog.image) : (blog.featured_image ? '/storage/' + blog.featured_image : null)}
            />

            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white">
                
                {/* 1. ARTICLE & SIDEBAR SECTION */}
                <section className="py-12 lg:py-20 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        {/* Back to Blog Link */}
                        <div className="mb-8">
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span>Back to All Stories & Insights</span>
                            </Link>
                        </div>

                        {/* 2-Column Responsive Layout: Left Article & Right Sticky Sidebar */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                            
                            {/* LEFT COLUMN: MAIN ARTICLE */}
                            <article className="lg:col-span-8 space-y-6">
                                
                                {/* Badges & Meta */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {blog.category && (
                                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
                                            {blog.category}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Published on {postDate}</span>
                                    </div>
                                </div>

                                {/* Article Title */}
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.2]">
                                    {blog.title}
                                </h1>

                                {/* Optional Excerpt Subtitle */}
                                {blog.excerpt && (
                                    <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-l-4 border-blue-600 pl-4 py-1">
                                        {blog.excerpt}
                                    </p>
                                )}

                                {/* Featured Image */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-950">
                                    <img
                                        src={imageUrl}
                                        alt={blog.title}
                                        className="w-full h-[320px] sm:h-[450px] object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';
                                        }}
                                    />
                                </div>

                                {/* Article Body: Tailwind Typography Prose with Inline Style Overrides */}
                                <div
                                    className="prose prose-slate dark:prose-invert prose-lg max-w-none leading-relaxed prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl prose-img:shadow-lg custom-blog-content pt-4"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />

                                {/* Override copy-pasted inline styles to preserve dark theme */}
                                <style dangerouslySetInnerHTML={{__html: `
                                    .custom-blog-content * {
                                        background-color: transparent !important;
                                    }
                                    .custom-blog-content p, 
                                    .custom-blog-content span, 
                                    .custom-blog-content a, 
                                    .custom-blog-content li,
                                    .custom-blog-content h1, 
                                    .custom-blog-content h2, 
                                    .custom-blog-content h3, 
                                    .custom-blog-content h4 {
                                        background-color: transparent !important;
                                    }
                                    /* Ensure text colors don't stay black from pasted formatting in dark mode */
                                    .custom-blog-content span[style*="color"],
                                    .custom-blog-content p[style*="color"],
                                    .custom-blog-content div[style*="color"] {
                                        color: inherit !important;
                                    }
                                `}} />

                                {/* Bottom Share / CTA Box */}
                                <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                        <span>Found this story helpful?</span>
                                    </div>

                                    <Link
                                        href="/courses"
                                        className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all inline-flex items-center gap-2"
                                    >
                                        <span>Explore Matching University Courses</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </article>

                            {/* RIGHT COLUMN: STACKED EXPERT CONSULTATION FORM */}
                            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
                                    
                                    {/* Gradient Header Banner */}
                                    <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 p-6 text-white">
                                        <h3 className="text-xl font-extrabold tracking-tight">
                                            Talk to our experts
                                        </h3>
                                        <p className="text-xs text-purple-200 mt-1">
                                            Get a free consultation today
                                        </p>
                                    </div>

                                    {/* Form Body */}
                                    <div className="p-6">
                                        {isSubmitted ? (
                                            <div className="py-8 text-center space-y-3">
                                                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                                    Request Received!
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                                    Thank you! A dedicated education counselor will contact you within 24 hours.
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsSubmitted(false)}
                                                    className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                                                >
                                                    Submit another inquiry
                                                </button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                                
                                                {/* First Name */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        First name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        placeholder="Jane"
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {/* Last Name */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        Last name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        placeholder="Doe"
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {/* Email Address */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        Email address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="jane@email.com"
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {/* Country of Residence */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        Country of residence *
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                    >
                                                        <option value="">Select country</option>
                                                        <option value="Nigeria">Nigeria</option>
                                                        <option value="Bangladesh">Bangladesh</option>
                                                        <option value="India">India</option>
                                                        <option value="Ghana">Ghana</option>
                                                        <option value="Pakistan">Pakistan</option>
                                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                                        <option value="Kenya">Kenya</option>
                                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                                        <option value="United Kingdom">United Kingdom</option>
                                                        <option value="United States">United States</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>

                                                {/* Mobile Number */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        Mobile number *
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={formData.dialCode}
                                                            onChange={(e) => setFormData({ ...formData, dialCode: e.target.value })}
                                                            className="w-28 px-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shrink-0"
                                                        >
                                                            <option value="+234">NG +234</option>
                                                            <option value="+880">BD +880</option>
                                                            <option value="+91">IN +91</option>
                                                            <option value="+233">GH +233</option>
                                                            <option value="+92">PK +92</option>
                                                            <option value="+971">AE +971</option>
                                                            <option value="+254">KE +254</option>
                                                            <option value="+44">UK +44</option>
                                                            <option value="+1">US +1</option>
                                                        </select>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={formData.mobile}
                                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                            placeholder="8012345678"
                                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Study Level */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        Study level *
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.studyLevel}
                                                        onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value })}
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                    >
                                                        <option value="">Select a level</option>
                                                        <option value="Undergraduate">Undergraduate (Bachelor's)</option>
                                                        <option value="Postgraduate">Postgraduate (Master's)</option>
                                                        <option value="Foundation">Foundation / Pathway</option>
                                                        <option value="PhD">PhD / Doctorate</option>
                                                        <option value="Diploma">Diploma / Certificate</option>
                                                    </select>
                                                </div>

                                                {/* Subject of Interest */}
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                                        Subject of interest *
                                                    </label>
                                                    <select
                                                        required
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                    >
                                                        <option value="">Select a subject</option>
                                                        <option value="Computer Science & IT">Computer Science & IT</option>
                                                        <option value="Data Science & AI">Data Science & AI</option>
                                                        <option value="Business & Management">Business & Management</option>
                                                        <option value="Engineering">Engineering (Civil/Mech/Elec)</option>
                                                        <option value="Medicine & Health">Medicine & Health Sciences</option>
                                                        <option value="Law & Legal Studies">Law & Legal Studies</option>
                                                        <option value="Arts & Humanities">Arts, Design & Media</option>
                                                        <option value="Social Sciences">Social Sciences & Economics</option>
                                                    </select>
                                                </div>

                                                {/* Submit Button */}
                                                <div className="pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                                    >
                                                        <span>{isSubmitting ? 'Submitting...' : 'Get Free Consultation'}</span>
                                                    </button>
                                                </div>

                                            </form>
                                        )}
                                    </div>
                                </div>
                            </aside>

                        </div>

                    </div>
                </section>

                {/* 2. RELATED BLOGS / MORE STORIES SECTION */}
                {relatedBlogs.length > 0 && (
                    <section className="py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            
                            <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200/70 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Recommended For You</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        More Insights & Stories
                                    </h2>
                                </div>

                                <Link
                                    href="/blog"
                                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    <span>View All Articles</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {/* 3-Column Grid matching Index design */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedBlogs.map((rel) => {
                                    const relDate = rel.created_at
                                        ? new Date(rel.created_at).toLocaleDateString('en-US', {
                                              month: 'short',
                                              day: 'numeric',
                                              year: 'numeric'
                                          })
                                        : 'Recent Post';

                                    const relImg = rel.image
                                        ? (rel.image.startsWith('http') ? rel.image : rel.image)
                                        : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

                                    const relUrl = typeof route === 'function' ? route('blog.show', rel.slug) : `/blog/${rel.slug}`;

                                    return (
                                        <Link
                                            key={rel.id}
                                            href={relUrl}
                                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/50 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group shadow-xs hover:shadow-xl cursor-pointer"
                                        >
                                            <div className="h-48 w-full relative shrink-0 overflow-hidden bg-slate-900">
                                                <img
                                                    src={relImg}
                                                    alt={rel.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                                {rel.category && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20 shadow-md">
                                                            {rel.category}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{relDate}</span>
                                                </div>

                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                                                    {rel.title}
                                                </h3>

                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                                                    {rel.excerpt || (rel.content ? rel.content.replace(/<[^>]*>?/gm, '').substring(0, 140) + '...' : '')}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500">
                                                    <span className="group-hover:underline">Read More</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="mt-8 text-center sm:hidden">
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400"
                                >
                                    <span>View All Articles</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                        </div>
                    </section>
                )}

            </div>
        </Layout>
    );
}
