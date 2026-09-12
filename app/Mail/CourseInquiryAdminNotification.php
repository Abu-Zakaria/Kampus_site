<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Models\StudentApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CourseInquiryAdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    public ContactMessage $inquiry;
    public ?StudentApplication $application;
    public array $details;

    /**
     * Create a new message instance.
     *
     * @param ContactMessage $inquiry
     * @param StudentApplication|null $application
     * @param array $details
     */
    public function __construct(
        ContactMessage $inquiry,
        ?StudentApplication $application = null,
        array $details = []
    ) {
        $this->inquiry = $inquiry;
        $this->application = $application;
        $this->details = $details;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $courseTitle = $this->details['course_title'] ?? $this->application?->course_title ?? 'Degree Programme';
        $applicantName = $this->inquiry->name ?: 'Prospective Student';

        $replyToAddress = [];
        if (!empty($this->inquiry->email) && filter_var($this->inquiry->email, FILTER_VALIDATE_EMAIL)) {
            $replyToAddress[] = new Address($this->inquiry->email, $applicantName);
        }

        return new Envelope(
            subject: "[New Course Enquiry] {$applicantName} - {$courseTitle}",
            replyTo: $replyToAddress,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $adminInquiriesUrl = url('/admin/inquiries');
        $adminApplicationsUrl = url('/admin/student-applications');

        return new Content(
            view: 'emails.course-inquiry-admin',
            with: [
                'inquiry' => $this->inquiry,
                'application' => $this->application,
                'details' => $this->details,
                'adminInquiriesUrl' => $adminInquiriesUrl,
                'adminApplicationsUrl' => $adminApplicationsUrl,
            ],
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
