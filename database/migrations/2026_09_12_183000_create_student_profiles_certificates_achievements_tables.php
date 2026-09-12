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
        // 1. Student Profiles Table
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('phone')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable(); // Male, Female, Other
            $table->string('nationality')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('current_education_level')->nullable(); // High School, Bachelor's, Master's, etc.
            $table->string('target_destination')->nullable(); // UK, USA, Canada, Australia, etc.
            $table->string('target_degree_level')->nullable(); // Undergraduate, Postgraduate, PhD
            $table->string('target_intake_year')->nullable();
            $table->string('target_subject_area')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_website')->nullable();
            $table->timestamps();
        });

        // 2. Student Certificates Table
        Schema::create('student_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('issuing_organization');
            $table->date('issue_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('credential_id')->nullable();
            $table->string('credential_url')->nullable();
            $table->string('score')->nullable(); // e.g. Band 7.5, 320/340, CGPA 3.8
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('submitted'); // submitted, verified, rejected
            $table->text('counselor_remarks')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 3. Student Achievements Table
        Schema::create('student_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('category')->default('Academic'); // Academic, Leadership, Competition, Research, Extracurricular, Volunteering, Award
            $table->string('issuer_or_organization')->nullable();
            $table->date('achievement_date')->nullable();
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_type')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('status')->default('submitted'); // submitted, verified
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_achievements');
        Schema::dropIfExists('student_certificates');
        Schema::dropIfExists('student_profiles');
    }
};
