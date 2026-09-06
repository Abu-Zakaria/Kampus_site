import React, { useState } from 'react';
import {
    Search,
    BookOpen,
    Clock,
    Calendar,
    ArrowRight,
    GraduationCap,
    CheckCircle2,
    X
} from 'lucide-react';

export default function TabCourses({ courses }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);

    const defaultCourses = courses || [
        { code: 'CS101', name: 'BSc Computer Science', level: 'Undergraduate', duration: '3 Years Full-Time', tuition: '£15,000 / Year', intake: 'September 2026', desc: 'Comprehensive study of software engineering, artificial intelligence, data structures, and computer systems.' },
        { code: 'DS202', name: 'MSc Data Science & AI', level: 'Postgraduate', duration: '1 Year Full-Time', tuition: '£18,500 / Year', intake: 'September 2026', desc: 'Advanced machine learning, big data analytics, neural networks, and statistical modeling.' },
        { code: 'MBA90', name: 'Master of Business Administration (MBA)', level: 'Postgraduate', duration: '1 Year Full-Time', tuition: '£22,000 / Year', intake: 'September 2026', desc: 'Strategic management, financial analysis, global marketing, and executive leadership.' },
        { code: 'ENG40', name: 'MEng Engineering Science', level: 'Undergraduate', duration: '4 Years Full-Time', tuition: '£16,200 / Year', intake: 'September 2026', desc: 'Multi-disciplinary engineering covering mechanical, electrical, and civil systems.' },
        { code: 'LAW10', name: 'LLB Bachelor of Laws', level: 'Undergraduate', duration: '3 Years Full-Time', tuition: '£15,500 / Year', intake: 'September 2026', desc: 'Comprehensive grounding in English legal principles, constitutional law, and international law.' },
        { code: 'MED05', name: 'MSc Public Health & Epidemiology', level: 'Postgraduate', duration: '1 Year Full-Time', tuition: '£19,000 / Year', intake: 'September 2026', desc: 'Global health policy, biostatistics, disease prevention, and healthcare management.' },
    ];

    const filteredCourses = defaultCourses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* SEARCH INPUT AT TOP */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
                <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Available Degree Courses
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Find undergraduate & postgraduate degree programs available for international intake.
                    </p>
                </div>

                {/* Search Bar Input */}
                <div className="relative w-full sm:w-72">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
            </div>

            {/* COURSE CARDS GRID (SOFT BORDER & HOVER SHADOW) */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, idx) => (
                        <div
                            key={idx}
                            className="group p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:shadow-lg hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md">
                                        {course.code || `CR0${idx+1}`}
                                    </span>
                                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-800">
                                        {course.level || 'Degree'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                                    {course.name}
                                </h3>

                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {course.desc || 'Comprehensive higher education curriculum tailored for global career opportunities.'}
                                </p>

                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-xs font-medium text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{course.duration}</span>
                                        </span>
                                        <span className="flex items-center gap-1 text-slate-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{course.intake}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-500">Tuition Fee:</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">
                                            {course.show_tuition_fee !== false ? (
                                                course.tuition || course.tuition_fee || 'Contact for Fee'
                                            ) : (
                                                <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                                                    Tuition on Request
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <button
                                    onClick={() => setSelectedCourse(course)}
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-700 dark:hover:bg-blue-600 text-slate-800 hover:text-white dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                                >
                                    <span>View Details</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
                    No courses found matching "{searchTerm}".
                </div>
            )}

            {/* COURSE DETAILS MODAL */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
                        <button
                            onClick={() => setSelectedCourse(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">{selectedCourse.code}</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedCourse.name}</h3>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <p className="leading-relaxed">{selectedCourse.desc}</p>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5 font-medium">
                                <div className="flex justify-between"><span>Duration:</span><span className="font-bold text-slate-900 dark:text-white">{selectedCourse.duration}</span></div>
                                <div className="flex justify-between items-center">
                                    <span>Annual Tuition:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                        {selectedCourse.show_tuition_fee !== false
                                            ? (selectedCourse.tuition || selectedCourse.tuition_fee || 'Contact for Fee')
                                            : 'Tuition on Request'}
                                    </span>
                                </div>
                                <div className="flex justify-between"><span>Intake Date:</span><span className="font-bold text-slate-900 dark:text-white">{selectedCourse.intake}</span></div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCourse(null);
                                    window.dispatchEvent(new CustomEvent('open-book-call-modal'));
                                }}
                                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md cursor-pointer"
                            >
                                Apply for this Course
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
