<?php

namespace Tests\Feature;

use App\Mail\AdminAlertMail;
use App\Models\ContactMessage;
use App\Models\Course;
use App\Models\PartnerApplication;
use App\Models\Setting;
use App\Models\StudentConversation;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminNotificationEmailTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        if (class_exists(Role::class)) {
            Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
            Role::firstOrCreate(['name' => 'Student', 'guard_name' => 'web']);
        }

        // Create admin recipient
        $this->admin = User::factory()->create([
            'email' => 'admin.chief@kampusedu.com',
        ]);
        $this->admin->assignRole('Super Admin');

        Setting::create([
            'key' => 'admin_notification_email',
            'value' => 'alerts@kampusedu.com',
        ]);
    }

    public function test_contact_form_inquiry_sends_email_notification_to_admin()
    {
        Mail::fake();

        $response = $this->post('/contact/submit', [
            'name' => 'David Miller',
            'email' => 'david@example.com',
            'phone' => '+44 7711 223344',
            'subject' => 'Visa Requirements',
            'message' => 'I have questions regarding tier 4 student visa application deadlines.',
        ]);

        $response->assertSessionHas('success');

        Mail::assertSent(AdminAlertMail::class, function ($mail) {
            $hasAlertRecipient = $mail->hasTo('alerts@kampusedu.com') || $mail->hasTo('admin.chief@kampusedu.com');
            $matchesSubject = str_contains($mail->envelope()->subject, 'David Miller');
            $matchesBadge = $mail->badgeText === 'NEW INQUIRY';

            return $hasAlertRecipient && $matchesSubject && $matchesBadge;
        });

        // Verify HTML rendering of AdminAlertMail
        $mailable = new AdminAlertMail(
            '[New Inquiry] David Miller — Visa Requirements',
            'New Student Inquiry / Consultation',
            'A new inquiry message was lodged on the Kampus website from David Miller.',
            ['Applicant Name' => 'David Miller', 'Email Address' => 'david@example.com'],
            url('/admin/inquiries'),
            'Open Inquiry in Admin Panel',
            'NEW INQUIRY',
            'david@example.com',
            'David Miller'
        );
        $html = $mailable->render();
        $this->assertStringContainsString('David Miller', $html);
        $this->assertStringContainsString('david@example.com', $html);
        $this->assertStringContainsString('NEW INQUIRY', $html);
        $this->assertStringContainsString('/admin/inquiries', $html);
    }

    public function test_call_booking_sends_email_notification_to_admin()
    {
        Mail::fake();

        $response = $this->postJson('/book-call', [
            'name' => 'Jessica Alba',
            'email' => 'jessica@example.com',
            'phone' => '+1 555 019283',
            'destination' => 'United Kingdom',
            'level_of_study' => 'Postgraduate',
            'date' => '2026-10-15',
            'time' => '14:00',
            'country' => 'United States',
        ]);

        $response->assertStatus(200);

        Mail::assertSent(AdminAlertMail::class, function ($mail) {
            $hasRecipient = $mail->hasTo('alerts@kampusedu.com') || $mail->hasTo('admin.chief@kampusedu.com');
            $matchesBadge = $mail->badgeText === 'CALL BOOKING';
            $matchesDetails = isset($mail->details['Destination']) && $mail->details['Destination'] === 'United Kingdom';

            return $hasRecipient && $matchesBadge && $matchesDetails;
        });
    }

    public function test_course_matcher_lead_sends_email_notification_to_admin()
    {
        Mail::fake();

        $response = $this->postJson('/api/course-matcher-lead', [
            'name' => 'Alexander Hayes',
            'email' => 'alex@example.com',
            'phone' => '+61 400 123 456',
            'destination' => 'Australia',
            'level' => 'Undergraduate',
            'field' => 'Cybersecurity',
        ]);

        $response->assertStatus(200);

        Mail::assertSent(AdminAlertMail::class, function ($mail) {
            $hasRecipient = $mail->hasTo('alerts@kampusedu.com') || $mail->hasTo('admin.chief@kampusedu.com');
            $matchesBadge = $mail->badgeText === 'COURSE MATCHER LEAD';

            return $hasRecipient && $matchesBadge;
        });
    }

    public function test_student_message_sends_email_notification_to_admin()
    {
        Mail::fake();

        $student = User::factory()->create([
            'email' => 'student.john@example.com',
            'name' => 'John Student',
        ]);
        $student->assignRole('Student');

        $response = $this->actingAs($student)->post('/student/messages', [
            'subject' => 'Scholarship Application Documents',
            'message' => 'I have uploaded my transcript. Could you please confirm if it meets the criteria?',
            'priority' => 'high',
        ]);

        $response->assertSessionHas('success');

        Mail::assertSent(AdminAlertMail::class, function ($mail) {
            $hasRecipient = $mail->hasTo('alerts@kampusedu.com') || $mail->hasTo('admin.chief@kampusedu.com');
            $matchesBadge = $mail->badgeText === 'STUDENT MESSAGE';
            $matchesSubject = str_contains($mail->envelope()->subject, 'Scholarship Application Documents');

            return $hasRecipient && $matchesBadge && $matchesSubject;
        });
    }

    public function test_partner_application_sends_email_notification_to_admin()
    {
        Mail::fake();

        $response = $this->post('/partner/apply', [
            'company_name' => 'Global Horizon Edu',
            'contact_person' => 'Rachel Green',
            'email' => 'rachel@globalhorizon.com',
            'phone' => '+44 20 8900 1234',
            'country' => 'United Kingdom',
            'years_in_business' => '5 Years',
            'message' => 'We wish to represent Kampus universities in regional overseas events.',
        ]);

        $response->assertSessionHas('success');

        Mail::assertSent(AdminAlertMail::class, function ($mail) {
            $hasRecipient = $mail->hasTo('alerts@kampusedu.com') || $mail->hasTo('admin.chief@kampusedu.com');
            $matchesBadge = $mail->badgeText === 'PARTNER APPLICATION';
            $matchesSubject = str_contains($mail->envelope()->subject, 'Global Horizon Edu');

            return $hasRecipient && $matchesBadge && $matchesSubject;
        });
    }

    public function test_frontend_actions_create_database_notifications_for_admin_bell_section()
    {
        Mail::fake();

        // 1. Submit contact inquiry from frontend
        $this->post('/contact/submit', [
            'name' => 'Bell Test User',
            'email' => 'belluser@example.com',
            'phone' => '+44 7711 998877',
            'subject' => 'Bell Notification Check',
            'message' => 'Checking if notification appears in bell dropdown.',
        ]);

        $this->admin->refresh();
        $this->assertGreaterThan(0, $this->admin->unreadNotifications()->count());
        $notification = $this->admin->unreadNotifications()->first();
        $this->assertStringContainsString('Bell Test User', $notification->data['message'] ?? $notification->data['title']);

        // 2. Mark notification as read
        $this->actingAs($this->admin)
            ->post('/admin/notifications/mark-read', ['id' => $notification->id])
            ->assertOk();

        $this->admin->refresh();
        $this->assertEquals(0, $this->admin->unreadNotifications()->count());
        $this->assertEquals(1, $this->admin->notifications()->count());
    }

    public function test_admin_inquiry_reply_sends_email_to_student()
    {
        Mail::fake();

        $inquiry = ContactMessage::create([
            'name' => 'Amelia Watson',
            'email' => 'amelia@student.test',
            'phone' => '+44 7700 900123',
            'topic' => 'Tuition Fee Payment Schedule',
            'message' => 'Can I pay the tuition fees in 3 instalments?',
            'is_read' => false,
        ]);

        $this->actingAs($this->admin)
            ->post("/admin/inquiries/{$inquiry->id}/reply", [
                'reply_message' => 'Yes, partner universities allow 2 to 3 semester instalment plans.',
            ])
            ->assertSessionHas('success');

        $inquiry->refresh();
        $this->assertEquals('Yes, partner universities allow 2 to 3 semester instalment plans.', $inquiry->reply_message);
        $this->assertTrue($inquiry->is_read);

        Mail::assertSent(\App\Mail\InquiryReplyStudentMail::class, function ($mail) {
            return $mail->hasTo('amelia@student.test');
        });
    }
}

