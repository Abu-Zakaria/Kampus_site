<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseMatcherTest extends TestCase
{
    use RefreshDatabase;

    public function test_course_matcher_endpoint_returns_success()
    {
        $response = $this->postJson('/api/course-matcher', [
            'destination' => 'Canada',
            'level' => 'Undergraduate',
            'field' => 'Computer Science',
            'budget' => '£25,000 - £35,000/year',
            'start_date' => 'Next year',
            'english_status' => 'Exempt',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'count',
            'results',
        ]);
    }

    public function test_course_matcher_with_anywhere_and_not_sure()
    {
        $response = $this->postJson('/api/course-matcher', [
            'destination' => 'Anywhere',
            'level' => 'Not sure yet',
            'field' => 'Not sure',
            'budget' => 'Flexible / not sure yet',
            'start_date' => 'Just exploring for now',
            'english_status' => 'Not sure what is required',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'count',
            'results',
        ]);
    }

    public function test_course_matcher_lead_sends_email_with_matched_courses_to_user_and_admin()
    {
        \Illuminate\Support\Facades\Mail::fake();

        $country = \App\Models\Country::create([
            'name' => 'Canada',
            'slug' => 'canada',
            'country_code' => 'CA',
        ]);

        $university = \App\Models\University::create([
            'country_id' => $country->id,
            'name' => 'University of Toronto',
            'slug' => 'university-of-toronto',
            'location' => 'Toronto, ON',
        ]);

        $course = \App\Models\Course::create([
            'university_id' => $university->id,
            'title' => 'MSc in Computer Science & AI',
            'slug' => 'msc-computer-science-ai',
            'level' => 'Postgraduate',
            'duration' => '2 Years',
            'tuition_fee' => 'CAD $35,000 / year',
            'show_tuition_fee' => true,
            'intake' => 'September 2026',
        ]);

        $response = $this->postJson('/api/course-matcher-lead', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+123456789',
            'destination' => 'Canada',
            'level' => 'Postgraduate',
            'field' => 'Computer Science',
            'course_ids' => [$course->id],
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        // 1. Verify CourseShortlistMail was sent to the prospective student
        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\CourseShortlistMail::class, function ($mail) use ($course) {
            $hasRecipient = $mail->hasTo('john@example.com');
            $hasCourses = $mail->courses->isNotEmpty();
            $matchesCourse = $mail->courses->first()->id === $course->id;

            return $hasRecipient && $hasCourses && $matchesCourse;
        });

        // 2. Verify AdminAlertMail was sent to admin with the Recommended Shortlist included
        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\AdminAlertMail::class, function ($mail) {
            $hasShortlistDetail = isset($mail->details['Recommended Shortlist']) &&
                str_contains($mail->details['Recommended Shortlist'], 'MSc in Computer Science & AI');

            return $hasShortlistDetail;
        });
    }

    public function test_course_matcher_lead_without_explicit_course_ids_matches_and_sends_shortlist()
    {
        \Illuminate\Support\Facades\Mail::fake();

        $country = \App\Models\Country::create([
            'name' => 'Canada',
            'slug' => 'canada',
            'country_code' => 'CA',
        ]);

        $university = \App\Models\University::create([
            'country_id' => $country->id,
            'name' => 'McGill University',
            'slug' => 'mcgill-university',
            'location' => 'Montreal, QC',
        ]);

        $course = \App\Models\Course::create([
            'university_id' => $university->id,
            'title' => 'MSc Data Science & AI',
            'slug' => 'msc-data-science-ai',
            'level' => 'Postgraduate',
            'duration' => '1 Year',
            'tuition_fee' => 'CAD $32,000 / year',
            'show_tuition_fee' => true,
            'intake' => 'September 2026',
        ]);

        // Lead submitted without course_ids -> backend should resolve matches automatically
        $response = $this->postJson('/api/course-matcher-lead', [
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone' => '+987654321',
            'destination' => 'Canada',
            'level' => 'Postgraduate',
            'field' => 'Computer Science',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\CourseShortlistMail::class, function ($mail) {
            return $mail->hasTo('jane@example.com') && $mail->courses->isNotEmpty();
        });

        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\AdminAlertMail::class, function ($mail) {
            return isset($mail->details['Recommended Shortlist']) && !empty($mail->details['Recommended Shortlist']);
        });
    }

    public function test_csrf_protection_is_enforced_on_api_endpoints()
    {
        $customMiddleware = new class($this->app, $this->app['encrypter']) extends \Illuminate\Foundation\Http\Middleware\PreventRequestForgery {
            protected function runningUnitTests()
            {
                return false;
            }
        };
        $this->app->instance(\Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class, $customMiddleware);

        $session = ['_token' => 'sample-test-csrf-token'];

        // 1. A request without CSRF token in an active session should fail with HTTP 419 (Page Expired / Token Mismatch)
        $responseWithoutCsrf = $this->withSession($session)->post('/api/course-matcher', [
            'destination' => 'Canada',
        ]);
        $responseWithoutCsrf->assertStatus(419);

        // 2. A request with a valid X-CSRF-TOKEN header should pass CSRF validation
        $responseWithCsrf = $this->withSession($session)->withHeaders([
            'X-CSRF-TOKEN' => 'sample-test-csrf-token',
            'Accept' => 'application/json',
        ])->post('/api/course-matcher', [
            'destination' => 'Canada',
        ]);
        $responseWithCsrf->assertStatus(200);
    }

    public function test_course_matcher_rate_limiting_enforces_limit()
    {
        $payload = [
            'destination' => 'Canada',
            'level' => 'Undergraduate',
            'field' => 'Computer Science',
        ];

        // The limit is configured to 20 requests per minute
        for ($i = 0; $i < 20; $i++) {
            $response = $this->postJson('/api/course-matcher', $payload);
            $response->assertStatus(200);
        }

        // The 21st request must trigger HTTP 429 Too Many Requests
        $overflowResponse = $this->postJson('/api/course-matcher', $payload);
        $overflowResponse->assertStatus(429);
    }
}
