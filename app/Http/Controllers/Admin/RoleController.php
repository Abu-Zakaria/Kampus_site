<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class RoleController extends Controller
{
    /**
     * Display a listing of roles and permissions.
     */
    public function index(): Response
    {
        $permissionsList = [
            'manage-settings' => 'Global Site Settings',
            'manage-pages' => 'Pages & SEO Management',
            'manage-countries' => 'Countries & Destinations',
            'manage-universities' => 'University Directory',
            'manage-courses' => 'Course Repository',
            'manage-blogs' => 'Blog Posts & News',
            'manage-partners' => 'Partner Applications',
            'manage-inquiries' => 'Inquiries & Messages',
            'manage-users' => 'User Management',
            'manage-roles' => 'Roles & Permissions',
        ];

        // Seed default permissions if empty
        foreach ($permissionsList as $name => $label) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        // Seed default roles if empty
        if (Role::count() === 0) {
            $superAdmin = Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
            $superAdmin->syncPermissions(Permission::all());

            $admin = Role::create(['name' => 'Admin', 'guard_name' => 'web']);
            $admin->syncPermissions([
                'manage-settings', 'manage-pages', 'manage-countries',
                'manage-universities', 'manage-courses', 'manage-blogs',
                'manage-partners', 'manage-inquiries'
            ]);

            $editor = Role::create(['name' => 'Editor', 'guard_name' => 'web']);
            $editor->syncPermissions(['manage-pages', 'manage-blogs', 'manage-universities', 'manage-courses']);

            $partner = Role::create(['name' => 'Partner', 'guard_name' => 'web']);
            $partner->syncPermissions(['manage-universities', 'manage-courses']);
        } else {
            // Ensure Partner role exists if roles already exist
            $partnerRole = Role::firstOrCreate(['name' => 'Partner', 'guard_name' => 'web']);
            if ($partnerRole->wasRecentlyCreated) {
                $partnerRole->syncPermissions(['manage-universities', 'manage-courses']);
            }

            // Ensure Student role exists
            Role::firstOrCreate(['name' => 'Student', 'guard_name' => 'web']);
        }

        $roles = Role::with('permissions')->orderBy('id', 'asc')->get();
        $permissions = Permission::all();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', "Role '{$role->name}' created successfully.");
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', "Role '{$role->name}' updated successfully.");
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $role = Role::findOrFail($id);

        if (strtolower($role->name) === 'super admin' || $role->id === 1) {
            return redirect()->route('admin.roles.index')
                ->with('error', 'Cannot delete the core Super Admin role.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', "Role deleted successfully.");
    }
}
