import React from 'react';
import AdminLayout from '@/Pages/Admin/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { UserCircle, Shield, KeyRound, AlertTriangle } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminLayout title="Profile & Account Settings">
            <Head title="Profile Settings —  RMS CMS" />

            <div className="max-w-5xl space-y-6">
                {/* 1. HEADER BANNER */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <UserCircle className="w-3.5 h-3.5" />
                            <span>ACCOUNT SETTINGS</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Admin Profile & Security
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Manage your personal profile details, change security passwords, and configure account access.
                        </p>
                    </div>
                </div>

                {/* 2. PROFILE INFORMATION CARD */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                {/* 3. UPDATE PASSWORD CARD */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <UpdatePasswordForm />
                </div>

                {/* 4. DANGER ZONE: DELETE ACCOUNT CARD */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-rose-200/80 dark:border-rose-900/40 shadow-xs">
                    <DeleteUserForm />
                </div>
            </div>
        </AdminLayout>
    );
}
