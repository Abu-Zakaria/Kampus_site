import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    Clock,
    Calendar,
    GraduationCap,
    ArrowRight,
    Building2,
    SlidersHorizontal,
    SearchX,
    X,
    RotateCcw,
    CheckCircle2,
    LayoutGrid,
    List
} from 'lucide-react';

export default function CourseList({
    courses = {},
    searchQuery = '',
    selectedLevels = [],
    selectedDestination = 'All',
    sortBy = 'popularity',
    onSortChange,
    onResetFilters
}) {
    const { props } = usePage();
    const currentUser = props?.auth?.user;

    const [viewMode, setViewMode] = useState('grid'); // Default to grid view
    const [selectedCourseModal, setSelectedCourseModal] = useState(null);
    const [applicationSent, setApplicationSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: '',
        notes: ''
    });

    const handleOpenCourseModal = (course) => {
        setSelectedCourseModal(course);
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || currentUser.name || '',
                email: prev.email || currentUser.email || '',
            }));
        }
    };

    const courseList = Array.isArray(courses) ? courses : (courses?.data || []);
    const totalCount = courses?.total ?? courseList.length;

    const hasFilters = Boolean(searchQuery.trim()) || selectedLevels.length > 0 || selectedDestination !== 'All';

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/course-enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    notes: formData.notes,
                    course_id: selectedCourseModal?.id,
                    course_title: selectedCourseModal?.title,
                    university_name: selectedCourseModal?.university?.name,
                    level: selectedCourseModal?.level,
                    duration: selectedCourseModal?.duration,
                    intake: selectedCourseModal?.intake,
                    tuition_fee: selectedCourseModal?.show_tuition_fee !== false
                        ? selectedCourseModal?.tuition_fee
                        : 'Tuition on Request',
                })
            });

            const resData = await response.json();
            if (!response.ok || !resData.success) {
                throw new Error(resData.message || 'Failed to submit enquiry. Please verify your details.');
            }

            setApplicationSent(true);
            setTimeout(() => {
                setApplicationSent(false);
                setSelectedCourseModal(null);
                setFormData({ name: '', email: '', phone: '', notes: '' });
            }, 3000);
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || 'Network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full flex-1 space-y-6">
            
            {/* HEADER: RESULTS COUNT & VIEW TOGGLE & SORT BY DROPDOWN */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        {totalCount}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {totalCount === 1 ? 'course available' : 'courses available'}
                    </span>
                    {searchQuery && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-800/60">
                            "{searchQuery}"
                        </span>
                    )}
                    {selectedDestination !== 'All' && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200/60 dark:border-emerald-800/60">
                            {selectedDestination}
                        </span>
                    )}
                </div>

                {/* Right Controls: Grid/List Toggle & Sort Dropdown */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    
                    {/* View Toggle Button Group */}
                    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                            aria-label="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                        <span>Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange && onSortChange(e.target.value)}
                            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="popularity">Latest / Popularity</option>
                            <option value="fee-low">Tuition Fee: Low to High</option>
                            <option value="fee-high">Tuition Fee: High to Low</option>
                            <option value="title-asc">Course Title (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* DYNAMIC COURSE CARDS (LIST OR 2-COLUMN GRID) */}
            {courseList.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'flex flex-col space-y-4'}>
                    {courseList.map((course) => {
                        const uni = course.university || {};
                        const country = uni.country || {};
                        const locationText = uni.location
                            ? `${uni.location}${country.name ? `, ${country.name}` : ''}`
                            : (country.name || 'Global Campus');

                        return (
                            <div
                                key={course.id}
                                className={`group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 ${
                                    viewMode === 'grid'
                                        ? 'flex flex-col h-full justify-between p-5'
                                        : 'flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6'
                                }`}
                            >
                                {/* LEFT / TOP SECTION: TITLE, UNIVERSITY & LOCATION */}
                                <div className={viewMode === 'grid' ? 'space-y-2 mb-4 w-full' : 'space-y-2 lg:w-5/12 flex-1'}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold uppercase tracking-wide">
                                            {course.level || 'Degree'}
                                        </span>
                                        {country.name && (
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                                                {country.name}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                        {course.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                                        {uni.slug ? (
                                            <Link
                                                href={`/universities/${uni.slug}`}
                                                className="font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                                            >
                                                <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span className="underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2">{uni.name}</span>
                                            </Link>
                                        ) : (
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span>{uni.name || 'Partner University'}</span>
                                            </span>
                                        )}

                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>{locationText}</span>
                                        </span>
                                    </div>
                                </div>

                                {/* MIDDLE SECTION: STATS / DURATION BOX */}
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-3 gap-2 w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs mb-4'
                                        : 'grid grid-cols-3 gap-3 w-full lg:w-4/12 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs shrink-0'
                                }>
                                    <div className="space-y-0.5 text-center">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Duration</div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                                            <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                                            <span className="truncate">{course.duration || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-0.5 text-center border-x border-slate-200/60 dark:border-slate-700/60">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Intake</div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                                            <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                                            <span className="truncate">{course.intake || 'Multiple'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-0.5 text-center">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">Level</div>
                                        <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                                            <GraduationCap className="w-3 h-3 text-emerald-500 shrink-0" />
                                            <span className="truncate">{course.level || 'Degree'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT / BOTTOM SECTION: TUITION FEE & ENQUIRE BUTTON */}
                                <div className={
                                    viewMode === 'grid'
                                        ? 'w-full flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800'
                                        : 'flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-3/12 gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0'
                                }>
                                    <div className={viewMode === 'grid' ? 'text-left' : 'text-left lg:text-right'}>
                                        <div className="text-[10px] font-bold uppercase text-slate-400">Annual Tuition</div>
                                        <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                                            {course.show_tuition_fee !== false ? (
                                                course.tuition_fee || 'Contact for Fee'
                                            ) : (
                                                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                                                    Tuition on Request
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleOpenCourseModal(course)}
                                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 hover:scale-105 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                                    >
                                        <span>Enquire</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* EMPTY SEARCH / FILTER STATE */
                <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 mx-auto flex items-center justify-center">
                        <SearchX className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        No courses match your active filters
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                        Try resetting your search query, study level, or destination filters to discover available academic programmes.
                    </p>
                    {hasFilters && onResetFilters && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset all filters</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* COURSE APPLICATION POPUP MODAL */}
            {selectedCourseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedCourseModal(null);
                                setApplicationSent(false);
                            }}
                            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {applicationSent ? (
                            <div className="py-8 text-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                    Application Submitted!
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                    Thank you! An admissions advisor for <span className="font-bold text-blue-600">{selectedCourseModal.title}</span> will contact you shortly.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3.5 mb-4">
                                    <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 shrink-0">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                            {selectedCourseModal.level || 'Degree'}
                                        </span>
                                        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                                            {selectedCourseModal.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {selectedCourseModal.university?.name || 'Partner University'}
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleApplySubmit} className="space-y-4">
                                    {errorMessage && (
                                        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Duration:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{selectedCourseModal.duration || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Intake:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{selectedCourseModal.intake || 'Multiple'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Annual Tuition:</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">
                                                {selectedCourseModal.show_tuition_fee !== false
                                                    ? (selectedCourseModal.tuition_fee || 'Contact for Fee')
                                                    : 'Tuition on Request'}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Sarah Jenkins"
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="email@example.com"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Submitting Application...</span>
                                            </>
                                        ) : (
                                            <span>Submit Direct Application</span>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
