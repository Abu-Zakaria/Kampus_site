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
        // 1. Create student_conversations table
        Schema::create('student_conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('subject');
            $table->string('status')->default('open'); // open, resolved, closed
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->unsignedInteger('student_unread_count')->default(0);
            $table->unsignedInteger('admin_unread_count')->default(0);
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('last_message_at');
        });

        // 2. Create student_messages table
        Schema::create('student_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained('student_conversations')->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->string('sender_type'); // 'student' or 'admin'
            $table->text('message');
            $table->string('attachment_path')->nullable();
            $table->string('attachment_name')->nullable();
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['conversation_id', 'is_read']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_messages');
        Schema::dropIfExists('student_conversations');
    }
};
