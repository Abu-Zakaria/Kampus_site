<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryReplyStudentMail extends Mailable
{
    use Queueable, SerializesModels;

    public ContactMessage $contactMessage;
    public string $replyMessage;
    public ?User $counselor;

    /**
     * Create a new message instance.
     */
    public function __construct(ContactMessage $contactMessage, string $replyMessage, ?User $counselor = null)
    {
        $this->contactMessage = $contactMessage;
        $this->replyMessage = $replyMessage;
        $this->counselor = $counselor;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $topic = $this->contactMessage->topic ?: 'Educational Consultation Inquiry';

        return new Envelope(
            subject: "Response from Kampus Education Counselor: {$topic}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.inquiry-reply-student',
            with: [
                'studentName' => $this->contactMessage->name ?: 'Student',
                'topic' => $this->contactMessage->topic ?: 'Educational Consultation',
                'originalMessage' => $this->contactMessage->message,
                'replyMessage' => $this->replyMessage,
                'counselorName' => $this->counselor?->name ?: 'Admissions & Visa Advisory Team',
                'repliedAt' => now()->format('M d, Y \a\t h:i A'),
                'portalUrl' => url('/student/dashboard?active_tab=queries'),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
