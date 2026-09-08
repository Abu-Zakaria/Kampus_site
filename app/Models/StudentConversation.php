<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class StudentConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject',
        'status',
        'priority',
        'student_unread_count',
        'admin_unread_count',
        'last_message_at',
    ];

    protected $casts = [
        'student_unread_count' => 'integer',
        'admin_unread_count' => 'integer',
        'last_message_at' => 'datetime',
    ];

    /**
     * The student who owns this conversation.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * All messages in this conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(StudentMessage::class, 'conversation_id')->orderBy('created_at', 'asc');
    }

    /**
     * The latest message in this conversation.
     */
    public function latestMessage(): HasOne
    {
        return $this->hasOne(StudentMessage::class, 'conversation_id')->latestOfMany();
    }

    /**
     * Mark all unread messages from admin as read for the student.
     */
    public function markAsReadByStudent(): void
    {
        $this->update(['student_unread_count' => 0]);

        $this->messages()
            ->where('sender_type', 'admin')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Mark all unread messages from student as read for the admin.
     */
    public function markAsReadByAdmin(): void
    {
        $this->update(['admin_unread_count' => 0]);

        $this->messages()
            ->where('sender_type', 'student')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }
}
