<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentAchievement;
use App\Models\StudentCertificate;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of students with their profiles, certificate & achievement counts.
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['studentProfile', 'certificates', 'achievements'])
            ->withCount(['certificates', 'achievements', 'studentApplications'])
            ->where(function ($q) {
                $q->whereHas('roles', function ($rq) {
                    $rq->where('name', 'Student');
                })->orWhereDoesntHave('roles');
            })
            ->where('id', '!=', 1);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('studentProfile', function ($sq) use ($search) {
                        $sq->where('phone', 'like', "%{$search}%")
                            ->orWhere('nationality', 'like', "%{$search}%")
                            ->orWhere('target_destination', 'like', "%{$search}%")
                            ->orWhere('current_education_level', 'like', "%{$search}%");
                    });
            });
        }

        $students = $query->orderBy('id', 'desc')->get();

        // Calculate platform statistics for students
        $stats = [
            'total_students' => User::where(function ($q) {
                $q->whereHas('roles', fn($rq) => $rq->where('name', 'Student'))
                    ->orWhereDoesntHave('roles');
            })->where('id', '!=', 1)->count(),
            'total_certificates' => StudentCertificate::count(),
            'verified_certificates' => StudentCertificate::where('status', 'verified')->count(),
            'pending_certificates' => StudentCertificate::where('status', 'submitted')->count(),
            'total_achievements' => StudentAchievement::count(),
        ];

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Display a single student's complete profile & portfolio.
     */
    public function show($id)
    {
        $student = User::with([
            'studentProfile',
            'certificates.verifier:id,name',
            'achievements',
            'studentApplications' => function ($q) {
                $q->orderBy('id', 'desc');
            },
            'studentConversations' => function ($q) {
                $q->with('latestMessage')->orderBy('last_message_at', 'desc');
            }
        ])
        ->withCount(['certificates', 'achievements', 'studentApplications'])
        ->findOrFail($id);

        return response()->json([
            'student' => $student,
        ]);
    }

    /**
     * Verify or update status of a student certificate.
     */
    public function verifyCertificate(Request $request, $id)
    {
        $certificate = StudentCertificate::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:submitted,verified,rejected',
            'counselor_remarks' => 'nullable|string|max:1000',
        ]);

        $certificate->update([
            'status' => $validated['status'],
            'counselor_remarks' => $validated['counselor_remarks'] ?? $certificate->counselor_remarks,
            'verified_at' => $validated['status'] === 'verified' ? now() : null,
            'verified_by' => $validated['status'] === 'verified' ? auth()->id() : null,
        ]);

        return back()->with('success', "Certificate \"{$certificate->title}\" status updated to " . ucfirst($validated['status']) . ".");
    }

    /**
     * Verify or update status of a student achievement.
     */
    public function verifyAchievement(Request $request, $id)
    {
        $achievement = StudentAchievement::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:submitted,verified',
        ]);

        $achievement->update([
            'status' => $validated['status'],
        ]);

        return back()->with('success', "Achievement \"{$achievement->title}\" status updated to " . ucfirst($validated['status']) . ".");
    }
}
