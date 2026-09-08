import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Sparkles,
    ArrowRight,
    PhoneCall,
    Award,
    Users,
    Star,
    CheckCircle2,
    Search,
    GraduationCap,
    Send,
    X,
    Globe,
    Check
} from 'lucide-react';

/**
 * AnimatedCounter: smoothly animates numbers up from 0 to target when visible in viewport.
 */
function AnimatedCounter({ value, duration = 1600 }) {
    const [display, setDisplay] = useState(() => {
        const str = String(value || '').trim();
        const match = str.match(/^([^0-9]*)([\d,.]+)(.*)$/);
        if (match) {
            return `${match[1] || ''}0${match[3] || ''}`;
        }
        return str;
    });

    const ref = useRef(null);
    const animatedRef = useRef(false);

    useEffect(() => {
        const str = String(value || '').trim();
        const match = str.match(/^([^0-9]*)([\d,.]+)(.*)$/);
        if (!match) {
            setDisplay(str);
            return;
        }

        const prefix = match[1] || '';
        const targetNum = parseFloat(match[2].replace(/,/g, '')) || 0;
        const suffix = match[3] || '';
        const isMillionOrDecimal = suffix.toUpperCase().includes('M') || match[2].includes('.');

        animatedRef.current = false;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !animatedRef.current) {
                    animatedRef.current = true;
                    const startTime = performance.now();

                    const animate = (now) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Out-cubic easing for smooth deceleration
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const current = ease * targetNum;

                        if (progress < 1) {
                            let formatted;
                            if (isMillionOrDecimal && targetNum <= 20) {
                                formatted = current.toFixed(1);
                            } else {
                                formatted = Math.floor(current).toLocaleString();
                            }
                            setDisplay(`${prefix}${formatted}${suffix}`);
                            requestAnimationFrame(animate);
                        } else {
                            setDisplay(`${prefix}${targetNum.toLocaleString()}${suffix}`);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.15 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, duration]);

    return <span ref={ref}>{display}</span>;
}

export default function HeroSection({ onOpenAiSearch, onOpenBookCall, content = {}, countries = [], totalCountriesCount = 0, totalUniversitiesCount = 0 }) {
    const { props } = usePage();
    const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

    // 100% Dynamic database counts: directly updates whenever admin adds/removes countries or universities
    const dynamicCountriesCount = totalCountriesCount
        || props?.totalCountriesCount
        || props?.globalCountriesCount
        || props?.globalCountries?.length
        || countries?.length
        || 15;

    const dynamicUniversitiesCount = totalUniversitiesCount
        || props?.totalUniversitiesCount
        || props?.globalUniversitiesCount
        || 38;

    const heading = content?.hero_heading || 'Building global futures, from dreams to degrees.';
    const subtitle = content?.hero_subtitle || 'Expert, unbiased guidance to top universities across the UK, USA, Finland and Dubai, completely free.';
    const rawBadgeText = content?.badge_text || content?.hero?.badge || '';
    const badgeText = (rawBadgeText === 'OFFICIAL BRITISH COUNCIL & ICEF PARTNER' || rawBadgeText === 'ICEF & British Council Certified Guidance')
        ? ''
        : rawBadgeText;

    const rawHeroImage = content?.hero_image || content?.hero?.image || content?.hero_banner_image;
    const globalHeroImage = props?.globalSettings?.home_hero_image;
    const resolvedGlobalHero = (globalHeroImage && typeof globalHeroImage === 'string' && globalHeroImage.trim() !== '')
        ? (globalHeroImage.startsWith('http') || globalHeroImage.startsWith('/') ? globalHeroImage : `/storage/${globalHeroImage}`)
        : null;

    // Check if hero image is explicitly removed (hero_image is null or empty in content)
    const isExplicitlyRemoved = (content && ('hero_image' in content) && !content.hero_image);

    const heroImage = isExplicitlyRemoved ? null : (resolvedGlobalHero || rawHeroImage || null);

    const overlayOpacityVal = content?.hero_overlay_opacity !== undefined && content?.hero_overlay_opacity !== null && content?.hero_overlay_opacity !== ''
        ? Math.max(15, Math.min(95, parseInt(content.hero_overlay_opacity, 10)))
        : 75;

    const stats = [
        {
            value: `${dynamicCountriesCount}+`,
            unit: 'Destinations',
            label: content?.stat_countries_label || 'countries',
            icon: Globe,
            color: 'from-emerald-500 to-teal-600',
            textColor: 'text-emerald-600 dark:text-emerald-400'
        },
        {
            value: `${dynamicUniversitiesCount}+`,
            unit: 'Partners',
            label: 'global universities',
            icon: Award,
            color: 'from-blue-500 to-indigo-600',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            value: content?.stat_scholarships || '$5M+',
            unit: 'Funding',
            label: 'scholarships awarded',
            icon: Star,
            color: 'from-amber-400 to-orange-500',
            textColor: 'text-amber-500 dark:text-amber-400'
        },
        {
            value: content?.stat_acceptance || '98%',
            unit: 'Visa Success',
            label: 'approval rate',
            icon: Users,
            color: 'from-indigo-500 to-purple-600',
            textColor: 'text-indigo-600 dark:text-indigo-400'
        }
    ];

    const DEFAULT_HERO_SLIDES = [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    ];

    // Dedicated standalone hero slideshow images (completely unlinked from countries & universities)
    const rawSlideshowSetting = props?.globalSettings?.hero_slideshow_images || content?.hero_slideshow_images;
    let configuredSlides = [];
    if (rawSlideshowSetting) {
        if (Array.isArray(rawSlideshowSetting)) {
            configuredSlides = rawSlideshowSetting;
        } else if (typeof rawSlideshowSetting === 'string') {
            try {
                const parsed = JSON.parse(rawSlideshowSetting);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    configuredSlides = parsed;
                }
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }

    const heroSlides = configuredSlides.length > 0 ? configuredSlides : DEFAULT_HERO_SLIDES;
    const totalSlides = heroSlides.length;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [exitingSlide, setExitingSlide] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const goToSlide = (idx) => {
        if (idx === currentSlide || isFlipping) return;
        setExitingSlide(currentSlide);
        setCurrentSlide(idx);
        setIsFlipping(true);

        setTimeout(() => {
            setExitingSlide(null);
            setIsFlipping(false);
        }, 450);
    };

    const handleCardClick = (idx, isActive, isExiting) => {
        if (isExiting || isActive) return;
        goToSlide(idx);
    };

    // Auto-advance slideshow every 5 seconds with pause on hover
    useEffect(() => {
        if (isPaused || totalSlides <= 1) return;
        const timer = setInterval(() => {
            if (!isFlipping) {
                goToSlide((currentSlide + 1) % totalSlides);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [isPaused, totalSlides, currentSlide, isFlipping]);

    return (
        <section className={`relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 transition-colors ${
            heroImage ? 'bg-slate-950 text-white' : 'bg-slate-50 dark:bg-slate-950'
        }`}>
            {/* 1. HERO BACKGROUND IMAGE (IF CONFIGURED FROM CMS) */}
            {heroImage && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* The Background Photo */}
                    <img
                        src={heroImage}
                        alt="Campus & University Hero Banner"
                        className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />

                    {/* Dark Multi-Stop Gradient Scrim for Legibility */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/70"
                        style={{ opacity: overlayOpacityVal / 100 }}
                    />

                    {/* Subtle Vertical Fade Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/90 pointer-events-none" />

                    {/* Ambient Glow Orbs over banner */}
                    <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/25 rounded-full blur-[130px] pointer-events-none" />
                    <div className="absolute top-[100px] right-[-100px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
                </div>
            )}

            {/* Ambient Background Blur Patterns (default when no hero image) */}
            {!heroImage && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden">
                    <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-500/15 dark:bg-blue-600/20 rounded-full blur-[120px]" />
                    <div className="absolute top-[100px] right-[-100px] w-[450px] h-[450px] bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-[140px]" />
                    <div className="absolute top-[250px] left-[30%] w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[100px]" />
                </div>
            )}

            {/* Subtle Grid Lines Overlay */}
            <div className={`absolute inset-0 ${
                heroImage
                    ? 'bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)]'
                    : 'bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]'
            } bg-[size:36px_36px] pointer-events-none`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* LEFT COLUMN: HERO CONTENT */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        
                        {/* Top Badge */}
                        {badgeText && (
                            <div>
                                <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    heroImage
                                        ? 'bg-white/15 text-blue-200 border border-white/20 backdrop-blur-md shadow-xs'
                                        : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80'
                                }`}>
                                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                    <span>{badgeText}</span>
                                </span>
                            </div>
                        )}

                        {/* Main Headline */}
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${
                            heroImage ? 'text-white drop-shadow-xs' : 'text-slate-900 dark:text-white'
                        }`}>
                            {heading}
                        </h1>

                        {/* Subtitle */}
                        <p className={`text-lg sm:text-xl leading-relaxed font-normal max-w-2xl ${
                            heroImage ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                            {subtitle}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                            <button
                                onClick={() => setAssessmentModalOpen(true)}
                                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>Get Free Assessment</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={onOpenBookCall}
                                className={`px-7 py-3.5 rounded-full font-semibold text-base flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                                    heroImage
                                        ? 'bg-white/15 hover:bg-white/25 text-white border-2 border-white/30 backdrop-blur-md hover:border-white/50'
                                        : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500'
                                }`}
                            >
                                <PhoneCall className="w-5 h-5 text-blue-400" />
                                <span>Book a Call</span>
                            </button>
                        </div>

                        {/* Trust Micro-bullets */}
                        <div className={`pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-medium ${
                            heroImage ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                        }`}>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Zero Service Charge</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Fast 48-Hour Offer Letter</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>100% Visa File Review</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: 3D STACK / LAYERED ANIMATED COUNTRY CARDS SLIDESHOW */}
                    <div
                        className="lg:col-span-5 relative flex flex-col justify-center select-none"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* 3D Stack Deck Stage - Compact height and generous width for peeking background cards */}
                        <div className="relative w-full h-[310px] sm:h-[330px] max-w-[420px] mx-auto">
                            {heroSlides.map((slide, idx) => {
                                const isExiting = idx === exitingSlide;
                                const offset = (idx - currentSlide + totalSlides) % totalSlides;
                                const isActive = offset === 0 && !isExiting;
                                const isBehind1 = offset === 1 && !isExiting;
                                const isBehind2 = offset === 2 && !isExiting;

                                let zIndex = 0;
                                let opacity = 0;
                                let pointerEvents = 'none';
                                let transform = 'translate3d(90px, 50px, 0) scale(0.85)';
                                let transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease, box-shadow 400ms ease';

                                if (isExiting) {
                                    // Front card drops DOWN and vanishes rapidly!
                                    transform = 'translate3d(0, 90%, 0) scale(0.95)';
                                    zIndex = 40;
                                    opacity = 0;
                                    pointerEvents = 'none';
                                    transition = 'transform 320ms cubic-bezier(0.4, 0, 1, 1), opacity 180ms ease-in';
                                } else if (isActive) {
                                    // Incoming card slides UP to the front position!
                                    transform = 'translate3d(0, 0, 0) scale(1)';
                                    zIndex = 30;
                                    opacity = 1;
                                    pointerEvents = 'auto';
                                    transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out';
                                } else if (isBehind1) {
                                    // 1st background card: sits slightly right and lower
                                    transform = 'translate3d(36px, 18px, 0) scale(0.95)';
                                    zIndex = 20;
                                    opacity = 0.92;
                                    pointerEvents = 'auto';
                                    transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out';
                                } else if (isBehind2) {
                                    // 2nd background card: sits further right and lower
                                    transform = 'translate3d(70px, 36px, 0) scale(0.90)';
                                    zIndex = 10;
                                    opacity = 0.82;
                                    pointerEvents = 'auto';
                                    transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out';
                                }

                                const rawSrc = typeof slide === 'string' ? slide : (slide?.image || slide?.url || '');
                                const resolvedSrc = (rawSrc.startsWith('http') || rawSrc.startsWith('/')) ? rawSrc : `/storage/${rawSrc}`;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleCardClick(idx, isActive, isExiting)}
                                        className={`absolute top-0 left-0 w-[80%] sm:w-[82%] h-[260px] sm:h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border select-none ${
                                            heroImage
                                                ? 'border-white/25 bg-slate-900'
                                                : 'border-slate-200/80 dark:border-slate-700/80 bg-slate-950'
                                        } ${
                                            isActive
                                                ? 'shadow-2xl shadow-blue-600/30 ring-1 ring-white/30 cursor-default'
                                                : isExiting
                                                ? 'shadow-2xl shadow-black/40 cursor-default'
                                                : 'cursor-pointer hover:border-blue-400 hover:brightness-110 hover:shadow-2xl hover:shadow-blue-500/25'
                                        }`}
                                        style={{
                                            zIndex,
                                            opacity,
                                            pointerEvents,
                                            transform,
                                            transition,
                                            willChange: 'transform, opacity'
                                        }}
                                        title={!isActive && !isExiting ? 'Click to bring card forward' : undefined}
                                    >
                                        {/* Slideshow Card Image */}
                                        <div className="w-full h-full bg-slate-950 overflow-hidden">
                                            <img
                                                src={resolvedSrc}
                                                alt={`Hero Slide ${idx + 1}`}
                                                className={`w-full h-full object-cover transition-transform duration-700 ${
                                                    isActive ? 'hover:scale-105' : ''
                                                }`}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* BOTTOM STATS STRIP */}
                <div className={`mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t ${
                    heroImage ? 'border-white/15' : 'border-slate-200/80 dark:border-slate-800/80'
                }`}>
                    {stats.map((st, i) => {
                        const IconComp = st.icon;
                        return (
                            <div
                                key={i}
                                className={`p-5 rounded-2xl border shadow-xs flex items-center gap-4 transition-all group ${
                                    heroImage
                                        ? 'bg-slate-900/70 hover:bg-slate-900/90 border-white/15 hover:border-white/30 backdrop-blur-md shadow-lg shadow-black/20'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                            >
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${st.color} text-white shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                                    <IconComp className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={`text-2xl font-extrabold tracking-tight ${
                                        heroImage ? 'text-white' : 'text-slate-900 dark:text-white'
                                    }`}>
                                        <AnimatedCounter value={st.value} />
                                    </div>
                                    <div className={`text-xs font-medium ${
                                        heroImage ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                    }`}>
                                        {st.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* FREE ELIGIBILITY ASSESSMENT MODAL */}
            {assessmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                        <button
                            onClick={() => setAssessmentModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Quick Eligibility Check</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Get personalized university options in 24 hours</p>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); alert('Assessment submitted! Our counselors will reach out to you within 24 hours.'); setAssessmentModalOpen(false); }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Hasanuzzaman Priyam"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+880 1812713814"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Highest Academic Qualification</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                    <option value="HSC/A-Level">HSC / A-Level / High School</option>
                                    <option value="Bachelor">Bachelor Degree (Graduate)</option>
                                    <option value="Masters">Masters Degree</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-md hover:scale-[1.01] transition-transform cursor-pointer"
                            >
                                Submit Free Assessment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
