import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';
import {
    ShieldCheck,
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    Sparkles,
    Lock,
    Users
} from 'lucide-react';

export default function Index({ roles = [], permissions = [] }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    // Create Form Hook
    const createForm = useForm({
        name: '',
        permissions: [],
    });

    // Edit Form Hook
    const editForm = useForm({
        name: '',
        permissions: [],
    });

    const handleOpenCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateModalOpen(true);
    };

    const handleOpenEditModal = (role) => {
        setEditingRole(role);
        editForm.setData({
            name: role.name,
            permissions: role.permissions.map(p => p.name),
        });
        editForm.clearErrors();
    };

    const handleToggleCreatePermission = (permName) => {
        const current = createForm.data.permissions;
        if (current.includes(permName)) {
            createForm.setData('permissions', current.filter(p => p !== permName));
        } else {
            createForm.setData('permissions', [...current, permName]);
        }
    };

    const handleToggleEditPermission = (permName) => {
        const current = editForm.data.permissions;
        if (current.includes(permName)) {
            editForm.setData('permissions', current.filter(p => p !== permName));
        } else {
            editForm.setData('permissions', [...current, permName]);
        }
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post('/admin/roles', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingRole) return;
        editForm.put(`/admin/roles/${editingRole.id}`, {
            onSuccess: () => {
                setEditingRole(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (role) => {
        if (role.id === 1 || role.name === 'Super Admin') {
            alert('Cannot delete the primary Super Admin role.');
            return;
        }
        if (confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
            router.delete(`/admin/roles/${role.id}`);
        }
    };

    return (
        <AdminLayout title="Roles & Permissions Management">
            <Head title="Roles & Permissions —  RMS CMS" />

            <div className="space-y-6">

                {/* HEADER BANNER & CREATE BUTTON */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>ACCESS CONTROL SECURITY</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            Roles & Permissions System
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Configure admin role capabilities, assign fine-grained permissions, and secure system modules.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Create New Role</span>
                    </button>
                </div>

                {/* ROLES LIST TABLE */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 font-extrabold">Role Name</th>
                                    <th className="py-4 px-6 font-extrabold">Assigned Permissions</th>
                                    <th className="py-4 px-6 font-extrabold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                {roles.map((role) => {
                                    const isSuperAdmin = role.name === 'Super Admin' || role.id === 1;
                                    return (
                                        <tr key={role.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">

                                            {/* Role Name */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border font-bold ${isSuperAdmin
                                                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 border-purple-300 dark:border-purple-800'
                                                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-200 dark:border-blue-800'
                                                        }`}>
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                                                            {role.name}
                                                            {isSuperAdmin && (
                                                                <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800 uppercase tracking-wider">
                                                                    Super Admin
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            {role.permissions.length} permissions assigned
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Permissions Badges */}
                                            <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-1.5 max-w-xl">
                                                    {isSuperAdmin ? (
                                                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-800 inline-flex items-center gap-1.5">
                                                            <Lock className="w-3.5 h-3.5" />
                                                            <span>All Permissions Granted (Implicit Bypass)</span>
                                                        </span>
                                                    ) : role.permissions.length === 0 ? (
                                                        <span className="text-xs text-slate-400 italic">No permissions assigned</span>
                                                    ) : (
                                                        role.permissions.map((p) => (
                                                            <span key={p.id} className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                                                {p.name}
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(role)}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit Role</span>
                                                </button>

                                                {!isSuperAdmin && (
                                                    <button
                                                        onClick={() => handleDelete(role)}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-xs font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span>Delete</span>
                                                    </button>
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CREATE ROLE MODAL */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            Create New Role
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Specify a role name and assign permissions checklist
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        placeholder="e.g. Content Manager, Moderator"
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    {createForm.errors.name && (
                                        <p className="text-xs text-rose-500 font-semibold">{createForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Assign Permissions
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                        {permissions.map((perm) => {
                                            const isChecked = createForm.data.permissions.includes(perm.name);
                                            return (
                                                <div
                                                    key={perm.id}
                                                    onClick={() => handleToggleCreatePermission(perm.name)}
                                                    className={`p-3 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${isChecked
                                                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200'
                                                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                                        }`}
                                                >
                                                    <span className="text-xs font-bold">{perm.name}</span>
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
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createForm.processing}
                                        className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {createForm.processing ? 'Saving...' : 'Save Role'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* EDIT ROLE MODAL */}
                {editingRole && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                        <Edit3 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            Edit Role: {editingRole.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Update role title and toggled permissions list
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditingRole(null)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editForm.data.name}
                                        onChange={(e) => editForm.setData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-xs text-rose-500 font-semibold">{editForm.errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                        Permissions Checklist
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                                        {permissions.map((perm) => {
                                            const isChecked = editForm.data.permissions.includes(perm.name);
                                            return (
                                                <div
                                                    key={perm.id}
                                                    onClick={() => handleToggleEditPermission(perm.name)}
                                                    className={`p-3 rounded-2xl border cursor-pointer transition-colors flex items-center justify-between ${isChecked
                                                            ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200'
                                                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                                        }`}
                                                >
                                                    <span className="text-xs font-bold">{perm.name}</span>
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
                                        onClick={() => setEditingRole(null)}
                                        className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update Role'}
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
