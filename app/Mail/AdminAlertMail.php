<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $notificationTitle;
    public string $notificationMessage;
    public array $details;
    public ?string $actionUrl;
    public ?string $actionText;
    public ?string $badgeText;
    public ?string $replyToEmail;
    public ?string $replyToName;

    /**
     * Create a new message instance.
     */
    public function __construct(
        string $subject,
        string $notificationTitle,
        string $notificationMessage,
        array $details = [],
        ?string $actionUrl = null,
        ?string $actionText = null,
        ?string $badgeText = 'Admin Alert',
        ?string $replyToEmail = null,
        ?string $replyToName = null
    ) {
        $this->subject = $subject;
        $this->notificationTitle = $notificationTitle;
        $this->notificationMessage = $notificationMessage;
        $this->details = $details;
        $this->actionUrl = $actionUrl;
        $this->actionText = $actionText ?: 'View in Admin Panel';
        $this->badgeText = $badgeText ?: 'Admin Alert';
        $this->replyToEmail = $replyToEmail;
        $this->replyToName = $replyToName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $replyTo = [];
        if (!empty($this->replyToEmail) && filter_var($this->replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $replyTo[] = new Address($this->replyToEmail, $this->replyToName ?: 'Inquirer');
        }

        return new Envelope(
            subject: $this->subject,
            replyTo: $replyTo,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-alert',
            with: [
                'notificationTitle' => $this->notificationTitle,
                'notificationMessage' => $this->notificationMessage,
                'details' => $this->details,
                'actionUrl' => $this->actionUrl ?: url('/admin/inquiries'),
                'actionText' => $this->actionText,
                'badgeText' => $this->badgeText,
                'replyToEmail' => $this->replyToEmail,
                'replyToName' => $this->replyToName,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
