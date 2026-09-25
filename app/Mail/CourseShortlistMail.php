<?php

namespace App\Mail;

use App\Models\Setting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CourseShortlistMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $courses;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $courses)
    {
        $this->name = $name;
        $this->courses = $courses;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $siteName = Setting::get('site_name', config('app.name', 'RMS Consult'));

        return new Envelope(
            subject: "Your Personalized Course Shortlist - {$siteName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $siteName = Setting::get('site_name', config('app.name', 'RMS Consult'));
        $footerName = Setting::get('footer_name', $siteName);

        return new Content(
            view: 'emails.course_shortlist',
            with: [
                'name' => $this->name,
                'courses' => $this->courses,
                'siteName' => $siteName,
                'footerName' => $footerName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
