<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Course;
use App\Models\PartnerApplication;
use App\Models\StudentApplication;
use App\Models\University;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the Admin Dashboard.
     */
    public function index(Request $request)
    {
        if ($request->user()->isStudent()) {
            return redirect()->route('student.dashboard');
        }

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfDay = $now->copy()->startOfDay();

        $partnerTotal = PartnerApplication::count();
        $partnerPending = PartnerApplication::where('status', 'pending')->count();
        $studentTotal = StudentApplication::count();
        $studentPending = StudentApplication::where('status', 'pending')->count();

        // Support both Partner and Student applications
        $applicationsTotal = $partnerTotal + $studentTotal;
        $applicationsPending = $partnerPending + $studentPending;

        $stats = [
            'universities' => [
                'total' => University::count(),
                'this_month' => University::where('created_at', '>=', $startOfMonth)->count(),
            ],
            'courses' => [
                'total' => Course::count(),
                'this_month' => Course::where('created_at', '>=', $startOfMonth)->count(),
            ],
            'applications' => [
                'total' => $applicationsTotal,
                'pending' => $applicationsPending,
            ],
            'inquiries' => [
                'total' => ContactMessage::count(),
                'today' => ContactMessage::where('created_at', '>=', $startOfDay)->count(),
            ],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Mark admin notifications as read.
     */
    public function markNotificationsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($request->filled('id')) {
            $user->unreadNotifications()->where('id', $request->input('id'))->update(['read_at' => now()]);
        } else {
            $user->unreadNotifications->markAsRead();
        }

        return response()->json([
            'success' => true,
            'message' => 'Notifications marked as read.',
        ]);
    }
}
