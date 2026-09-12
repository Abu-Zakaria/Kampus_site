import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Sliders,
    Save,
    Mail,
    Database,
    Server,
    Cpu,
    Cloud,
    Shield,
    FileCode,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    Eye,
    EyeOff,
    Copy,
    Check,
    Send,
    RefreshCw,
    Lock,
    Globe,
    Activity,
    Layers
} from 'lucide-react';

export default function Environment({ env = {}, systemInfo = {} }) {
    const [showMailPass, setShowMailPass] = useState(false);
    const [showDbPass, setShowDbPass] = useState(false);
    const [showAwsSecret, setShowAwsSecret] = useState(false);
    const [showRedisPass, setShowRedisPass] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    // Test email modal/form state
    const [testEmailAddress, setTestEmailAddress] = useState('');
    const [isSendingTest, setIsSendingTest] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // Application
        APP_NAME: env.APP_NAME || 'Kampus Edu',
        APP_ENV: env.APP_ENV || 'local',
        APP_DEBUG: env.APP_DEBUG !== undefined ? Boolean(env.APP_DEBUG) : true,
        APP_URL: env.APP_URL || 'http://localhost',
        APP_LOCALE: env.APP_LOCALE || 'en',
        APP_FALLBACK_LOCALE: env.APP_FALLBACK_LOCALE || 'en',

        // Mail
        MAIL_MAILER: env.MAIL_MAILER || 'smtp',
        MAIL_HOST: env.MAIL_HOST || '',
        MAIL_PORT: env.MAIL_PORT || '587',
        MAIL_USERNAME: env.MAIL_USERNAME || '',
        MAIL_PASSWORD: env.MAIL_PASSWORD || '',
        MAIL_ENCRYPTION: env.MAIL_ENCRYPTION || 'tls',
        MAIL_FROM_ADDRESS: env.MAIL_FROM_ADDRESS || '',
        MAIL_FROM_NAME: env.MAIL_FROM_NAME || '',

        // Database
        DB_CONNECTION: env.DB_CONNECTION || 'mysql',
        DB_HOST: env.DB_HOST || '127.0.0.1',
        DB_PORT: env.DB_PORT || '3306',
        DB_DATABASE: env.DB_DATABASE || 'kampus',
        DB_USERNAME: env.DB_USERNAME || 'root',
        DB_PASSWORD: env.DB_PASSWORD || '',

        // Session, Cache, Queue & Storage
        SESSION_DRIVER: env.SESSION_DRIVER || 'database',
        SESSION_LIFETIME: env.SESSION_LIFETIME || '120',
        CACHE_STORE: env.CACHE_STORE || 'database',
        QUEUE_CONNECTION: env.QUEUE_CONNECTION || 'database',
        FILESYSTEM_DISK: env.FILESYSTEM_DISK || 'local',

        // AWS
        AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID || '',
        AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY || '',
        AWS_DEFAULT_REGION: env.AWS_DEFAULT_REGION || 'us-east-1',
        AWS_BUCKET: env.AWS_BUCKET || '',
        AWS_USE_PATH_STYLE_ENDPOINT: Boolean(env.AWS_USE_PATH_STYLE_ENDPOINT),

        // Logging
        LOG_CHANNEL: env.LOG_CHANNEL || 'stack',
        LOG_LEVEL: env.LOG_LEVEL || 'debug',

        // Redis
        REDIS_HOST: env.REDIS_HOST || '127.0.0.1',
        REDIS_PORT: env.REDIS_PORT || '6379',
        REDIS_PASSWORD: env.REDIS_PASSWORD || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/settings/env', {
            preserveScroll: true,
        });
    };

    const handleCopyKey = () => {
        if (env.APP_KEY_MASKED) {
            navigator.clipboard.writeText(env.APP_KEY_MASKED);
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        }
    };

    const handleSendTestEmail = (e) => {
        e.preventDefault();
        if (!testEmailAddress) return;

        setIsSendingTest(true);
        router.post('/admin/settings/env/test-email', {
            email: testEmailAddress
        }, {
            preserveScroll: true,
            onFinish: () => setIsSendingTest(false),
        });
    };

    return (
        <AdminLayout title="Environment Configuration (.env)">
            <Head title="Environment Configuration (.env) — Kampus CMS" />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <Link
                        href="/admin/settings"
                        className="px-4 py-2 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" />
                        <span>Website & Brand</span>
                    </Link>
                    <Link
                        href="/admin/settings/env"
                        className="px-4 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white shadow-sm flex items-center gap-2"
                    >
                        <Sliders className="w-4 h-4" />
                        <span>Environment (.env)</span>
                    </Link>
                    <Link
                        href="/admin/slideshow"
                        className="px-4 py-2 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Layers className="w-4 h-4" />
                        <span>Hero Slideshow</span>
                    </Link>
                </div>

                {/* HEADER ROW */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sliders className="w-3.5 h-3.5" />
                            <span>ENVIRONMENT & RUNTIME CONFIGURATION</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            .env System Settings
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure mail delivery, application runtime mode, database connections, and cache drivers directly.
                        </p>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                    >
                        {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{processing ? 'Saving...' : 'Save .env Settings'}</span>
                    </button>
                </div>

                {/* SYSTEM DIAGNOSTICS STRIP */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                            <Activity className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PHP Version</div>
                            <div className="text-xs font-black text-slate-800 dark:text-slate-200">{systemInfo.php_version}</div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                            <Server className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Laravel</div>
                            <div className="text-xs font-black text-slate-800 dark:text-slate-200">v{systemInfo.laravel_version}</div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Env</div>
                            <div className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase">{data.APP_ENV}</div>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${systemInfo.env_writable ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'}`}>
                            <FileCode className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">.env File</div>
                            <div className={`text-xs font-black ${systemInfo.env_writable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {systemInfo.env_writable ? 'Writable' : 'Read Only'}
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* SECTION 1: APP & GENERAL */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Application Environment
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Core application metadata, URL routing domain, and runtime debug switches
                                </p>
                            </div>
                        </div>

                        {data.APP_ENV === 'production' && data.APP_DEBUG && (
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-800 dark:text-amber-200">
                                    <strong className="font-bold">Security Notice:</strong> APP_DEBUG is enabled while APP_ENV is set to production. Detailed error traces including environment secrets will be visible to end users on uncaught errors. Disable debug mode in production.
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    APP_NAME (App Name)
                                </label>
                                <input
                                    type="text"
                                    value={data.APP_NAME}
                                    onChange={(e) => setData('APP_NAME', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="Kampus Edu"
                                    required
                                />
                                {errors.APP_NAME && <p className="text-xs text-rose-500 mt-1">{errors.APP_NAME}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    APP_ENV (Environment)
                                </label>
                                <select
                                    value={data.APP_ENV}
                                    onChange={(e) => setData('APP_ENV', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="local">local (Development)</option>
                                    <option value="staging">staging (Staging / QA)</option>
                                    <option value="production">production (Live Production)</option>
                                    <option value="testing">testing (Testing)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    APP_URL (Application URL)
                                </label>
                                <input
                                    type="url"
                                    value={data.APP_URL}
                                    onChange={(e) => setData('APP_URL', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="https://example.com"
                                    required
                                />
                                {errors.APP_URL && <p className="text-xs text-rose-500 mt-1">{errors.APP_URL}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    APP_LOCALE
                                </label>
                                <input
                                    type="text"
                                    value={data.APP_LOCALE}
                                    onChange={(e) => setData('APP_LOCALE', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="en"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    APP_FALLBACK_LOCALE
                                </label>
                                <input
                                    type="text"
                                    value={data.APP_FALLBACK_LOCALE}
                                    onChange={(e) => setData('APP_FALLBACK_LOCALE', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="en"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    APP_DEBUG (Debug Mode)
                                </label>
                                <div className="flex items-center gap-3 pt-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.APP_DEBUG}
                                            onChange={(e) => setData('APP_DEBUG', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {data.APP_DEBUG ? 'Enabled (true)' : 'Disabled (false)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* APP KEY READ-ONLY */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>APP_KEY</span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                            AES-256 System Encrypted
                                        </span>
                                    </div>
                                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                        {env.APP_KEY_MASKED}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyKey}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
                            >
                                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                            </button>
                        </div>
                    </div>

                    {/* SECTION 2: MAIL & SMTP CONFIGURATION */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Email Delivery & SMTP Settings
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Configure outbound transactional mail server for student admission notifications and inquiry responses
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_MAILER (Driver)
                                </label>
                                <select
                                    value={data.MAIL_MAILER}
                                    onChange={(e) => setData('MAIL_MAILER', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="smtp">smtp (Standard SMTP / Mailtrap / Sendgrid)</option>
                                    <option value="sendmail">sendmail (System sendmail binary)</option>
                                    <option value="mailgun">mailgun</option>
                                    <option value="ses">ses (Amazon SES)</option>
                                    <option value="postmark">postmark</option>
                                    <option value="log">log (Development only - write to laravel.log)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_HOST
                                </label>
                                <input
                                    type="text"
                                    value={data.MAIL_HOST}
                                    onChange={(e) => setData('MAIL_HOST', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="smtp.mailtrap.io"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_PORT
                                </label>
                                <input
                                    type="number"
                                    value={data.MAIL_PORT}
                                    onChange={(e) => setData('MAIL_PORT', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="587"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_USERNAME
                                </label>
                                <input
                                    type="text"
                                    value={data.MAIL_USERNAME}
                                    onChange={(e) => setData('MAIL_USERNAME', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="your_smtp_username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showMailPass ? 'text' : 'password'}
                                        value={data.MAIL_PASSWORD}
                                        onChange={(e) => setData('MAIL_PASSWORD', e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowMailPass(!showMailPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        {showMailPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_ENCRYPTION
                                </label>
                                <select
                                    value={data.MAIL_ENCRYPTION}
                                    onChange={(e) => setData('MAIL_ENCRYPTION', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="tls">tls (Recommended - Port 587)</option>
                                    <option value="ssl">ssl (Port 465)</option>
                                    <option value="null">None (null)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_FROM_ADDRESS
                                </label>
                                <input
                                    type="email"
                                    value={data.MAIL_FROM_ADDRESS}
                                    onChange={(e) => setData('MAIL_FROM_ADDRESS', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="notifications@kampusedu.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    MAIL_FROM_NAME
                                </label>
                                <input
                                    type="text"
                                    value={data.MAIL_FROM_NAME}
                                    onChange={(e) => setData('MAIL_FROM_NAME', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="Kampus Edu"
                                />
                            </div>
                        </div>

                        {/* TEST EMAIL DISPATCH FORM */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                            <div>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <Send className="w-3.5 h-3.5 text-blue-500" />
                                    <span>Verify SMTP Delivery</span>
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Send a real-time verification email to ensure outbound messages arrive without being blocked.
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <input
                                    type="email"
                                    value={testEmailAddress}
                                    onChange={(e) => setTestEmailAddress(e.target.value)}
                                    placeholder="Enter your email"
                                    className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs w-full sm:w-60 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendTestEmail}
                                    disabled={isSendingTest || !testEmailAddress}
                                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                                >
                                    {isSendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                    <span>{isSendingTest ? 'Sending...' : 'Test Mail'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: DATABASE SETTINGS */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                                <Database className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Database Connection
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Relational database connection credentials (MySQL / MariaDB / PostgreSQL / SQLite)
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-rose-800 dark:text-rose-200">
                                <strong className="font-bold">Caution:</strong> Modifying DB connection credentials (host, port, database, user, password) will immediately alter active database communication. An incorrect database configuration will render the site inaccessible until restored.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    DB_CONNECTION
                                </label>
                                <select
                                    value={data.DB_CONNECTION}
                                    onChange={(e) => setData('DB_CONNECTION', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="mysql">mysql (MySQL / MariaDB)</option>
                                    <option value="pgsql">pgsql (PostgreSQL)</option>
                                    <option value="sqlite">sqlite (SQLite File)</option>
                                    <option value="sqlsrv">sqlsrv (SQL Server)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    DB_HOST
                                </label>
                                <input
                                    type="text"
                                    value={data.DB_HOST}
                                    onChange={(e) => setData('DB_HOST', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="127.0.0.1"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    DB_PORT
                                </label>
                                <input
                                    type="number"
                                    value={data.DB_PORT}
                                    onChange={(e) => setData('DB_PORT', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="3306"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    DB_DATABASE
                                </label>
                                <input
                                    type="text"
                                    value={data.DB_DATABASE}
                                    onChange={(e) => setData('DB_DATABASE', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="kampus"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    DB_USERNAME
                                </label>
                                <input
                                    type="text"
                                    value={data.DB_USERNAME}
                                    onChange={(e) => setData('DB_USERNAME', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="root"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    DB_PASSWORD
                                </label>
                                <div className="relative">
                                    <input
                                        type={showDbPass ? 'text' : 'password'}
                                        value={data.DB_PASSWORD}
                                        onChange={(e) => setData('DB_PASSWORD', e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowDbPass(!showDbPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        {showDbPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: SESSIONS, CACHE & QUEUES */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Session, Cache, Queue & Storage Drivers
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Storage systems handling user sessions, cached models, background jobs, and public media uploads
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    SESSION_DRIVER
                                </label>
                                <select
                                    value={data.SESSION_DRIVER}
                                    onChange={(e) => setData('SESSION_DRIVER', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="database">database (Stores in sessions table)</option>
                                    <option value="file">file (Local storage/framework/sessions)</option>
                                    <option value="cookie">cookie (Encrypted in client browser)</option>
                                    <option value="redis">redis (In-memory Redis)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    SESSION_LIFETIME (Minutes)
                                </label>
                                <input
                                    type="number"
                                    value={data.SESSION_LIFETIME}
                                    onChange={(e) => setData('SESSION_LIFETIME', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="120"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    CACHE_STORE
                                </label>
                                <select
                                    value={data.CACHE_STORE}
                                    onChange={(e) => setData('CACHE_STORE', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="database">database</option>
                                    <option value="file">file</option>
                                    <option value="redis">redis</option>
                                    <option value="array">array (Transient in-memory)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    QUEUE_CONNECTION
                                </label>
                                <select
                                    value={data.QUEUE_CONNECTION}
                                    onChange={(e) => setData('QUEUE_CONNECTION', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="database">database (Background jobs table)</option>
                                    <option value="sync">sync (Runs immediately during HTTP request)</option>
                                    <option value="redis">redis</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    FILESYSTEM_DISK
                                </label>
                                <select
                                    value={data.FILESYSTEM_DISK}
                                    onChange={(e) => setData('FILESYSTEM_DISK', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="local">local (Private local storage)</option>
                                    <option value="public">public (Web-accessible storage/app/public)</option>
                                    <option value="s3">s3 (Amazon AWS S3 Bucket)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    LOG_LEVEL
                                </label>
                                <select
                                    value={data.LOG_LEVEL}
                                    onChange={(e) => setData('LOG_LEVEL', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                >
                                    <option value="debug">debug (Most verbose)</option>
                                    <option value="info">info</option>
                                    <option value="notice">notice</option>
                                    <option value="warning">warning</option>
                                    <option value="error">error (Errors only)</option>
                                    <option value="critical">critical</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: AWS S3 & STORAGE (OPTIONAL) */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                                <Cloud className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                                    Amazon AWS S3 Cloud Storage
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Optional cloud object storage credentials when FILESYSTEM_DISK is set to s3
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    AWS_ACCESS_KEY_ID
                                </label>
                                <input
                                    type="text"
                                    value={data.AWS_ACCESS_KEY_ID}
                                    onChange={(e) => setData('AWS_ACCESS_KEY_ID', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="AKIA..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    AWS_SECRET_ACCESS_KEY
                                </label>
                                <div className="relative">
                                    <input
                                        type={showAwsSecret ? 'text' : 'password'}
                                        value={data.AWS_SECRET_ACCESS_KEY}
                                        onChange={(e) => setData('AWS_SECRET_ACCESS_KEY', e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowAwsSecret(!showAwsSecret)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        {showAwsSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    AWS_DEFAULT_REGION
                                </label>
                                <input
                                    type="text"
                                    value={data.AWS_DEFAULT_REGION}
                                    onChange={(e) => setData('AWS_DEFAULT_REGION', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="us-east-1"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    AWS_BUCKET
                                </label>
                                <input
                                    type="text"
                                    value={data.AWS_BUCKET}
                                    onChange={(e) => setData('AWS_BUCKET', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                                    placeholder="my-kampus-bucket"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                    AWS_USE_PATH_STYLE_ENDPOINT
                                </label>
                                <div className="flex items-center gap-3 pt-1">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.AWS_USE_PATH_STYLE_ENDPOINT}
                                            onChange={(e) => setData('AWS_USE_PATH_STYLE_ENDPOINT', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                        {data.AWS_USE_PATH_STYLE_ENDPOINT ? 'true (Path Style)' : 'false'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SAVE ACTIONS */}
                    <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            A backup of your current <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">.env</code> is saved automatically to <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">storage/app/backups/env/</code> upon submission.
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                        >
                            {processing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{processing ? 'Saving Changes...' : 'Save .env Settings'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
