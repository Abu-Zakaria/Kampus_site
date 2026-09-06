import React, { useState } from 'react';
import {
    Sparkles,
    X,
    ChevronLeft,
    CheckCircle2,
    Building2,
    MapPin,
    Clock,
    DollarSign,
    Calendar,
    Send,
    Loader2,
    RotateCcw,
    Award,
    BookOpen,
    GraduationCap,
    Globe,
    ArrowRight
} from 'lucide-react';

export default function AiCourseMatcher({ isOpen, onClose }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    
    // 6-step user answers
    const [answers, setAnswers] = useState({
        destination: '',
        level: '',
        field: '',
        budget: '',
        start_date: '',
        english_status: '',
    });

    // Lead capture form in Step 7
    const [leadForm, setLeadForm] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [isSubmittingLead, setIsSubmittingLead] = useState(false);
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    // Helper: Select an option and auto-advance to next step
    const handleSelectOption = async (fieldKey, value) => {
        const updatedAnswers = { ...answers, [fieldKey]: value };
        setAnswers(updatedAnswers);

        // If at step 6, fetch AI matching results and advance to step 7
        if (step === 6) {
            setIsLoading(true);
            setErrorMessage('');
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                const response = await fetch('/api/course-matcher', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                    },
                    body: JSON.stringify(updatedAnswers),
                });

                if (!response.ok) throw new Error('Failed to match courses');
                const data = await response.json();
                setResults(data.results || []);
                setStep(7);
            } catch (err) {
                console.error(err);
                setErrorMessage('Unable to load AI course matches right now. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setStep((prev) => prev + 1);
        }
    };

    // Reset matcher
    const handleReset = () => {
        setStep(1);
        setAnswers({
            destination: '',
            level: '',
            field: '',
            budget: '',
            start_date: '',
            english_status: '',
        });
        setResults([]);
        setLeadSubmitted(false);
        setErrorMessage('');
    };

    // Lead form submission
    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingLead(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const payload = {
                ...leadForm,
                ...answers,
                results_count: results.length,
            };

            const response = await fetch('/api/course-matcher-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to submit shortlist request');
            setLeadSubmitted(true);
        } catch (err) {
            console.error(err);
            alert('Failed to send shortlist request. Please check your connection.');
        } finally {
            setIsSubmittingLead(false);
        }
    };

    // Step configuration & options
    const stepsConfig = {
        1: {
            title: 'Where would you like to study?',
            subtitle: 'Select your preferred international study destination',
            key: 'destination',
            options: [
                { label: 'Anywhere', desc: 'Explore all partner destinations', emoji: '🌍' },
                { label: 'United Kingdom', desc: '150+ Top Tier Universities', badge: 'GB' },
                { label: 'Canada', desc: 'PR Pathways & Work Permits', badge: 'CA' },
                { label: 'United States', desc: 'Ivy League & STEM OPT Programs', badge: 'US' },
                { label: 'Australia', desc: 'Top 100 Universities & High Wages', badge: 'AU' },
            ],
        },
        2: {
            title: 'What level of study are you looking for?',
            subtitle: 'Choose the degree qualification you wish to pursue',
            key: 'level',
            options: [
                { label: 'Not sure yet', desc: 'Help me choose the right path' },
                { label: 'Foundation', desc: 'Pre-university / Pathway preparation' },
                { label: 'Undergraduate', desc: "Bachelor's Degree (3-4 Years)" },
                { label: 'Postgraduate', desc: "Master's Degree / MBA (1-2 Years)" },
                { label: 'PhD', desc: 'Doctorate / Research Fellowship' },
            ],
        },
        3: {
            title: 'What field or subject interests you most?',
            subtitle: 'Select your intended academic discipline or domain',
            key: 'field',
            options: [
                { label: 'Business', desc: 'Management, Finance, MBA & Marketing' },
                { label: 'Engineering', desc: 'Civil, Mechanical, Electrical, Robotics' },
                { label: 'Economics', desc: 'Applied Economics, Banking & Analytics' },
                { label: 'Arts & Design', desc: 'Fine Arts, UI/UX, Media & Architecture' },
                { label: 'Law', desc: 'LLM, International Law & Corporate Governance' },
                { label: 'Medicine', desc: 'Biomedicine, Public Health & Nursing' },
                { label: 'Computer Science', desc: 'AI, Data Science, Cyber & Software' },
                { label: 'Not sure', desc: 'Browse all multidisciplinary programs' },
            ],
        },
        4: {
            title: 'What is your approximate annual tuition budget?',
            subtitle: 'Select an estimated annual tuition fee range',
            key: 'budget',
            options: [
                { label: 'Under £15,000/year', desc: 'Affordable tuition options' },
                { label: '£15,000 - £25,000/year', desc: 'Standard international university range' },
                { label: '£25,000 - £35,000/year', desc: 'Mid-to-high tier global universities' },
                { label: '£35,000+/year', desc: 'Premium Ivy League & Russell Group institutions' },
                { label: 'Flexible / not sure yet', desc: 'Explore with full scholarship opportunities' },
            ],
        },
        5: {
            title: 'When are you planning to start your studies?',
            subtitle: 'Choose your anticipated enrollment intake window',
            key: 'start_date',
            options: [
                { label: 'As soon as possible', desc: 'Upcoming next available intake' },
                { label: 'Within 6 months', desc: 'Spring / Summer 2026' },
                { label: 'Next year', desc: 'Autumn / Fall 2026 / 2027' },
                { label: 'Just exploring for now', desc: 'Gathering preliminary information' },
            ],
        },
        6: {
            title: 'What is your current English language test status?',
            subtitle: 'Our advisors also provide test waiver guidance',
            key: 'english_status',
            options: [
                { label: 'I already have IELTS/TOEFL/PTE', desc: 'Ready with valid official score' },
                { label: 'Exempt', desc: 'Studied in English or native speaker' },
                { label: 'I still need to take a test', desc: 'Planning to prepare or take exam soon' },
                { label: 'Not sure what is required', desc: 'Need guidance on MOI or waiver rules' },
            ],
        },
    };

    const currentConfig = stepsConfig[step];
    const progressPercent = Math.round((step / 6) * 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full text-slate-900 dark:text-slate-100 shadow-2xl overflow-hidden flex flex-col relative my-auto transition-colors duration-200">
                
                {/* 1. TOP HEADER & PROGRESS BAR */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            {step > 1 && step <= 6 && !isLoading && (
                                <button
                                    onClick={() => setStep((prev) => prev - 1)}
                                    className="p-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors mr-1 cursor-pointer"
                                    title="Go back"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                                <span>AI Course Matcher</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {step === 7 && (
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-colors cursor-pointer font-medium"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Start Over</span>
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl bg-slate-200/60 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    {step <= 6 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">Step {step} of 6</span>
                                <span className="font-semibold text-slate-600 dark:text-slate-300">{progressPercent}% Completed</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. MODAL BODY (STEPS 1 to 6 or LOADING or STEP 7) */}
                <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    
                    {/* LOADING STATE */}
                    {isLoading && (
                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-500 animate-spin" />
                                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Matching Courses with AI...</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                    Analyzing thousands of accredited degree programs based on your destination, level, and preferences.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* QUESTIONS (STEPS 1 - 6) */}
                    {!isLoading && step <= 6 && currentConfig && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {currentConfig.title}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                                    {currentConfig.subtitle}
                                </p>
                            </div>

                            {errorMessage && (
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                                    {errorMessage}
                                </div>
                            )}

                            {/* OPTIONS GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {currentConfig.options.map((opt, idx) => {
                                    const isSelected = answers[currentConfig.key] === opt.label;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => handleSelectOption(currentConfig.key, opt.label)}
                                            className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                                                isSelected
                                                    ? 'bg-indigo-50/80 dark:bg-indigo-600/20 border-indigo-500 text-slate-900 dark:text-white shadow-md shadow-indigo-500/10'
                                                    : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/90 dark:border-slate-700/60 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 text-slate-800 dark:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                {opt.emoji && (
                                                    <span className="text-2xl shrink-0">{opt.emoji}</span>
                                                )}
                                                {opt.badge && (
                                                    <span className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-extrabold text-xs flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600">
                                                        {opt.badge}
                                                    </span>
                                                )}
                                                <div className="min-w-0">
                                                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                                        {opt.label}
                                                    </div>
                                                    {opt.desc && (
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                                                            {opt.desc}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-3 ${
                                                isSelected
                                                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-600 text-white'
                                                    : 'border-slate-300 dark:border-slate-600 group-hover:border-indigo-400 text-transparent'
                                            }`}>
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* RESULTS VIEW (STEP 7) */}
                    {!isLoading && step === 7 && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            
                            {/* Heading & Tags */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        Your Top Matches
                                    </h2>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Based on your personalized profile, our AI selected these top accredited programmes:
                                </p>

                                {/* Selected Preferences Badges */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {answers.destination && (
                                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5" />
                                            {answers.destination}
                                        </span>
                                    )}
                                    {answers.level && (
                                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                            <GraduationCap className="w-3.5 h-3.5" />
                                            {answers.level}
                                        </span>
                                    )}
                                    {answers.field && (
                                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {answers.field}
                                        </span>
                                    )}
                                    {answers.budget && (
                                        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            {answers.budget}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* MATCHED COURSES LIST */}
                            <div className="space-y-4">
                                {results && results.length > 0 ? (
                                    results.map((course, idx) => (
                                        <div
                                            key={course.id || idx}
                                            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                                        >
                                            <div className="flex items-start sm:items-center gap-4">
                                                {/* Circular Match Percentage */}
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/30 border border-indigo-400/30">
                                                    <span className="text-base font-black leading-none">
                                                        {course.match_percentage || 95}%
                                                    </span>
                                                    <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                                                        Match
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                            <Building2 className="w-3.5 h-3.5" />
                                                            {course.university?.name || 'Partner University'}
                                                        </span>
                                                        <span className="text-slate-400">•</span>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 text-blue-500" />
                                                            {course.university?.country?.name || course.university?.location || 'International'}
                                                        </span>
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                                                            {course.level || 'Degree'}
                                                        </span>
                                                    </div>

                                                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                                                        {course.title}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                            {course.duration || 'Full-Time'}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                                                            <DollarSign className="w-3.5 h-3.5" />
                                                            {course.show_tuition_fee !== false ? (course.tuition_fee || 'Tuition on request') : 'Tuition on request'}
                                                        </span>
                                                        {course.intake && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                    {course.intake}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onClose();
                                                    window.dispatchEvent(new CustomEvent('open-book-call-modal'));
                                                }}
                                                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 group transition-all shrink-0 cursor-pointer"
                                            >
                                                <span>Enquire</span>
                                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/40 text-center text-slate-500 dark:text-slate-400 text-sm">
                                        No exact course matches found for the strict combination. Our counselors will manually assist you.
                                    </div>
                                )}
                            </div>

                            {/* LEAD CAPTURE FORM: "Want this shortlist emailed to you?" */}
                            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/40 border border-indigo-200/80 dark:border-indigo-500/30 shadow-xl space-y-4">
                                {leadSubmitted ? (
                                    <div className="py-4 text-center space-y-2 animate-in fade-in">
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Shortlist Sent Successfully!</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                                            We have emailed your curated shortlist with scholarship details and entry requirements. A senior adviser will contact you soon!
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-1">
                                            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                                <Send className="w-3.5 h-3.5" />
                                                <span>Direct Delivery</span>
                                            </div>
                                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                                Want this shortlist emailed to you?
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Receive full course syllabi, scholarship eligibility, and step-by-step visa guidelines directly to your email.
                                            </p>
                                        </div>

                                        <form onSubmit={handleLeadSubmit} className="space-y-3 pt-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Your Full Name *"
                                                    value={leadForm.name}
                                                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                />
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="Your Email Address *"
                                                    value={leadForm.email}
                                                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone / WhatsApp (Optional)"
                                                    value={leadForm.phone}
                                                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmittingLead}
                                                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                                            >
                                                {isSubmittingLead ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Sending Shortlist...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        <span>Email me my shortlist</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
