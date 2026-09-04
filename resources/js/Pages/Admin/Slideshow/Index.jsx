import React, { useState, useRef } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Layers,
    Upload,
    Trash2,
    RotateCcw,
    Plus,
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Image as ImageIcon,
    CheckCircle2,
    RefreshCw,
    ExternalLink,
    Eye
} from 'lucide-react';

export default function Index({ slides = [], defaultSlides = [] }) {
    const [slidesList, setSlidesList] = useState(slides);
    const [uploading, setUploading] = useState(false);
    const [replacingIndex, setReplacingIndex] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);
    const multiFileInputRef = useRef(null);
    const replaceFileInputRef = useRef(null);

    // Keep slidesList in sync with incoming props
    React.useEffect(() => {
        setSlidesList(slides);
    }, [slides]);

    // Handle Uploading New Images (one or multiple)
    const handleFileUpload = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }

        setUploading(true);
        router.post('/admin/slideshow/upload', formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                if (multiFileInputRef.current) {
                    multiFileInputRef.current.value = '';
                }
            },
        });
    };

    // Handle Replacing a Single Image
    const triggerReplace = (index) => {
        setReplacingIndex(index);
        if (replaceFileInputRef.current) {
            replaceFileInputRef.current.value = '';
            replaceFileInputRef.current.click();
        }
    };

    const handleReplaceFile = (e) => {
        const file = e.target.files?.[0];
        if (!file || replacingIndex === null) return;

        const formData = new FormData();
        formData.append('image', file);

        router.post(`/admin/slideshow/${replacingIndex}/replace`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => {
                setReplacingIndex(null);
            },
        });
    };

    // Move slide position (reorder)
    const moveSlide = (currentIndex, direction) => {
        const targetIndex = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= slidesList.length) return;

        const updated = [...slidesList];
        const temp = updated[currentIndex];
        updated[currentIndex] = updated[targetIndex];
        updated[targetIndex] = temp;

        setSlidesList(updated);

        // Save reordered array
        router.post('/admin/slideshow', { slides: updated }, {
            preserveScroll: true,
        });
    };

    // Delete a slide
    const deleteSlide = (index) => {
        if (slidesList.length <= 1) {
            alert('You must keep at least 1 image in the slideshow.');
            return;
        }

        if (window.confirm(`Are you sure you want to delete Slide #${index + 1}?`)) {
            router.delete(`/admin/slideshow/${index}`, {
                preserveScroll: true,
            });
        }
    };

    // Reset to defaults
    const handleReset = () => {
        if (window.confirm('Reset all slideshow images back to the default curated campus & study abroad photos? Any custom uploads in the slideshow will be replaced.')) {
            router.post('/admin/slideshow/reset', {}, {
                preserveScroll: true,
            });
        }
    };

    const resolveSrc = (url) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('/')) return url;
        return `/storage/${url}`;
    };

    return (
        <AdminLayout title="Hero 3D Card Slideshow">
            <Head title="Hero Slideshow Images — Kampus CMS" />

            <div className="max-w-6xl mx-auto space-y-8">

                {/* HEADER BANNER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>STANDALONE HERO CARDS</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Hero 3D Card Slideshow Images
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-1">
                            These images appear exclusively in the interactive 3D stacked deck on the homepage hero banner.
                            They are <strong>completely separate and unlinked</strong> from university partners and destination countries.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                            title="Reset to default high-res curated photos"
                        >
                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                            <span>Reset Defaults</span>
                        </button>

                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm shadow-blue-600/30"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View on Live Homepage</span>
                            <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>
                    </div>
                </div>

                {/* HIDDEN INPUT FOR REPLACING A SINGLE IMAGE */}
                <input
                    type="file"
                    ref={replaceFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleReplaceFile}
                />

                {/* TWO COLUMN GRID: SLIDES LIST (LEFT) + UPLOAD & 3D LIVE PREVIEW (RIGHT) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: ACTIVE SLIDES (8 COLS) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                            Current Slideshow Images ({slidesList.length})
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Card #1 starts as the front active card. Drag or use arrows to reorder.
                                        </p>
                                    </div>
                                </div>

                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {slidesList.length} Active Slides
                                </span>
                            </div>

                            {/* SLIDES GRID */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {slidesList.map((url, idx) => {
                                    const isFirst = idx === 0;
                                    const isLast = idx === slidesList.length - 1;

                                    return (
                                        <div
                                            key={idx}
                                            className={`relative rounded-2xl overflow-hidden border transition-all duration-200 bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-3 group ${
                                                isFirst
                                                    ? 'border-blue-500 dark:border-blue-500/80 shadow-md shadow-blue-500/10'
                                                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                                            }`}
                                        >
                                            {/* Image Thumbnail Container */}
                                            <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-slate-700">
                                                <img
                                                    src={resolveSrc(url)}
                                                    alt={`Slide ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';
                                                    }}
                                                />

                                                {/* Top Badge: Slide Position */}
                                                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold tracking-tight shadow-xs ${
                                                        isFirst
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-black/70 backdrop-blur-md text-white'
                                                    }`}>
                                                        #{idx + 1} {isFirst ? '— Front Card' : ''}
                                                    </span>
                                                </div>

                                                {/* Delete Button on Hover */}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteSlide(idx)}
                                                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-md transition-opacity cursor-pointer"
                                                    title={`Delete Slide #${idx + 1}`}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Action Controls for this Slide */}
                                            <div className="flex items-center justify-between gap-2 pt-1">
                                                {/* Reorder Buttons */}
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        disabled={isFirst}
                                                        onClick={() => moveSlide(idx, -1)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                        title="Move Earlier"
                                                    >
                                                        <ArrowLeft className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={isLast}
                                                        onClick={() => moveSlide(idx, 1)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                                        title="Move Later"
                                                    >
                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Replace Image Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => triggerReplace(idx)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                                                >
                                                    <RefreshCw className="w-3 h-3 text-blue-500" />
                                                    <span>Replace</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: UPLOAD NEW IMAGES + LIVE 3D STACK PREVIEW (4 COLS) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* UPLOAD BOX */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                        Upload Slide Images
                                    </h3>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Select one or multiple images
                                    </p>
                                </div>
                            </div>

                            <input
                                type="file"
                                ref={multiFileInputRef}
                                multiple
                                accept="image/*"
                                className="hidden"
                                id="slideshow_upload_input"
                                onChange={handleFileUpload}
                            />

                            <label
                                htmlFor="slideshow_upload_input"
                                className={`h-40 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                                    uploading ? 'opacity-50 pointer-events-none' : ''
                                }`}
                            >
                                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-2">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    {uploading ? 'Uploading Images...' : 'Click to Upload Images'}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-1">
                                    PNG, JPG, WEBP up to 10MB each
                                </span>
                            </label>
                        </div>

                        {/* INTERACTIVE 3D STACK MINI PREVIEW */}
                        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                                        Live 3D Stack Preview
                                    </h3>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    {slidesList.length} cards
                                </span>
                            </div>

                            {/* Mini Deck Stage */}
                            <div className="relative w-full h-[220px] max-w-[280px] mx-auto select-none pt-2">
                                {slidesList.map((url, idx) => {
                                    const total = slidesList.length;
                                    const offset = (idx - previewIndex + total) % total;
                                    const isActive = offset === 0;
                                    const isBehind1 = offset === 1;
                                    const isBehind2 = offset === 2;

                                    let zIndex = 0;
                                    let opacity = 0;
                                    let transform = 'translate3d(50px, 30px, 0) scale(0.85)';

                                    if (isActive) {
                                        transform = 'translate3d(0, 0, 0) scale(1)';
                                        zIndex = 30;
                                        opacity = 1;
                                    } else if (isBehind1) {
                                        transform = 'translate3d(20px, 12px, 0) scale(0.95)';
                                        zIndex = 20;
                                        opacity = 0.9;
                                    } else if (isBehind2) {
                                        transform = 'translate3d(40px, 24px, 0) scale(0.90)';
                                        zIndex = 10;
                                        opacity = 0.8;
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setPreviewIndex(idx)}
                                            className={`absolute top-0 left-0 w-[80%] h-[180px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-950 transition-all duration-500 cursor-pointer ${
                                                isActive ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:brightness-110'
                                            }`}
                                            style={{
                                                zIndex,
                                                opacity,
                                                transform,
                                            }}
                                            title={`Click to preview Card #${idx + 1}`}
                                        >
                                            <img
                                                src={resolveSrc(url)}
                                                alt={`Preview ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-[11px] text-center text-slate-400">
                                Click background cards to test the 3D depth stack.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
