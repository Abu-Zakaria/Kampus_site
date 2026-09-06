<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InquiryController extends Controller
{
    /**
     * Display a listing of all contact inquiries.
     */
    public function index()
    {
        $messages = ContactMessage::with(['repliedBy:id,name', 'user:id,name,email'])->orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Inquiries/Index', [
            'messages' => $messages,
        ]);
    }

    /**
     * Toggle the is_read status of a contact message.
     */
    public function update(Request $request, $id)
    {
        $message = ContactMessage::findOrFail($id);

        $validated = $request->validate([
            'is_read' => 'required|boolean',
        ]);

        $message->update($validated);

        $status = $validated['is_read'] ? 'read' : 'unread';

        return back()->with('success', "Message marked as {$status}.");
    }

    /**
     * Remove the specified contact message.
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return redirect()->route('admin.inquiries.index')
            ->with('success', 'Contact message deleted successfully.');
    }

    /**
     * Store a new contact or consultation message from public-facing forms.
     */
    public function store(Request $request)
    {
        // Handle name if split into firstName / lastName
        $name = $request->input('name');
        if (!$name && ($request->filled('firstName') || $request->filled('lastName'))) {
            $name = trim($request->input('firstName', '') . ' ' . $request->input('lastName', ''));
        }

        // Handle phone if split into dialCode / mobile
        $phone = $request->input('phone');
        if (!$phone && $request->filled('mobile')) {
            $phone = trim($request->input('dialCode', '') . ' ' . $request->input('mobile', ''));
        }

        // Handle topic
        $topic = $request->input('topic');
        if (!$topic) {
            if ($request->filled('subject')) {
                $topic = 'Consultation: ' . $request->input('subject') . ($request->filled('studyLevel') ? ' (' . $request->input('studyLevel') . ')' : '');
            } else {
                $topic = 'Expert Consultation Request';
            }
        }

        // Handle message construction if not explicitly provided
        $message = $request->input('message');
        if (!$message) {
            $details = [];
            if ($request->filled('country')) {
                $details[] = "Country of Residence: " . $request->input('country');
            }
            if ($request->filled('studyLevel')) {
                $details[] = "Study Level: " . $request->input('studyLevel');
            }
            if ($request->filled('subject')) {
                $details[] = "Subject of Interest: " . $request->input('subject');
            }
            if ($request->filled('article_title')) {
                $details[] = "Source Article: " . $request->input('article_title');
            }
            if ($request->filled('notes')) {
                $details[] = "Notes: " . $request->input('notes');
            }

            $message = !empty($details)
                ? "Free Expert Consultation Request:\n" . implode("\n", $details)
                : "Free Consultation Request submitted from website.";
        }

        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        if (empty($name)) {
            $name = 'Prospective Student';
        }

        $contactMessage = ContactMessage::create([
            'user_id' => auth()->id(),
            'name' => $name,
            'email' => $validated['email'],
            'phone' => $phone,
            'topic' => $topic,
            'message' => $message,
            'is_read' => false,
        ]);

        if ($request->expectsJson() || $request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you for reaching out! A counselor will respond within 24 hours.',
                'data' => $contactMessage,
            ]);
        }

        return back()->with('success', 'Thank you for reaching out! A counselor will respond within 24 hours.');
    }

    /**
     * Store admin/counselor reply to a contact inquiry.
     */
    public function reply(Request $request, $id)
    {
        $message = ContactMessage::findOrFail($id);

        $validated = $request->validate([
            'reply_message' => 'required|string|max:5000',
        ]);

        $message->update([
            'reply_message' => $validated['reply_message'],
            'replied_at' => now(),
            'replied_by' => auth()->id(),
            'is_read' => true,
        ]);

        return back()->with('success', "Reply successfully sent to {$message->name}.");
    }
}
