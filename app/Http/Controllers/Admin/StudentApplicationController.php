<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentApplicationController extends Controller
{
    /**
     * Display a listing of all student applications.
     */
    public function index(Request $request)
    {
        $query = StudentApplication::with(['user:id,name,email', 'university:id,name', 'course:id,title'])
            ->orderBy('id', 'desc');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('applicant_name', 'like', "%{$search}%")
                    ->orWhere('applicant_email', 'like', "%{$search}%")
                    ->orWhere('application_no', 'like', "%{$search}%")
                    ->orWhere('university_name', 'like', "%{$search}%")
                    ->orWhere('course_title', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        $applications = $query->get();

        $stats = [
            'total' => StudentApplication::count(),
            'pending' => StudentApplication::where('status', 'pending')->count(),
            'processing' => StudentApplication::where('status', 'processing')->count(),
            'submitted' => StudentApplication::where('status', 'submitted_to_university')->count(),
            'offer_issued' => StudentApplication::where('status', 'offer_issued')->count(),
            'visa' => StudentApplication::where('status', 'visa_processing')->count(),
            'accepted' => StudentApplication::where('status', 'accepted')->count(),
            'rejected' => StudentApplication::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/StudentApplications/Index', [
            'applications' => $applications,
            'stats' => $stats,
            'stages' => StudentApplication::getStages(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Update the stage/status and counselor remarks of an application.
     */
    public function updateStatus(Request $request, $id)
    {
        $application = StudentApplication::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,submitted_to_university,offer_issued,visa_processing,accepted,rejected',
            'counselor_remarks' => 'nullable|string|max:3000',
        ]);

        $stages = StudentApplication::getStages();
        $stageTitle = $stages[$validated['status']]['label'] ?? ucfirst($validated['status']);

        $history = $application->status_history ?? [];
        $history[] = [
            'stage' => $validated['status'],
            'title' => $stageTitle,
            'timestamp' => now()->toIso8601String(),
            'note' => $validated['counselor_remarks'] ?? "Status updated to {$stageTitle}",
            'updated_by' => auth()->user()->name ?? 'Admissions Counselor',
        ];

        $application->update([
            'status' => $validated['status'],
            'counselor_remarks' => $validated['counselor_remarks'] ?? $application->counselor_remarks,
            'status_history' => $history,
            'status_updated_at' => now(),
        ]);

        return back()->with('success', "Application #{$application->application_no} status updated to \"{$stageTitle}\".");
    }

    /**
     * Remove the specified student application.
     */
    public function destroy($id)
    {
        $application = StudentApplication::findOrFail($id);
        $appNo = $application->application_no;
        $application->delete();

        return back()->with('success', "Application #{$appNo} has been deleted.");
    }
}
