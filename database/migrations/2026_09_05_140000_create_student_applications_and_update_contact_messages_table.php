<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Update contact_messages table to link user and store admin replies
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            $table->text('reply_message')->nullable()->after('message');
            $table->timestamp('replied_at')->nullable()->after('reply_message');
            $table->foreignId('replied_by')->nullable()->after('replied_at')->constrained('users')->nullOnDelete();
        });

        // 2. Create student_applications table for tracking admission stages
        Schema::create('student_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('university_id')->nullable()->constrained('universities')->nullOnDelete();
            $table->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->string('university_name');
            $table->string('course_title');
            $table->string('applicant_name');
            $table->string('applicant_email');
            $table->string('applicant_phone')->nullable();
            $table->string('intake')->nullable();
            $table->string('level')->nullable();
            $table->string('duration')->nullable();
            $table->string('tuition_fee')->nullable();
            $table->string('status')->default('pending'); // pending, processing, submitted_to_university, offer_issued, visa_processing, accepted, rejected
            $table->text('notes')->nullable();
            $table->text('counselor_remarks')->nullable();
            $table->json('status_history')->nullable();
            $table->timestamp('applied_at')->nullable();
            $table->timestamp('status_updated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_applications');

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['replied_by']);
            $table->dropColumn(['user_id', 'reply_message', 'replied_at', 'replied_by']);
        });
    }
};
