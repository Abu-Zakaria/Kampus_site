import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    Users,
    Search,
    ShieldCheck,
    Edit3,
    Trash2,
    Check,
    X,
    Sparkles,
    UserCircle,
    Mail,
    Lock
} from 'lucide-react';

export default function Index({ users = [], roles = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const editForm = useForm({
        roles: [],
    });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenEditModal = (user) => {
        setEditingUser(user);
        editForm.setData('roles', user.roles.map(r => r.name));
        editForm.clearErrors();
    };

    const handleToggleRole = (roleName) => {
        const current = editForm.data.roles;
        if (current.includes(roleName)) {
            editForm.setData('roles', current.filter(r => r !== roleName));
        } else {
            editForm.setData('roles', [...current, roleName]);
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingUser) return;
        editForm.put(`/admin/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (user) => {
        if (user.id === 1) {
            alert('Cannot delete the primary Super Admin user (ID 1).');
            return;
        }
        if (confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    return (
        <AdminLayout title="User Management & Roles">
            <Head title="User Management —  RMS CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>SYSTEM ADMINISTRATORS</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            User Directory & Role Assignments
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            View registered administrator accounts and assign or revoke RBAC roles dynamically.
                        </p>
                    </div>
                </div>

                {/* SEARCH FILTER BAR */}
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search user by name or email address..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-xs"
                    />
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                </div>

                {/* USERS DATA TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">User Profile</th>
                                    <th className="py-4 px-6 font-extrabold">Email Address</th>
                                    <th className="py-4 px-6 font-extrabold">Assigned Roles</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            No administrator users found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => {
                                        const isUserOne = u.id === 1;
                                        return (
                                            <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">

                                                {/* User Profile */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold border border-blue-200/60 dark:border-blue-800 shrink-0">
                                                            <UserCircle className="w-6 h-6" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                                                {u.name}
                                                                {isUserOne && (
                                                                    <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800 uppercase tracking-wider">
                                                                        Primary Admin
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                User ID #{u.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email Address */}
                                                <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium text-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                                                        <span>{u.email}</span>
                                                    </div>
                                                </td>

                                                {/* Assigned Roles */}
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {isUserOne ? (
                                                            <span className="text-xs font-extrabold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-xl border border-purple-300 dark:border-purple-800 inline-flex items-center gap-1">
                                                                <Lock className="w-3.5 h-3.5" />
                                                                <span>Super Admin (Full Access)</span>
                                                            </span>
                                                        ) : u.roles.length === 0 ? (
                                                            <span className="text-xs text-slate-400 italic">No roles assigned</span>
                                                        ) : (
                                                            u.roles.map((r) => (
                                                                <span key={r.id} className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                                                                    {r.name}
                                                                </span>
                                                            ))
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(u)}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                                                    >
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        <span>Manage Roles</span>
                                                    </button>

                                                    {!isUserOne && (
                                                        <button
                                                            onClick={() => handleDelete(u)}
                                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            <span>Delete</span>
                                                        </button>
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* EDIT USER ROLES MODAL */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            Assign Roles to User
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {editingUser.name} ({editingUser.email})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Select RBAC Roles
                                    </label>
                                    <div className="space-y-2">
                                        {roles.map((r) => {
                                            const isChecked = editForm.data.roles.includes(r.name);
                                            return (
                                                <div
                                                    key={r.id}
                                                    onClick={() => handleToggleRole(r.name)}
                                                    className={`p-3.5 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${isChecked
                                                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200'
                                                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ShieldCheck className={`w-5 h-5 ${isChecked ? 'text-blue-600' : 'text-slate-400'}`} />
                                                        <span className="text-sm font-extrabold">{r.name}</span>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400'
                                                        }`}>
                                                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update Roles'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
