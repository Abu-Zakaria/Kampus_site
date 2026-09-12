<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of all Employees and Company Workforce stats.
     */
    public function index()
    {
        $employees = Employee::orderBy('sort_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $stats = [
            'total' => Employee::count(),
            'active' => Employee::where('is_active', true)->count(),
            'inactive' => Employee::where('is_active', false)->count(),
            'company_employee_count' => Setting::where('key', 'company_employee_count')->value('value') ?? '65+ Global Team Members',
            'company_employee_stat_subtext' => Setting::where('key', 'company_employee_stat_subtext')->value('value') ?? 'Dedicated education consultants, visa case officers, and support staff across 15+ countries worldwide.',
            'company_team_heading' => Setting::where('key', 'company_team_heading')->value('value') ?? 'Meet our global education leadership',
            'company_team_subheading' => Setting::where('key', 'company_team_subheading')->value('value') ?? 'Driven by ethics, academic expertise, and student success, our multi-disciplinary team brings decades of university admissions experience.',
        ];

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new Employee.
     */
    public function create()
    {
        return Inertia::render('Admin/Employees/Form', [
            'employee' => null,
        ]);
    }

    /**
     * Store a newly created Employee in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'quote' => 'nullable|string|max:1000',
            'email' => 'nullable|email|max:255',
            'linkedin_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string|max:1000',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        // Process image: upload file takes precedence over direct image_url
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('employees', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (!empty($validated['image_url'])) {
            $validated['image'] = $validated['image_url'];
        }

        unset($validated['image_url']);

        Employee::create($validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Team member added successfully.');
    }

    /**
     * Show the form for editing the specified Employee.
     */
    public function edit(Employee $employee)
    {
        return Inertia::render('Admin/Employees/Form', [
            'employee' => $employee,
        ]);
    }

    /**
     * Update the specified Employee in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'quote' => 'nullable|string|max:1000',
            'email' => 'nullable|email|max:255',
            'linkedin_url' => 'nullable|string|max:500',
            'image' => 'nullable|image|max:5120',
            'image_url' => 'nullable|string|max:1000',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);

        // Process image: upload file
        if ($request->hasFile('image')) {
            if ($employee->image && str_contains($employee->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $employee->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('employees', 'public');
            $validated['image'] = '/storage/' . $path;
        } elseif (!empty($validated['image_url'])) {
            $validated['image'] = $validated['image_url'];
        }

        unset($validated['image_url']);

        $employee->update($validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Team member details updated successfully.');
    }

    /**
     * Toggle active status of the specified Employee.
     */
    public function toggleStatus(Employee $employee)
    {
        $employee->update([
            'is_active' => !$employee->is_active,
        ]);

        return back()->with('success', 'Team member status updated.');
    }

    /**
     * Remove the specified Employee from storage.
     */
    public function destroy(Employee $employee)
    {
        if ($employee->image && str_contains($employee->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $employee->image);
            Storage::disk('public')->delete($oldPath);
        }

        $employee->delete();

        return redirect()->route('admin.employees.index')
            ->with('success', 'Team member removed successfully.');
    }

    /**
     * Update Company Employee Count and Team Section Settings.
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'company_employee_count' => 'required|string|max:100',
            'company_employee_stat_subtext' => 'nullable|string|max:255',
            'company_team_heading' => 'nullable|string|max:255',
            'company_team_subheading' => 'nullable|string|max:500',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        return back()->with('success', 'Company workforce & team settings updated successfully.');
    }
}
