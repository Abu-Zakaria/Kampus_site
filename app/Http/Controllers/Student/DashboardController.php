<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Course;
use App\Models\StudentApplication;
use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the Student Portal / Dashboard.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Retrieve student's university admission applications
        $applications = StudentApplication::where('user_id', $user->id)
            ->orWhere('applicant_email', $user->email)
            ->with(['university:id,name,slug,logo', 'course:id,title,slug,level,tuition_fee,intake'])
            ->orderBy('id', 'desc')
            ->get();

        // Retrieve student's inquiries and consultation queries with admin replies
        $inquiries = ContactMessage::where('user_id', $user->id)
            ->orWhere('email', $user->email)
            ->with('repliedBy:id,name,email')
            ->orderBy('id', 'desc')
            ->get();

        // Summary statistics
        $stats = [
            'total_applications' => $applications->count(),
            'active_applications' => $applications->whereNotIn('status', ['accepted', 'rejected'])->count(),
            'accepted_applications' => $applications->where('status', 'accepted')->count(),
            'total_inquiries' => $inquiries->count(),
            'replied_inquiries' => $inquiries->whereNotNull('reply_message')->count(),
            'pending_replies' => $inquiries->whereNull('reply_message')->count(),
        ];

        // List of popular universities & courses for quick application modal
        $popularUniversities = University::select('id', 'name', 'slug')
            ->orderBy('name', 'asc')
            ->take(50)
            ->get();

        return Inertia::render('Student/Dashboard', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at ? $user->created_at->format('M Y') : 'Member',
            ],
            'applications' => $applications,
            'inquiries' => $inquiries,
            'stats' => $stats,
            'stages' => StudentApplication::getStages(),
            'universities' => $popularUniversities,
        ]);
    }

    /**
     * Submit a direct admission application from the student dashboard.
     */
    public function apply(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'university_name' => 'required|string|max:255',
            'course_title' => 'required|string|max:255',
            'intake' => 'nullable|string|max:100',
            'level' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:2000',
        ]);

        // Generate clean unique application reference
        $appNo = 'KMP-' . date('Y') . '-' . str_pad(StudentApplication::count() + 1, 4, '0', STR_PAD_LEFT);

        // Find existing university if matched
        $uni = University::where('name', 'like', '%' . $validated['university_name'] . '%')->first();

        $application = StudentApplication::create([
            'application_no' => $appNo,
            'user_id' => $user->id,
            'university_id' => $uni?->id,
            'university_name' => $validated['university_name'],
            'course_title' => $validated['course_title'],
            'applicant_name' => $user->name,
            'applicant_email' => $user->email,
            'applicant_phone' => $validated['phone'] ?? null,
            'intake' => $validated['intake'] ?? 'September 2026',
            'level' => $validated['level'] ?? 'Postgraduate',
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
            'applied_at' => now(),
            'status_history' => [
                [
                    'stage' => 'pending',
                    'title' => 'Application Submitted',
                    'timestamp' => now()->toIso8601String(),
                    'note' => 'Student lodged direct application via student portal.',
                ]
            ],
        ]);

        // Also create a linked inquiry for notifications
        ContactMessage::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $validated['phone'] ?? 'Not provided',
            'topic' => 'Direct Application: ' . $validated['course_title'] . ' at ' . $validated['university_name'],
            'message' => "Application #" . $appNo . "\nUniversity: " . $validated['university_name'] . "\nProgram: " . $validated['course_title'] . "\nIntake: " . ($validated['intake'] ?? 'Not specified') . "\nNotes: " . ($validated['notes'] ?? 'None'),
            'is_read' => false,
        ]);

        return back()->with('success', "Your application #{$appNo} has been submitted! An educational advisor will review your profile shortly.");
    }
}
