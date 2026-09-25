<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ScholarshipApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScholarshipApplicationController extends Controller
{
    /**
     * Display a listing of all scholarship applications.
     */
    public function index(Request $request)
    {
        $query = ScholarshipApplication::with('user:id,name,email')->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('application_no', 'like', "%{$search}%")
                    ->orWhere('scholarship_name', 'like', "%{$search}%")
                    ->orWhere('destination_country', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $applications = $query->get();

        $stats = [
            'total' => ScholarshipApplication::count(),
            'pending' => ScholarshipApplication::where('status', 'pending')->count(),
            'reviewed' => ScholarshipApplication::where('status', 'reviewed')->count(),
            'contacted' => ScholarshipApplication::where('status', 'contacted')->count(),
            'shortlisted' => ScholarshipApplication::where('status', 'shortlisted')->count(),
            'rejected' => ScholarshipApplication::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/ScholarshipApplications/Index', [
            'applications' => $applications,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Update the status and counselor remarks of a scholarship application.
     */
    public function updateStatus(Request $request, $id)
    {
        $application = ScholarshipApplication::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:pending,reviewed,contacted,shortlisted,rejected',
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $application->update($validated);

        return back()->with('success', "Scholarship application {$application->application_no} status updated to " . ucfirst($validated['status']) . ".");
    }

    /**
     * Remove the specified scholarship application.
     */
    public function destroy($id)
    {
        $application = ScholarshipApplication::findOrFail($id);
        $appNo = $application->application_no;
        $application->delete();

        return back()->with('success', "Application {$appNo} deleted successfully.");
    }
}
