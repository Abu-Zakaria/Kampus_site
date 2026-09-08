<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentApplication;
use App\Models\StudentConversation;
use App\Models\StudentMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentMessageController extends Controller
{
    /**
     * Display the Admin Student Messages workstation.
     */
    public function index(Request $request)
    {
        $filter = $request->input('filter', 'all');
        $search = $request->input('search');
        $selectedId = $request->input('conversation_id');

        // Query conversations query
        $query = StudentConversation::with([
            'student:id,name,email',
            'latestMessage.sender:id,name',
        ]);

        // Filter status / unread
        if ($filter === 'unread') {
            $query->where('admin_unread_count', '>', 0);
        } elseif ($filter === 'open') {
            $query->where('status', 'open');
        } elseif ($filter === 'resolved') {
            $query->where('status', 'resolved');
        }

        // Search
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('messages', function ($mq) use ($search) {
                        $mq->where('message', 'like', "%{$search}%");
                    });
            });
        }

        $conversations = $query->orderBy('last_message_at', 'desc')->get();

        // Overall stats
        $stats = [
            'total' => StudentConversation::count(),
            'unread' => StudentConversation::where('admin_unread_count', '>', 0)->count(),
            'open' => StudentConversation::where('status', 'open')->count(),
            'resolved' => StudentConversation::where('status', 'resolved')->count(),
        ];

        // Active conversation resolution
        $activeConversation = null;
        $studentApplications = [];

        if ($selectedId) {
            $activeConversation = StudentConversation::with([
                'student:id,name,email',
                'messages' => function ($mq) {
                    $mq->with('sender:id,name,email')->orderBy('created_at', 'asc');
                }
            ])->find($selectedId);
        }

        if (!$activeConversation && $conversations->isNotEmpty()) {
            $activeConversation = StudentConversation::with([
                'student:id,name,email',
                'messages' => function ($mq) {
                    $mq->with('sender:id,name,email')->orderBy('created_at', 'asc');
                }
            ])->find($conversations->first()->id);
        }

        if ($activeConversation) {
            // Auto mark messages as read for admin if there were unread messages
            if ($activeConversation->admin_unread_count > 0) {
                $activeConversation->markAsReadByAdmin();
                // Refresh to reflect updated count
                $activeConversation->admin_unread_count = 0;
            }

            // Fetch student admission applications for quick counselor context
            $studentApplications = StudentApplication::where('user_id', $activeConversation->user_id)
                ->orWhere('applicant_email', $activeConversation->student?->email)
                ->select('id', 'application_no', 'university_name', 'course_title', 'status', 'applied_at')
                ->orderBy('id', 'desc')
                ->take(5)
                ->get();
        }

        // List of all student users for initiating a new thread
        $studentsList = User::role('Student')
            ->select('id', 'name', 'email')
            ->orderBy('name', 'asc')
            ->take(100)
            ->get();

        // Fallback if no specific role 'Student' users found, get non-admin users
        if ($studentsList->isEmpty()) {
            $studentsList = User::where('id', '!=', auth()->id())
                ->select('id', 'name', 'email')
                ->orderBy('name', 'asc')
                ->take(100)
                ->get();
        }

        return Inertia::render('Admin/Messages/Index', [
            'conversations' => $conversations,
            'activeConversation' => $activeConversation,
            'studentApplications' => $studentApplications,
            'studentsList' => $studentsList,
            'stats' => $stats,
            'filters' => [
                'filter' => $filter,
                'search' => $search ?? '',
                'conversation_id' => $activeConversation?->id,
            ],
        ]);
    }

    /**
     * Send an admin reply in a student conversation.
     */
    public function reply(Request $request, $id)
    {
        $conversation = StudentConversation::findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        StudentMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => auth()->id(),
            'sender_type' => 'admin',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        $conversation->update([
            'last_message_at' => now(),
            'student_unread_count' => $conversation->student_unread_count + 1,
            'admin_unread_count' => 0,
        ]);

        return back()->with('success', 'Reply successfully sent to ' . ($conversation->student?->name ?? 'student') . '.');
    }

    /**
     * Admin initiates a new conversation thread with a student.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
        ]);

        $conversation = StudentConversation::create([
            'user_id' => $validated['user_id'],
            'subject' => $validated['subject'],
            'status' => 'open',
            'priority' => $validated['priority'] ?? 'normal',
            'student_unread_count' => 1,
            'admin_unread_count' => 0,
            'last_message_at' => now(),
        ]);

        StudentMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => auth()->id(),
            'sender_type' => 'admin',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return redirect()->route('admin.messages.index', ['conversation_id' => $conversation->id])
            ->with('success', 'New conversation initiated with student.');
    }

    /**
     * Toggle conversation status (open <-> resolved).
     */
    public function toggleStatus(Request $request, $id)
    {
        $conversation = StudentConversation::findOrFail($id);

        $newStatus = $conversation->status === 'resolved' ? 'open' : 'resolved';
        $conversation->update(['status' => $newStatus]);

        $statusLabel = $newStatus === 'resolved' ? 'resolved' : 'reopened';

        return back()->with('success', "Conversation marked as {$statusLabel}.");
    }

    /**
     * Remove the conversation thread and all messages.
     */
    public function destroy($id)
    {
        $conversation = StudentConversation::findOrFail($id);
        $conversation->delete();

        return redirect()->route('admin.messages.index')
            ->with('success', 'Conversation thread deleted successfully.');
    }
}
