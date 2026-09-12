<?php

namespace App\Services;

use App\Mail\AdminAlertMail;
use App\Models\ContactMessage;
use App\Models\PartnerApplication;
use App\Models\Setting;
use App\Models\StudentApplication;
use App\Models\StudentConversation;
use App\Models\StudentMessage;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class AdminNotificationService
{
    /**
     * Resolve all verified administrator email addresses.
     *
     * @return array<string>
     */
    public static function getAdminEmails(): array
    {
        $emails = [];

        // 1. Explicit admin notification email setting
        try {
            $settingNotificationEmail = Setting::where('key', 'admin_notification_email')->value('value');
            if (!empty($settingNotificationEmail)) {
                $splits = preg_split('/[,\s;]+/', $settingNotificationEmail, -1, PREG_SPLIT_NO_EMPTY);
                foreach ($splits as $email) {
                    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                        $emails[] = strtolower(trim($email));
                    }
                }
            }

            $contactEmail = Setting::where('key', 'contact_email')->value('value');
            if (!empty($contactEmail) && filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
                $emails[] = strtolower(trim($contactEmail));
            }
        } catch (\Throwable $e) {
            Log::warning('AdminNotificationService: Error reading settings table: ' . $e->getMessage());
        }

        // 2. Administrators & Super Admin users
        try {
            $adminUsers = User::where(function ($query) {
                $query->where('id', 1)
                    ->orWhereHas('roles', function ($r) {
                        $r->whereIn('name', ['Super Admin', 'Admin']);
                    });
            })->whereNotNull('email')->pluck('email')->toArray();

            foreach ($adminUsers as $adminEmail) {
                $trimmed = strtolower(trim($adminEmail));
                if (!empty($trimmed) && filter_var($trimmed, FILTER_VALIDATE_EMAIL) && !str_ends_with($trimmed, '@placeholder.local')) {
                    $emails[] = $trimmed;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('AdminNotificationService: Error reading admin users: ' . $e->getMessage());
        }

        // 3. Fallback to default system from-address
        if (empty($emails)) {
            $fromAddress = config('mail.from.address');
            if (!empty($fromAddress) && filter_var($fromAddress, FILTER_VALIDATE_EMAIL)) {
                $emails[] = strtolower(trim($fromAddress));
            }
        }

        return array_values(array_unique($emails));
    }

    /**
     * Send generic admin alert email to all administrators.
     */
    public static function sendAlert(
        string $subject,
        string $title,
        string $message,
        array $details = [],
        ?string $actionUrl = null,
        ?string $actionText = null,
        ?string $badgeText = 'Admin Alert',
        ?string $replyToEmail = null,
        ?string $replyToName = null
    ): void {
        $recipients = self::getAdminEmails();
        if (empty($recipients)) {
            return;
        }

        try {
            Mail::to($recipients)->send(new AdminAlertMail(
                $subject,
                $title,
                $message,
                $details,
                $actionUrl,
                $actionText,
                $badgeText,
                $replyToEmail,
                $replyToName
            ));
        } catch (\Throwable $e) {
            Log::error('AdminNotificationService: Failed to send admin alert email: ' . $e->getMessage(), [
                'subject' => $subject,
                'recipients' => $recipients,
            ]);
        }
    }

    /**
     * Trigger email notification for new contact/consultation messages.
     */
    public static function notifyContactMessage(ContactMessage $contactMessage): void
    {
        $subject = "[New Inquiry] {$contactMessage->name} — " . ($contactMessage->topic ?: 'General Inquiry');
        $title = 'New Student Inquiry / Consultation';
        $message = "A new inquiry message was lodged on the Kampus website from {$contactMessage->name}.";

        $details = [
            'Applicant Name' => $contactMessage->name,
            'Email Address' => $contactMessage->email,
            'Phone Number' => $contactMessage->phone ?: 'Not provided',
            'Subject / Topic' => $contactMessage->topic ?: 'General Educational Inquiry',
            'Inquiry Details' => $contactMessage->message,
        ];

        self::sendAlert(
            $subject,
            $title,
            $message,
            $details,
            url('/admin/inquiries'),
            'Open Inquiry in Admin Panel',
            'NEW INQUIRY',
            $contactMessage->email,
            $contactMessage->name
        );
    }

    /**
     * Trigger email notification for automated call booking.
     */
    public static function notifyCallBooking(ContactMessage $contactMessage, array $validated): void
    {
        $destination = $validated['destination'] ?? 'Study Abroad';
        $subject = "[Call Booking] {$validated['name']} — {$destination}";
        $title = 'Automated Consultation Call Booked';
        $message = "{$validated['name']} has booked an expert education advisory phone consultation.";

        $details = [
            'Student Name' => $validated['name'],
            'Email Address' => $validated['email'],
            'Phone Number' => $validated['phone'],
            'Destination' => $destination,
            'Level of Study' => $validated['level_of_study'] ?? 'N/A',
            'Preferred Date' => $validated['date'] ?? 'Flexible',
            'Preferred Time' => $validated['time'] ?? 'Flexible',
            'Country of Residence' => $validated['country'] ?? 'Not specified',
        ];

        self::sendAlert(
            $subject,
            $title,
            $message,
            $details,
            url('/admin/inquiries'),
            'View Booking in Admin Panel',
            'CALL BOOKING',
            $validated['email'],
            $validated['name']
        );
    }

    /**
     * Trigger email notification for AI course matcher lead.
     */
    public static function notifyCourseMatcherLead(ContactMessage $contactMessage, array $criteria): void
    {
        $name = $contactMessage->name;
        $subject = "[Course Matcher Lead] {$name} — " . ($criteria['Field of Study'] ?? 'Academic Guidance');
        $title = 'AI Course Matcher Shortlist Request';
        $message = "A student has requested full course brochures and guidance via the AI Course Matcher tool.";

        $details = [
            'Student Name' => $name,
            'Email Address' => $contactMessage->email,
            'Phone Number' => $contactMessage->phone,
            ...$criteria,
        ];

        self::sendAlert(
            $subject,
            $title,
            $message,
            $details,
            url('/admin/inquiries'),
            'View Lead in Admin Panel',
            'COURSE MATCHER LEAD',
            $contactMessage->email,
            $name
        );
    }

    /**
     * Trigger email notification when student sends message or reply.
     */
    public static function notifyStudentMessage(StudentConversation $conversation, StudentMessage $studentMessage, User $student): void
    {
        $subject = "[Student Message] {$student->name} — {$conversation->subject}";
        $title = 'New Message in Student Conversation';
        $message = "{$student->name} has sent a new message to admissions counselors in conversation thread #{$conversation->id}.";

        $details = [
            'Student Name' => $student->name,
            'Student Email' => $student->email,
            'Conversation Subject' => $conversation->subject,
            'Priority' => ucfirst($conversation->priority ?? 'Normal'),
            'Message Content' => $studentMessage->message,
        ];

        self::sendAlert(
            $subject,
            $title,
            $message,
            $details,
            url('/admin/messages'),
            'Open Conversation Thread',
            'STUDENT MESSAGE',
            $student->email,
            $student->name
        );
    }

    /**
     * Trigger email notification when student submits admission application.
     */
    public static function notifyStudentApplication(StudentApplication $application): void
    {
        $subject = "[New Admission Application] {$application->applicant_name} — {$application->course_title}";
        $title = 'New University Admission Application';
        $message = "A direct student admission application (Ref: {$application->application_no}) has been submitted.";

        $details = [
            'Application Ref' => $application->application_no,
            'Applicant Name' => $application->applicant_name,
            'Applicant Email' => $application->applicant_email,
            'Applicant Phone' => $application->applicant_phone ?: 'Not provided',
            'Course Title' => $application->course_title,
            'University Name' => $application->university_name,
            'Study Level' => $application->level,
            'Intake Term' => $application->intake,
            'Duration' => $application->duration,
            'Tuition Fee' => $application->tuition_fee,
            'Applicant Notes' => $application->notes,
        ];

        self::sendAlert(
            $subject,
            $title,
            $message,
            $details,
            url('/admin/student-applications'),
            'Review Student Application',
            'ADMISSION APPLICATION',
            $application->applicant_email,
            $application->applicant_name
        );
    }

    /**
     * Trigger email notification for new partner application.
     */
    public static function notifyPartnerApplication(PartnerApplication $application): void
    {
        $subject = "[New Partner Application] {$application->company_name} — {$application->contact_person}";
        $title = 'New Educational Partnership Application';
        $message = "An agency or institutional representative has applied to partner with Kampus.";

        $details = [
            'Company / Agency' => $application->company_name,
            'Contact Person' => $application->contact_person,
            'Email Address' => $application->email,
            'Phone Number' => $application->phone,
            'Country' => $application->country,
            'Years in Business' => $application->years_in_business ?: 'Not specified',
            'Proposal / Message' => $application->message,
        ];

        self::sendAlert(
            $subject,
            $title,
            $message,
            $details,
            url('/admin/partners'),
            'Review Partner Application',
            'PARTNER APPLICATION',
            $application->email,
            $application->contact_person
        );
    }
}
