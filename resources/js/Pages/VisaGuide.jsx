import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';
import JourneyProcess from '../Components/JourneyProcess';
import FaqSection from '../Components/FaqSection';
import {
    FileCheck,
    Clock,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Building2,
    Calendar,
    Briefcase
} from 'lucide-react';
import DynamicPageSections from '../Components/DynamicPageSections';

export default function VisaGuide({ page = null }) {
    const metaTitle = page?.meta_title || 'Student Visa Guide & Requirements —  RMS Global Education';
    const metaDescription = page?.meta_description || 'Comprehensive requirements, checklists, and processing timelines for UK Student Visas, US F-1, and European Study Permits.';
    const metaKeywords = page?.meta_keywords || 'student visa guide, UKVI requirements, CAS deposit, US F1 visa checklist';

    const heroHeading = page?.content?.hero_heading || page?.content?.hero?.title;
    const heroSubtitle = page?.content?.hero_subtitle || page?.content?.hero?.subtitle;

    // Resolve hero image with fallback handling
    const rawHeroImage = page?.content?.hero_image || page?.content?.hero?.image || page?.content?.hero_banner_image || '';
    const heroImage = (rawHeroImage && typeof rawHeroImage === 'string' && rawHeroImage.trim().length > 0)
        ? (rawHeroImage.startsWith('http') || rawHeroImage.startsWith('/') ? rawHeroImage : `/storage/${rawHeroImage}`)
        : null;

    const overlayOpacity = page?.content?.hero_overlay_opacity !== undefined && page?.content?.hero_overlay_opacity !== null && page?.content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(page.content.hero_overlay_opacity, 10)))
        : 75;

    const defaultVisaData = {
        UK: {
            country: 'United Kingdom',
            flag: '🇬🇧',
            visaType: 'Student Visa (formerly Tier 4)',
            casFee: 'CAS Deposit (varies)',
            ihsFee: '£776 / year (Health Surcharge)',
            visaFee: '£490 (Outside UK)',
            processingTime: '3 - 4 Weeks (Priority 5 Days)',
            checklist: [
                'Valid Passport (at least 6 months validity)',
                'CAS (Confirmation of Acceptance for Studies) from University',
                'Bank Statement (28 days holding period proof)',
                'TB Test Certificate (from approved clinic)',
                'Academic Certificates & IELTS / Medium of Instruction Letter',
                'ATAS Clearance Certificate (if applicable for STEM subjects)'
            ],
            steps: [
                { step: '01', title: 'Get Unconditional Offer & CAS', desc: 'Secure your university admission and pay the required deposit to obtain your CAS statement.' },
                { step: '02', title: 'Prepare 28-Day Financial Proof', desc: 'Maintain required tuition fee balance + £1,334/month living costs (London) in your bank for 28 consecutive days.' },
                { step: '03', title: 'Pay Visa Fee & IHS Online', desc: 'Complete the UKVI online visa application, pay the Immigration Health Surcharge and visa fee.' },
                { step: '04', title: 'Biometrics & Passport Submission', desc: 'Attend your appointment at VFS Global / TLScontact for fingerprinting, photo, and document submission.' }
            ]
        },
        USA: {
            country: 'United States',
            flag: '🇺🇸',
            visaType: 'F-1 Academic Student Visa',
            casFee: 'SEVIS I-901 Fee ($350)',
            ihsFee: 'Health Insurance (Required)',
            visaFee: '$185 (MRV Fee)',
            processingTime: '2 - 6 Weeks (Embassy Slot Dependent)',
            checklist: [
                'Valid Passport & Form I-20 issued by US University',
                'SEVIS I-901 Fee Payment Receipt ($350)',
                'DS-160 Online Nonimmigrant Visa Application Confirmation Page',
                'Bank Financial Statement & Affidavit of Support',
                'Academic Transcripts, SAT/GRE/TOEFL/IELTS Score Reports',
                'Standardized Interview Appointment Confirmation Sheet'
            ],
            steps: [
                { step: '01', title: 'Receive Form I-20', desc: 'Accept your admission offer and submit financial verification to get your university I-20 document.' },
                { step: '02', title: 'Pay SEVIS I-901 Fee', desc: 'Pay the mandatory $350 SEVIS fee online at fmjfee.com and save the receipt.' },
                { step: '03', title: 'Complete DS-160 & Schedule Interview', desc: 'Fill out DS-160 form online, pay MRV fee, and book your US Embassy visa interview date.' },
                { step: '04', title: 'US Embassy Visa Interview', desc: 'Attend your in-person interview with your I-20, financial documents, and academic credentials.' }
            ]
        },
        Finland: {
            country: 'Finland',
            flag: '🇫🇮',
            visaType: 'First Residence Permit for Studies',
            casFee: 'Tuition Deposit Payment Receipt',
            ihsFee: 'Private Health Insurance (SIP/Swisscare)',
            visaFee: '€350 (Electronic Application)',
            processingTime: '1 - 3 Months',
            checklist: [
                'Valid Passport',
                'Official Acceptance Letter from Finnish University / UAS',
                'Proof of Funds (€6,720 / year living expenses in bank account)',
                'Comprehensive Health Insurance (coverage up to €120,000)',
                'Degree Certificates & Legalized Transcripts',
                'Receipt of Paid Tuition Fee or Scholarship Award Letter'
            ],
            steps: [
                { step: '01', title: 'Accept Offer & Pay Tuition Fee', desc: 'Confirm your study place in Opintopolku and pay tuition fee to receive official acceptance letter.' },
                { step: '02', title: 'Purchase Health Insurance', desc: 'Obtain approved international student health insurance policy covering the entire duration of studies.' },
                { step: '03', title: 'Submit EnterFinland Application', desc: 'Create EnterFinland account, complete residence permit application and upload scanned documents.' },
                { step: '04', title: 'VFS Identification & Biometrics', desc: 'Visit Finnish Embassy / VFS Application Centre to verify original documents and record biometrics.' }
            ]
        },
        Dubai: {
            country: 'Dubai (UAE)',
            flag: '🇦🇪',
            visaType: 'Student Residence Visa',
            casFee: 'University Security Deposit',
            ihsFee: 'UAE Mandatory Medical Insurance',
            visaFee: 'AED 3,000 - 4,500 (Varies by Univ)',
            processingTime: '2 - 3 Weeks (Fast Track 7 Days)',
            checklist: [
                'Valid Passport (at least 6 months validity)',
                'University Admission Offer Letter & Tuition Fee Receipt',
                'Passport Size Photographs (White background)',
                'UAE Medical Fitness Test Clearance (Done in Dubai)',
                'Emirates ID Application Form',
                'Health Insurance Card / Coverage Certificate'
            ],
            steps: [
                { step: '01', title: 'University Entry Permit Application', desc: 'Your university sponsors and applies for your student Entry Permit with UAE Immigration.' },
                { step: '02', title: 'Travel to Dubai on Entry Permit', desc: 'Fly to Dubai using your electronic Entry Permit (valid for 60 days).' },
                { step: '03', title: 'Medical Fitness & Biometrics', desc: 'Undergo blood test, chest X-ray, and Emirates ID biometric scanning at authorized medical centers.' },
                { step: '04', title: 'Emirates ID & Visa Stamping', desc: 'Receive your 1-year renewable UAE Student Residence Visa stamped on your passport and Emirates ID.' }
            ]
        }
    };

    const visaData = page?.content?.visa_destinations || defaultVisaData;
    const [activeTab, setActiveTab] = useState(() => Object.keys(visaData)[0] || 'UK');
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const visaFaqs = [
        {
            question: 'Can I work while studying on a student visa?',
            answer: 'Yes! In the UK, student visa holders can work up to 20 hours per week during term time and full-time during official holiday breaks. In the USA (F-1 visa), on-campus employment up to 20 hours/week is allowed. In Finland, international students can work up to 30 hours per week!'
        },
        {
            question: 'How much bank balance is required for UK student visa?',
            answer: 'You must show funds covering your remaining tuition fee + living expenses for 9 months. For London universities, living cost requirement is £1,334/month (£12,006 total). For outside London, it is £1,023/month (£9,207 total). Funds must be held continuously for at least 28 days.'
        },
        {
            question: 'How long does student visa processing take?',
            answer: 'UK Priority Visas take 5 working days (standard 3 weeks). US F-1 visas are decided on the day of your interview. Finland residence permits take 4 to 8 weeks. Dubai student visas usually take 2 to 3 weeks.'
        },
        {
            question: 'What is the visa success rate with  RMS Global Education?',
            answer: 'Our certified counselors maintain a 98% visa approval rate due to meticulous bank document verification, SOP review, and 1-on-1 mock embassy interview sessions before submission.'
        }
    ];

    const currentVisa = visaData[activeTab] || Object.values(visaData)[0] || defaultVisaData['UK'];

    return (
        <Layout>
            <Head>
                <title>{metaTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta name="keywords" content={metaKeywords} />
                <meta property="og:title" content={metaTitle} />
                <meta property="og:description" content={metaDescription} />
            </Head>

            <div className="w-full flex flex-col space-y-0 selection:bg-blue-600 selection:text-white bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">

                {/* 1. HERO SECTION */}
                <section className={`relative overflow-hidden py-16 lg:py-24 border-b border-slate-200/60 dark:border-slate-800 transition-colors ${
                    heroImage ? 'bg-slate-950 text-white' : 'bg-gradient-to-b from-blue-50/70 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'
                }`}>
                    {/* 1. HERO BANNER IMAGE BACKGROUND */}
                    {heroImage ? (
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            <img
                                src={heroImage}
                                alt="Visa Guide Hero Banner"
                                className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />

                            {/* Dark Scrim with Configurable Opacity */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70"
                                style={{ opacity: overlayOpacity / 100 }}
                            />

                            {/* Subtle Vertical Fade Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

                            {/* Ambient Glow Orbs over banner */}
                            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/25 rounded-full blur-[130px] pointer-events-none" />
                        </div>
                    ) : (
                        /* Background Ambient Glow */
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
                            <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[130px]" />
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto ${
                            heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                        }`}>
                            {heroHeading ? (
                                heroHeading
                            ) : (
                                <>
                                    Stress-free{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                                        visa processing
                                    </span>
                                </>
                            )}
                        </h1>

                        <p className={`text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-normal ${
                            heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                            {heroSubtitle || 'Step-by-step guidance for your UKVI, US F-1, and other student visas with our certified immigration experts.'}
                        </p>
                    </div>
                </section>

                {/* 2. COUNTRY VISA TABS & CONTENT SECTION */}
                <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 transition-colors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* TAB BUTTONS */}
                        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-14 overflow-x-auto pb-2">
                            {Object.keys(visaData).map((countryKey) => {
                                const isActive = activeTab === countryKey;
                                const countryInfo = visaData[countryKey];
                                if (!countryInfo) return null;
                                return (
                                    <button
                                        key={countryKey}
                                        onClick={() => setActiveTab(countryKey)}
                                        className={`px-6 py-3 rounded-full text-sm font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer whitespace-nowrap ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                                            }`}
                                    >
                                        <span className="text-lg">{countryInfo.flag}</span>
                                        <span>{countryInfo.country}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* VISA OVERVIEW HIGHLIGHT CARDS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Visa Type</span>
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{currentVisa.visaType}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Processing Time</span>
                                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{currentVisa.processingTime}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Embassy / Visa Fee</span>
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{currentVisa.visaFee}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block mb-1">Health Surcharge / Ins.</span>
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">{currentVisa.ihsFee}</span>
                            </div>
                        </div>

                        {/* 2-COLUMN LAYOUT: CHECKLIST (LEFT) & PROCESSING TIMELINE (RIGHT) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                            {/* LEFT: DOCUMENT CHECKLIST CARD */}
                            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-7 lg:p-8 space-y-6 shadow-sm">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                        <FileCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Document Checklist
                                        </h3>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Mandatory files for {currentVisa.country}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3.5">
                                    {currentVisa.checklist.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="leading-snug font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                                        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                        <span>Our counselors perform 3-stage document audit before embassy filing.</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: PROCESSING STEPS TIMELINE */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Processing Timeline & Roadmap
                                        </h3>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Follow these steps for a smooth visa grant
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {currentVisa.steps.map((st, i) => (
                                        <div
                                            key={i}
                                            className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 transition-colors flex items-start gap-5"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-extrabold text-lg flex items-center justify-center shrink-0 border border-blue-100 dark:border-slate-700">
                                                {st.step}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                                    {st.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {st.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </section>

                {/* 3. DYNAMIC PAGE BUILDER SECTIONS (IF CONFIGURED IN CMS) */}
                {page?.content?.sections && (
                    <DynamicPageSections sections={page.content.sections} />
                )}

                {/* 4. DYNAMIC VISA FREQUENTLY ASKED QUESTIONS */}
                {(page?.content?.show_faqs !== false && !page?.content?.hide_faqs) && (
                    <FaqSection
                        badge="VISA GUIDANCE & FAQS"
                        title="Frequently Asked Visa & Admission Questions"
                        subtitle="Comprehensive answers regarding visa processing times, financial requirements, IELTS waivers, and work permits."
                    />
                )}

            </div>
        </Layout>
    );
}
