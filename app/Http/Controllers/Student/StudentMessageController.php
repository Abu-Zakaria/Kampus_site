<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\StudentConversation;
use App\Models\StudentMessage;
use Illuminate\Http\Request;

class StudentMessageController extends Controller
{
    /**
     * Start a new conversation thread with Admin/Counselor.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
            'priority' => 'nullable|string|in:low,normal,high,urgent',
        ]);

        $user = $request->user();

        $conversation = StudentConversation::create([
            'user_id' => $user->id,
            'subject' => $validated['subject'],
            'status' => 'open',
            'priority' => $validated['priority'] ?? 'normal',
            'student_unread_count' => 0,
            'admin_unread_count' => 1,
            'last_message_at' => now(),
        ]);

        $studentMessage = StudentMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'sender_type' => 'student',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        // Dispatch email notification to admin(s)
        \App\Services\AdminNotificationService::notifyStudentMessage($conversation, $studentMessage, $user);

        return redirect()->route('student.dashboard', ['active_tab' => 'messages', 'conversation_id' => $conversation->id])
            ->with('success', 'Your message has been sent to our admissions counselors! You will receive a response shortly.');
    }

    /**
     * Send a follow-up reply in an existing conversation.
     */
    public function reply(Request $request, $id)
    {
        $user = $request->user();

        $conversation = StudentConversation::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $studentMessage = StudentMessage::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->id,
            'sender_type' => 'student',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        $conversation->update([
            'last_message_at' => now(),
            'admin_unread_count' => $conversation->admin_unread_count + 1,
            'status' => 'open', // Reopen conversation if it was marked resolved
        ]);

        // Dispatch email notification to admin(s)
        \App\Services\AdminNotificationService::notifyStudentMessage($conversation, $studentMessage, $user);

        return back()->with('success', 'Reply sent successfully.');
    }

    /**
     * Mark conversation messages from admin as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $conversation = StudentConversation::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $conversation->markAsReadByStudent();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return back();
    }
}
