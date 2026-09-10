<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

        return Inertia::render('Admin/Dashboard');
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
