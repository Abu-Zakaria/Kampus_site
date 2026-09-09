import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function SuccessStories({ stories = [] }) {
    const defaultStories = [
        {
            id: 1,
            title: 'How Ayesha Secured a £10,000 Scholarship at University of Oxford',
            slug: 'ayesha-oxford-scholarship-success',
            category: 'Scholarship Winner',
            excerpt: 'From initial SOP review to the final visa interview, discover the step-by-step roadmap that helped Ayesha win a prestigious merit scholarship.',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 2,
            title: 'From Dhaka to Harvard: Tanvir’s Full-Ride MBA Acceptance Story',
            slug: 'tanvir-harvard-mba-journey',
            category: 'Ivy League Admission',
            excerpt: 'Read how Tanvir cracked the GMAT 740 and crafted standout leadership essays with our certified Ivy League admissions counselors.',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 3,
            title: '100% Tuition Waiver in Finland: Farhan’s Tech Degree Pathway',
            slug: 'farhan-finland-tuition-waiver',
            category: 'Tuition Waiver',
            excerpt: 'How Farhan landed a 100% tuition waiver at University of Helsinki and brought his family on a residence permit seamlessly.',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        },
        {
            id: 4,
            title: 'Fast-Track Dubai Tech Career: Sarah’s Global University Journey',
            slug: 'sarah-dubai-tech-career-journey',
            category: 'Fast-Track Visa',
            excerpt: 'Sarah received her unconditional offer and student visa in just 7 days to study AI in Dubai with zero income tax prospects.',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        },
    ];

    const displayStories = stories && stories.length > 0 ? stories : defaultStories;

    const scrollerRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);
    const [hasOverflow, setHasOverflow] = useState(false);
    const pauseAuto = useRef(false);

    const updateArrows = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const overflow = el.scrollWidth > el.clientWidth + 4;
        setHasOverflow(overflow);
        setCanPrev(overflow && el.scrollLeft > 4);
        setCanNext(overflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    const cardStep = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return 360;
        const card = el.querySelector('[data-story-card]');
        return card ? card.offsetWidth + 32 : 360;
    }, []);

    const animateScroll = useCallback((targetLeft) => {
        const el = scrollerRef.current;
        if (!el) return;
        const maxLeft = el.scrollWidth - el.clientWidth;
        const clamped = Math.max(0, Math.min(targetLeft, maxLeft));
        const startLeft = el.scrollLeft;
        const delta = clamped - startLeft;

        if (Math.abs(delta) < 1) return;

        const duration = 600;
        let startTime = null;

        const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        if (el._storyAnimId) {
            cancelAnimationFrame(el._storyAnimId);
            el._storyAnimId = null;
        }

        const stepFn = (now) => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            el.scrollLeft = startLeft + delta * easeInOutCubic(progress);
            updateArrows();
            if (progress < 1) {
                el._storyAnimId = requestAnimationFrame(stepFn);
            } else {
                el._storyAnimId = null;
            }
        };

        el._storyAnimId = requestAnimationFrame(stepFn);
    }, [updateArrows]);

    const scrollByCard = useCallback((dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        animateScroll(el.scrollLeft + dir * cardStep());
    }, [animateScroll, cardStep]);

    const handlePrev = () => scrollByCard(-1);
    const handleNext = () => scrollByCard(1);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        updateArrows();
        el.addEventListener('scroll', updateArrows, { passive: true });
        const resize = new ResizeObserver(updateArrows);
        resize.observe(el);
        return () => {
            el.removeEventListener('scroll', updateArrows);
            resize.disconnect();
        };
    }, [updateArrows]);

    useEffect(() => {
        const id = setInterval(() => {
            const el = scrollerRef.current;
            if (!el || el.matches(':hover') || pauseAuto.current) return;
            if (el._storyAnimId) return;
            if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
                animateScroll(0);
            } else {
                animateScroll(el.scrollLeft + cardStep());
            }
        }, 3000);
        return () => clearInterval(id);
    }, [animateScroll, cardStep]);

    return (
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 transition-colors overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                
                {/* SECTION HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3 max-w-2xl text-left">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Student Success Stories
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 text-base">
                            Real students, real admissions, and prestigious scholarships achieved through our personalized global mentorship.
                        </p>
                    </div>

                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group shrink-0"
                    >
                        <span>Explore all stories & guides</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

            </div>

            {/* SUCCESS STORIES CAROUSEL WITH PREV / NEXT CONTROLS */}
            <div className="relative">
                <div
                    ref={scrollerRef}
                    className="flex overflow-x-auto scroll-smooth py-6 px-4 sm:px-6 lg:px-8 scrollbar-hide"
                >
                    {displayStories.map((story, i) => (
                        <div
                            key={story.id || i}
                            data-story-card
                            className="w-[340px] sm:w-[360px] shrink-0 mx-4 group relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 p-5 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between text-left"
                        >
                            <div>
                                {/* Top Image Banner with Category Badge */}
                                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 mb-4">
                                    <img
                                        src={story.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'}
                                        alt={story.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                                    
                                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                                        {story.category || 'Success Story'}
                                    </span>
                                </div>

                                {/* Title (2 lines clamp) */}
                                <h3 className="line-clamp-2 text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                    {story.title}
                                </h3>

                                {/* Excerpt (3 lines clamp) */}
                                <p className="line-clamp-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2.5">
                                    {story.excerpt || story.content?.substring(0, 140) + '...'}
                                </p>
                            </div>

                            {/* Read Full Story Button */}
                            <div className="pt-5 mt-4 border-t border-slate-200 dark:border-slate-700/80">
                                <Link
                                    href={`/blog/${story.slug}`}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors cursor-pointer"
                                >
                                    <span>Read Full Story</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!canPrev}
                    aria-label="Previous stories"
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 dark:disabled:hover:bg-slate-800 dark:disabled:hover:text-slate-200 ${hasOverflow ? '' : 'hidden'}`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canNext}
                    aria-label="Next stories"
                    className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 dark:disabled:hover:bg-slate-800 dark:disabled:hover:text-slate-200 ${hasOverflow ? '' : 'hidden'}`}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

        </section>
    );
}
