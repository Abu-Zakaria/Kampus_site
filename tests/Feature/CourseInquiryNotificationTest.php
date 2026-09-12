<?php

namespace Tests\Feature;

use App\Mail\CourseInquiryAdminNotification;
use App\Models\ContactMessage;
use App\Models\Setting;
use App\Models\StudentApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CourseInquiryNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure Super Admin role exists
        if (class_exists(Role::class)) {
            Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        }
    }

    public function test_student_course_inquiry_creates_records_and_sends_email_notification_to_admin()
    {
        Mail::fake();

        // Create an admin user
        $admin = User::factory()->create([
            'email' => 'admin@kampusedu.com',
        ]);
        $admin->assignRole('Super Admin');

        // Configure admin notification setting
        Setting::create([
            'key' => 'admin_notification_email',
            'value' => 'admissions@kampusedu.com',
        ]);

        $payload = [
            'name' => 'Sarah Jenkins',
            'email' => 'sarah.jenkins@example.com',
            'phone' => '+44 7911 123456',
            'course_title' => 'MSc Artificial Intelligence & Data Science',
            'university_name' => 'Imperial College London',
            'level' => 'Postgraduate',
            'duration' => '1 Year',
            'intake' => 'September 2026',
            'tuition_fee' => '£32,500 / year',
            'notes' => 'Are there any departmental scholarships or teaching assistantships available?',
        ];

        $response = $this->postJson('/course-enquiry', $payload);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        // 1. Verify ContactMessage is stored and unread for admin
        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Sarah Jenkins',
            'email' => 'sarah.jenkins@example.com',
            'phone' => '+44 7911 123456',
            'topic' => 'Course Enquiry: MSc Artificial Intelligence & Data Science',
            'is_read' => false,
        ]);

        $inquiry = ContactMessage::where('email', 'sarah.jenkins@example.com')->first();
        $this->assertNotNull($inquiry);
        $this->assertStringContainsString('Imperial College London', $inquiry->message);
        $this->assertStringContainsString('departmental scholarships', $inquiry->message);

        // 2. Verify StudentApplication is stored with pending status
        $this->assertDatabaseHas('student_applications', [
            'applicant_name' => 'Sarah Jenkins',
            'applicant_email' => 'sarah.jenkins@example.com',
            'course_title' => 'MSc Artificial Intelligence & Data Science',
            'university_name' => 'Imperial College London',
            'status' => 'pending',
        ]);

        // 3. Verify CourseInquiryAdminNotification email was dispatched to administrators
        Mail::assertSent(CourseInquiryAdminNotification::class, function ($mail) {
            $hasAdmissionsRecipient = $mail->hasTo('admissions@kampusedu.com');
            $hasAdminUserRecipient = $mail->hasTo('admin@kampusedu.com');

            $matchesSubject = str_contains($mail->envelope()->subject, 'Sarah Jenkins') &&
                              str_contains($mail->envelope()->subject, 'MSc Artificial Intelligence & Data Science');

            return ($hasAdmissionsRecipient || $hasAdminUserRecipient) && $matchesSubject;
        });

        // 4. Verify the email renders valid HTML with all details
        $application = StudentApplication::where('applicant_email', 'sarah.jenkins@example.com')->first();
        $mailable = new CourseInquiryAdminNotification($inquiry, $application, $payload);
        $renderedHtml = $mailable->render();

        $this->assertStringContainsString('Sarah Jenkins', $renderedHtml);
        $this->assertStringContainsString('sarah.jenkins@example.com', $renderedHtml);
        $this->assertStringContainsString('+44 7911 123456', $renderedHtml);
        $this->assertStringContainsString('MSc Artificial Intelligence', $renderedHtml);
        $this->assertStringContainsString('Imperial College London', $renderedHtml);
        $this->assertStringContainsString('departmental scholarships', $renderedHtml);
        $this->assertStringContainsString('/admin/inquiries', $renderedHtml);
    }

    public function test_course_inquiry_validation_requires_mandatory_fields()
    {
        Mail::fake();

        $response = $this->postJson('/course-enquiry', [
            // Missing name, email, and course_title
            'phone' => '12345678',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'course_title']);

        Mail::assertNothingSent();
    }

    public function test_admin_can_view_and_reply_to_course_inquiry()
    {
        // 1. Create admin with inquiry management permissions
        $admin = User::factory()->create([
            'email' => 'head.admin@kampus.com',
        ]);
        $admin->assignRole('Super Admin');

        // 2. Submit course inquiry
        $inquiry = ContactMessage::create([
            'name' => 'Michael Chang',
            'email' => 'michael@example.com',
            'phone' => '+44 7800 112233',
            'topic' => 'Course Enquiry: BEng Software Engineering',
            'message' => "Direct Course Application / Enquiry:\n\n• Course: BEng Software Engineering\n• University: University of Oxford",
            'is_read' => false,
        ]);

        // 3. Admin views inquiries list
        $indexResponse = $this->actingAs($admin)->get('/admin/inquiries');
        $indexResponse->assertStatus(200);
        $indexResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Inquiries/Index')
            ->has('messages', 1)
            ->where('messages.0.topic', 'Course Enquiry: BEng Software Engineering')
        );

        // 4. Admin replies to inquiry
        $replyResponse = $this->actingAs($admin)->post("/admin/inquiries/{$inquiry->id}/reply", [
            'reply_message' => 'Thank you Michael! Entry requirements have been sent to your email.',
        ]);

        $replyResponse->assertStatus(302);
        $this->assertDatabaseHas('contact_messages', [
            'id' => $inquiry->id,
            'is_read' => true,
            'reply_message' => 'Thank you Michael! Entry requirements have been sent to your email.',
            'replied_by' => $admin->id,
        ]);
    }
}
