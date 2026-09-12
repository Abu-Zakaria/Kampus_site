<?php

namespace App\Mail;

use App\Models\PartnerApplication;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PartnerApprovedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 60;

    public PartnerApplication $application;
    public User $user;
    public ?string $magicLoginUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(
        PartnerApplication $application,
        User $user,
        ?string $magicLoginUrl = null
    ) {
        $this->application = $application;
        $this->user = $user;
        $this->magicLoginUrl = $magicLoginUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $siteName = Setting::get('site_name', config('app.name', 'Kampus Edu'));

        return new Envelope(
            subject: "Congratulations! Your {$siteName} Partnership Application Has Been Approved",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $magicLoginUrl = $this->magicLoginUrl ?: \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'partner.magic-login',
            now()->addDays(7),
            ['user' => $this->user->id]
        );

        $displayEmail = (!empty($this->user->email) && !str_ends_with($this->user->email, '@placeholder.local'))
            ? $this->user->email
            : $this->application->email;

        $siteName = Setting::get('site_name', config('app.name', 'Kampus Edu'));
        $footerName = Setting::get('footer_name', $siteName);

        return new Content(
            view: 'emails.partner-approved',
            with: [
                'companyName' => $this->application->company_name,
                'contactPerson' => $this->application->contact_person,
                'email' => $displayEmail,
                'magicLoginUrl' => $magicLoginUrl,
                'siteName' => $siteName,
                'footerName' => $footerName,
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
