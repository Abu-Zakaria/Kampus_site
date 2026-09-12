<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Course;
use App\Models\StudentApplication;
use App\Models\StudentConversation;
use App\Models\StudentMessage;
use App\Models\University;
use App\Models\User;
use App\Notifications\AdminAlertNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
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

        // Retrieve student's messaging conversation threads with counselors
        $conversations = StudentConversation::where('user_id', $user->id)
            ->with([
                'latestMessage.sender:id,name',
                'messages' => function ($mq) {
                    $mq->with('sender:id,name')->orderBy('created_at', 'asc');
                }
            ])
            ->orderBy('last_message_at', 'desc')
            ->get();

        // Determine active conversation if specified
        $selectedConversationId = $request->input('conversation_id');
        if ($selectedConversationId) {
            $activeConv = $conversations->firstWhere('id', $selectedConversationId);
            if ($activeConv && $activeConv->student_unread_count > 0) {
                $activeConv->markAsReadByStudent();
                $activeConv->student_unread_count = 0;
            }
        }

        // Retrieve student's profile, certificates and achievements
        $studentProfile = $user->studentProfile;
        $certificates = $user->certificates()->orderBy('issue_date', 'desc')->get();
        $achievements = $user->achievements()->orderBy('achievement_date', 'desc')->get();

        // Summary statistics
        $stats = [
            'total_applications' => $applications->count(),
            'active_applications' => $applications->whereNotIn('status', ['accepted', 'rejected'])->count(),
            'accepted_applications' => $applications->where('status', 'accepted')->count(),
            'total_inquiries' => $inquiries->count(),
            'replied_inquiries' => $inquiries->whereNotNull('reply_message')->count(),
            'pending_replies' => $inquiries->whereNull('reply_message')->count(),
            'total_conversations' => $conversations->count(),
            'unread_messages' => $conversations->sum('student_unread_count'),
            'total_certificates' => $certificates->count(),
            'verified_certificates' => $certificates->where('status', 'verified')->count(),
            'total_achievements' => $achievements->count(),
        ];

        // List of partner universities & courses for quick application modal
        $popularUniversities = University::with(['courses:id,university_id,title,level,intake,duration,tuition_fee'])
            ->select('id', 'name', 'slug')
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Student/Dashboard', [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at ? $user->created_at->format('M Y') : 'Member',
            ],
            'studentProfile' => $studentProfile,
            'certificates' => $certificates,
            'achievements' => $achievements,
            'applications' => $applications,
            'inquiries' => $inquiries,
            'conversations' => $conversations,
            'initialConversationId' => $selectedConversationId,
            'initialTab' => $request->input('active_tab'),
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
            'university_id' => 'nullable|integer',
            'university_name' => 'required|string|max:255',
            'course_id' => 'nullable|integer',
            'course_title' => 'required|string|max:255',
            'intake' => 'nullable|string|max:100',
            'level' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:2000',
        ]);

        // Generate clean unique application reference
        $appNo = 'KMP-' . date('Y') . '-' . str_pad(StudentApplication::count() + 1, 4, '0', STR_PAD_LEFT);

        // Find existing university if matched
        $uni = null;
        if (!empty($validated['university_id'])) {
            $uni = University::find($validated['university_id']);
        }
        if (!$uni && !empty($validated['university_name'])) {
            $uni = University::where('name', 'like', '%' . $validated['university_name'] . '%')->first();
        }

        $course = null;
        if (!empty($validated['course_id'])) {
            $course = Course::find($validated['course_id']);
        }
        if (!$course && !empty($validated['course_title'])) {
            $course = Course::where('title', 'like', '%' . $validated['course_title'] . '%')
                ->when($uni, fn($q) => $q->where('university_id', $uni->id))
                ->first();
        }

        $application = StudentApplication::create([
            'application_no' => $appNo,
            'user_id' => $user->id,
            'university_id' => $uni?->id,
            'course_id' => $course?->id,
            'university_name' => $uni ? $uni->name : $validated['university_name'],
            'course_title' => $course ? $course->title : $validated['course_title'],
            'applicant_name' => $user->name,
            'applicant_email' => $user->email,
            'applicant_phone' => $validated['phone'] ?? null,
            'intake' => $validated['intake'] ?? ($course?->intake ?: 'September 2026'),
            'level' => $validated['level'] ?? ($course?->level ?: 'Postgraduate'),
            'duration' => $course?->duration,
            'tuition_fee' => $course?->tuition_fee,
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

        // Dispatch email and database notification to admin(s)
        \App\Services\AdminNotificationService::notifyStudentApplication($application);

        return back()->with('success', "Your application #{$appNo} has been submitted! An educational advisor will review your profile shortly.");
    }
}
