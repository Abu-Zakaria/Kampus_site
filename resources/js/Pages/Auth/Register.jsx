import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';
import { User, Mail, Lock, ShieldCheck, UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const isAdmin = urlParams ? urlParams.get('type') === 'admin' : false;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={isAdmin ? "Create Account — Kampus Admin" : "Student Registration — Kampus"} />

            {/* HEADER TYPOGRAPHY */}
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                    {isAdmin ? 'Create Admin Account' : 'Student Registration'}
                </h2>
                <p className="text-sm text-slate-400">
                    {isAdmin
                        ? 'Register a new administrator profile for Kampus Group'
                        : 'Create your free student account to apply to universities and track replies'}
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                
                {/* FULL NAME INPUT */}
                <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            autoComplete="name"
                            required
                            placeholder="John Doe"
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs font-semibold text-rose-400 pt-1">{errors.name}</p>
                    )}
                </div>

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
                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
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

                {/* CONFIRM PASSWORD INPUT */}
                <div className="space-y-1.5">
                    <label htmlFor="password_confirmation" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="text-xs font-semibold text-rose-400 pt-1">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* SUBMIT BRAND BUTTON */}
                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <span>{processing ? 'Creating Account...' : 'Complete Registration'}</span>
                        <UserPlus className="w-4 h-4" />
                    </button>
                </div>

                {/* LOGIN FOOTER ROUTE */}
                <div className="pt-4 text-center border-t border-slate-800/80">
                    <p className="text-xs text-slate-400">
                        Already have an admin account?{' '}
                        <Link
                            href={route('login')}
                            className="text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                        >
                            <span>Sign in</span>
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    </p>
                </div>

            </form>
        </GuestLayout>
    );
}
