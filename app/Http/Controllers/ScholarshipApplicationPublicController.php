<?php

namespace App\Http\Controllers;

use App\Models\ScholarshipApplication;
use App\Services\AdminNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ScholarshipApplicationPublicController extends Controller
{
    /**
     * Handle public scholarship application submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'scholarship_name' => 'required|string|max:255',
            'destination_country' => 'nullable|string|max:255',
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'nationality' => 'nullable|string|max:255',
            'highest_qualification' => 'nullable|string|max:255',
            'gpa' => 'nullable|string|max:50',
            'desired_intake' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:3000',
        ]);

        $validated['application_no'] = ScholarshipApplication::generateApplicationNumber();
        $validated['status'] = 'pending';
        
        if (auth()->check()) {
            $validated['user_id'] = auth()->id();
        }

        $application = ScholarshipApplication::create($validated);

        // Send In-App Database Notification and Email alert to Administrators
        try {
            AdminNotificationService::notifyScholarshipApplication($application);
        } catch (\Throwable $e) {
            Log::error('ScholarshipApplicationPublicController: Failed to notify admins: ' . $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Your scholarship application has been submitted successfully! Ref: {$application->application_no}",
                'application_no' => $application->application_no,
            ]);
        }

        return back()->with([
            'success' => "Your scholarship application has been submitted successfully! Ref: {$application->application_no}",
            'application_no' => $application->application_no,
        ]);
    }
}
