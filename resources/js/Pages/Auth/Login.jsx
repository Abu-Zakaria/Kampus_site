import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function Login({ status, canResetPassword, prefilledEmail = '' }) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialEmail = prefilledEmail || (urlParams ? urlParams.get('email') || '' : '');

    const isStudent = urlParams ? urlParams.get('type') === 'student' : false;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: initialEmail,
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={isStudent ? "Student Sign In — Kampus" : "Sign In — Kampus Portal"} />

            {/* HEADER TYPOGRAPHY */}
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {isStudent ? 'Student Portal Sign In' : 'Welcome Back'}
                </h2>
                <p className="text-sm text-slate-400">
                    {isStudent
                        ? 'Sign in to monitor applications, admission stages & query replies'
                        : 'Sign in to manage your student portal or Kampus CMS dashboard'}
                </p>
            </div>

            {/* STATUS MESSAGE */}
            {status && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                
                {/* EMAIL ADDRESS INPUT */}
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
                            autoComplete="username"
                            required
                            placeholder="admin@kampus.com"
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs font-semibold text-rose-400 pt-1">{errors.email}</p>
                    )}
                </div>

                {/* PASSWORD INPUT */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            required
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-xs font-semibold text-rose-400 pt-1">{errors.password}</p>
                    )}
                </div>

                {/* REMEMBER ME CHECKBOX */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs text-slate-300 font-medium select-none">
                            Keep me logged in for 24h
                        </span>
                    </label>
                </div>

                {/* SUBMIT BRAND BUTTON */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span>{processing ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                        <LogIn className="w-4 h-4" />
                    </button>
                </div>

                {/* REGISTER FOOTER ROUTE */}
                <div className="pt-4 text-center border-t border-slate-800/80">
                    <p className="text-xs text-slate-400">
                        Don't have an admin account?{' '}
                        <Link
                            href={route('register')}
                            className="text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                        >
                            <span>Register now</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </p>
                </div>

            </form>
        </GuestLayout>
    );
}
