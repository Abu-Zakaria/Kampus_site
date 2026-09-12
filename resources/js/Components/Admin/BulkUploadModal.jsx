import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    FileSpreadsheet,
    Download,
    UploadCloud,
    X,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FileCheck,
    HelpCircle
} from 'lucide-react';

export default function BulkUploadModal({
    isOpen,
    onClose,
    title = 'Bulk Upload Records',
    description = 'Upload an Excel or CSV file to import multiple records at once.',
    sampleDownloadUrl,
    uploadUrl,
    entityName = 'Records',
    sampleFileName = 'demo_template.xlsx',
}) {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [updateExisting, setUpdateExisting] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;

        const validExtensions = ['.xlsx', '.xls', '.csv'];
        const fileName = selectedFile.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));

        if (!isValid) {
            setUploadError('Invalid file type. Please upload a .xlsx, .xls, or .csv spreadsheet file.');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setUploadError('File is too large. Maximum size allowed is 10 MB.');
            return;
        }

        setUploadError(null);
        setFile(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file || isSubmitting) return;

        setIsSubmitting(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('update_existing', updateExisting ? '1' : '0');

        router.post(uploadUrl, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmitting(false);
                handleRemoveFile();
                onClose();
            },
            onError: (errors) => {
                setIsSubmitting(false);
                if (errors.file) {
                    setUploadError(errors.file);
                } else {
                    setUploadError('Failed to upload file. Please check the file format and try again.');
                }
            },
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                {title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-5 overflow-y-auto">

                    {/* STEP 1: Download Demo Template */}
                    <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50">
                        <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-extrabold">1</span>
                                    <span>Download Demo Excel Template</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300">
                                    Use the official pre-formatted spreadsheet template with the required column headers and sample data rows.
                                </p>
                            </div>
                        </div>

                        <div className="mt-3">
                            <a
                                href={sampleDownloadUrl}
                                download={sampleFileName}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold text-xs shadow-xs transition-all cursor-pointer"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download {entityName} Demo Template (.xlsx)</span>
                            </a>
                        </div>
                    </div>

                    {/* STEP 2: File Upload Zone */}
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-extrabold">2</span>
                            <span>Upload Populated Excel or CSV File</span>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                            onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            className="hidden"
                            id="bulk-excel-input"
                        />

                        {!file ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 scale-[1.01]'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/40 dark:bg-slate-900/30'
                                }`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-200 dark:border-blue-800">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    Drag and drop your spreadsheet here
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    or <span className="text-blue-600 dark:text-blue-400 font-semibold underline">browse files</span> from your computer
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
                                    Supports .xlsx, .xls, .csv (Max 10 MB)
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                                        <FileCheck className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    disabled={isSubmitting}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    title="Remove file"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {uploadError && (
                            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{uploadError}</span>
                            </div>
                        )}
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-3 pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={updateExisting}
                                onChange={(e) => setUpdateExisting(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Update existing {entityName.toLowerCase()} if matching name or slug is found
                            </span>
                        </label>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
                            <span>
                                <strong>Tip for images:</strong> You can paste photos directly into the image cells, or enter external web links (e.g. Unsplash or CDN URLs). Both will be stored automatically in your public storage!
                            </span>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!file || isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Processing Spreadsheet...</span>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-4 h-4" />
                                <span>Upload & Import {entityName}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
