import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Save,
    ArrowLeft,
    HelpCircle,
    MessageSquare,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

export default function Form({ faq = null }) {
    const isEdit = Boolean(faq);

    const { data, setData, post, put, processing, errors } = useForm({
        question: faq?.question || '',
        answer: faq?.answer || '',
        sort_order: faq?.sort_order ?? 0,
        is_active: faq ? Boolean(faq.is_active) : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/faqs/${faq.id}`);
        } else {
            post('/admin/faqs');
        }
    };

    return (
        <AdminLayout title={isEdit ? `Edit FAQ: ${faq.question}` : 'Create New FAQ'}>
            <Head title={`${isEdit ? 'Edit' : 'Create'} FAQ —  RMS CMS`} />

            <div className="max-w-4xl mx-auto space-y-8">

                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/faqs"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                                <Sparkles className="w-3 h-3" />
                                <span>{isEdit ? 'UPDATE FAQ ITEM' : 'NEW FAQ ITEM'}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                                {isEdit ? 'Edit FAQ Question' : 'Create New FAQ Question'}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving...' : (isEdit ? 'Update FAQ' : 'Save FAQ')}</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* MAIN FORM CARD */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                        Question & Response Details
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        This question will be shown in the homepage FAQ expandable accordion
                                    </p>
                                </div>
                            </div>

                            {/* Active Status Checkbox */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.is_active)}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Active & Published</span>
                            </label>
                        </div>

                        {/* Question Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                FAQ Question *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.question}
                                onChange={(e) => setData('question', e.target.value)}
                                placeholder="e.g. Can I get a scholarship to study abroad?"
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.question && <span className="text-xs text-rose-500 font-semibold">{errors.question}</span>}
                        </div>

                        {/* Answer Textarea */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Detailed Answer *
                            </label>
                            <textarea
                                rows={6}
                                required
                                value={data.answer}
                                onChange={(e) => setData('answer', e.target.value)}
                                placeholder="Explain the answer clearly with detailed guidance, timelines, and advice..."
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.answer && <span className="text-xs text-rose-500 font-semibold">{errors.answer}</span>}
                        </div>

                        {/* Sort Order Input */}
                        <div className="max-w-xs">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Display Sort Order
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <p className="text-[11px] text-slate-400 mt-1">Lower numbers appear first (e.g. 0, 1, 2, 3...)</p>
                            {errors.sort_order && <span className="text-xs text-rose-500 font-semibold">{errors.sort_order}</span>}
                        </div>

                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:scale-[1.01] transition-transform cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Saving...' : (isEdit ? 'Update FAQ' : 'Publish FAQ')}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
