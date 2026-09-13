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
        Schema::create('scholarship_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->unique();
            $table->string('scholarship_name');
            $table->string('destination_country')->nullable();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone');
            $table->string('nationality')->nullable();
            $table->string('highest_qualification')->nullable();
            $table->string('gpa')->nullable();
            $table->string('desired_intake')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // pending, reviewed, contacted, shortlisted, rejected
            $table->text('admin_notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scholarship_applications');
    }
};
