import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';
import { Mail, KeyRound, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { props } = usePage();
    const globalSettings = props?.globalSettings || {};
    const siteName = globalSettings?.site_name || 'Kampus';

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={`Reset Password — ${siteName} Admin`} />

            <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20 mb-3">
                    <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    Reset Password
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Forgot your admin password? Enter your email address below and we will send you a password reset link.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            required
                            placeholder={globalSettings?.contact_email ? `e.g. ${globalSettings.contact_email}` : "admin@kampus.com"}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs font-semibold text-rose-400 pt-1">{errors.email}</p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span>{processing ? 'Sending Link...' : 'Send Reset Link'}</span>
                        <Send className="w-4 h-4" />
                    </button>
                </div>

                <div className="pt-4 text-center border-t border-slate-800/80">
                    <Link
                        href={route('login')}
                        className="text-xs text-slate-400 hover:text-white font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Return to Sign In</span>
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
