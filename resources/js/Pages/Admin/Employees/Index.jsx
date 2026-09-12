import React, { useState, useMemo } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Users,
    Plus,
    Search,
    Edit3,
    Trash2,
    CheckCircle2,
    XCircle,
    Sparkles,
    Filter,
    ExternalLink,
    Save,
    Quote,
    Mail,
    Linkedin,
    Briefcase,
    SlidersHorizontal,
    Building2,
    Check
} from 'lucide-react';

export default function Index({ employees = [], stats = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showSettingsCard, setShowSettingsCard] = useState(false);

    // Form for managing Company Team Section Settings
    const { data: settingsData, setData: setSettingsData, post: postSettings, processing: savingSettings } = useForm({
        company_employee_count: stats?.company_employee_count || '65+ Global Team Members',
        company_employee_stat_subtext: stats?.company_employee_stat_subtext || 'Dedicated education consultants, visa case officers, and support staff across 15+ countries worldwide.',
        company_team_heading: stats?.company_team_heading || 'Meet our global education leadership',
        company_team_subheading: stats?.company_team_subheading || 'Driven by ethics, academic expertise, and student success, our multi-disciplinary team brings decades of university admissions experience.',
    });

    // Parse workforce metric for clean presentation (e.g., "65+" & "Global Team Members")
    const workforceStat = useMemo(() => {
        const raw = (settingsData.company_employee_count || '65+ Global Team Members').trim();
        const match = raw.match(/^([0-9]+\+?|\+[0-9]+|[0-9]+%)\s*(.*)$/);
        if (match) {
            return {
                metric: match[1],
                label: match[2] || 'Global Team'
            };
        }
        return {
            metric: raw,
            label: ''
        };
    }, [settingsData.company_employee_count]);

    const handleSaveSettings = (e) => {
        e.preventDefault();
        postSettings('/admin/employees/settings', {
            preserveScroll: true,
            onSuccess: () => {
                setShowSettingsCard(false);
            }
        });
    };

    const filteredEmployees = employees.filter(emp => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            emp.name.toLowerCase().includes(query) ||
            emp.role.toLowerCase().includes(query) ||
            (emp.department || '').toLowerCase().includes(query) ||
            (emp.quote || '').toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === 'All' ||
            (statusFilter === 'Active' && emp.is_active) ||
            (statusFilter === 'Inactive' && !emp.is_active);

        return matchesSearch && matchesStatus;
    });

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to remove "${name}" from the company team roster?`)) {
            router.delete(`/admin/employees/${id}`);
        }
    };

    const handleToggleStatus = (id) => {
        router.patch(`/admin/employees/${id}/toggle-status`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Team & Employees">
            <Head title="Team & Employees Management — Kampus CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>ABOUT PAGE COMPANY SECTION</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Team & Employees
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                            Manage individual company employees, designations, profile images, short quotes, and global workforce statistics shown on the About Us page.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowSettingsCard(!showSettingsCard)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
                        >
                            <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                            <span>{showSettingsCard ? 'Close Section Settings' : 'Section Settings'}</span>
                        </button>

                        <a
                            href="/about#team"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-all"
                        >
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                            <span>View on About Page</span>
                        </a>

                        <Link
                            href="/admin/employees/create"
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Team Member</span>
                        </Link>
                    </div>
                </div>

                {/* QUICK STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Workforce Public Stat Card */}
                    <div
                        onClick={() => setShowSettingsCard(prev => !prev)}
                        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-blue-500/50 transition-all cursor-pointer"
                        title="Click to configure company workforce settings"
                    >
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                                Workforce Stat
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Briefcase className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                                {workforceStat.metric}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate" title={workforceStat.label || 'About page badge'}>
                                {workforceStat.label || 'About page badge'}
                            </div>
                        </div>
                    </div>

                    {/* Total Registered */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                                Total Registered
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {stats?.total ?? employees.length}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                                Registered team members
                            </div>
                        </div>
                    </div>

                    {/* Active on About Page */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                                Active on About
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {stats?.active ?? employees.filter(e => e.is_active).length}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                                Visible on public site
                            </div>
                        </div>
                    </div>

                    {/* Hidden / Inactive */}
                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                                Hidden / Inactive
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                                <XCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-extrabold text-slate-400 tracking-tight">
                                {stats?.inactive ?? employees.filter(e => !e.is_active).length}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                                Draft or hidden profiles
                            </div>
                        </div>
                    </div>
                </div>

                {/* OPTIONAL EXPANDABLE SETTINGS FORM */}
                {showSettingsCard && (
                    <form onSubmit={handleSaveSettings} className="p-6 sm:p-7 rounded-3xl bg-blue-50/50 dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/60 shadow-md space-y-5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-3">
                            <div className="flex items-center gap-2.5">
                                <SlidersHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                                        About Page Team Section Header & Workforce Metric
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Customize the company employee stat counter, badge text, and introductory headline on the About page.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={savingSettings}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Company Employee Count / Metric Badge <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={settingsData.company_employee_count}
                                    onChange={(e) => setSettingsData('company_employee_count', e.target.value)}
                                    placeholder="e.g. 65+ Global Team Members or 50+ Certified Advisors"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                                <span className="text-[11px] text-slate-500 mt-1 block">
                                    This stat is highlighted prominently above the employee grid on the About page.
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Employee Metric Subtext
                                </label>
                                <input
                                    type="text"
                                    value={settingsData.company_employee_stat_subtext}
                                    onChange={(e) => setSettingsData('company_employee_stat_subtext', e.target.value)}
                                    placeholder="e.g. Dedicated education consultants, visa officers & support staff..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Section Main Heading
                                </label>
                                <input
                                    type="text"
                                    value={settingsData.company_team_heading}
                                    onChange={(e) => setSettingsData('company_team_heading', e.target.value)}
                                    placeholder="e.g. Meet our global education leadership"
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                    Section Subheading / Description
                                </label>
                                <input
                                    type="text"
                                    value={settingsData.company_team_subheading}
                                    onChange={(e) => setSettingsData('company_team_subheading', e.target.value)}
                                    placeholder="e.g. Driven by ethics, academic expertise, and student success..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </form>
                )}

                {/* SEARCH & FILTER CONTROLS */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, role, department or quote..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            {['All', 'Active', 'Inactive'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        statusFilter === status
                                            ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* EMPLOYEES GRID / LIST */}
                {filteredEmployees.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">No team members found</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                            {searchTerm
                                ? 'No employees match your search query. Try adjusting your keywords.'
                                : 'No employees have been added yet. Click "Add Team Member" to get started.'}
                        </p>
                        {searchTerm ? (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
                            >
                                Clear Search
                            </button>
                        ) : (
                            <Link
                                href="/admin/employees/create"
                                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add First Team Member</span>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map((emp) => (
                            <div
                                key={emp.id}
                                className={`rounded-3xl border bg-white dark:bg-slate-900 p-6 flex flex-col justify-between transition-all duration-300 relative group hover:shadow-lg ${
                                    emp.is_active
                                        ? 'border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/40'
                                        : 'border-rose-200 dark:border-rose-950/50 bg-rose-50/20 opacity-80'
                                }`}
                            >
                                {/* Top Controls & Status */}
                                <div>
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        {/* Avatar and Info */}
                                        <div className="flex items-center gap-3.5">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 shadow-sm shrink-0">
                                                {emp.image ? (
                                                    <img
                                                        src={emp.image}
                                                        alt={emp.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-extrabold text-lg">
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                                    {emp.name}
                                                </h4>
                                                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                                                    {emp.role}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Display Order Badge */}
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                #{emp.sort_order}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Department / Branch */}
                                    {emp.department && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{emp.department}</span>
                                        </div>
                                    )}

                                    {/* Quote Box */}
                                    {emp.quote && (
                                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4 relative">
                                            <Quote className="w-4 h-4 text-blue-500/30 absolute top-2.5 right-2.5" />
                                            <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 pr-4">
                                                "{emp.quote}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Contact & Social Links */}
                                    <div className="flex items-center gap-2 mb-4">
                                        {emp.email && (
                                            <a
                                                href={`mailto:${emp.email}`}
                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title={emp.email}
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {emp.linkedin_url && (
                                            <a
                                                href={emp.linkedin_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="LinkedIn Profile"
                                            >
                                                <Linkedin className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Action Toolbar */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    {/* Status Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(emp.id)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                            emp.is_active
                                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
                                        }`}
                                    >
                                        {emp.is_active ? (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span>Inactive</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Edit / Delete Buttons */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/employees/${emp.id}/edit`}
                                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                                            title="Edit team member"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(emp.id, emp.name)}
                                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                            title="Delete team member"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
