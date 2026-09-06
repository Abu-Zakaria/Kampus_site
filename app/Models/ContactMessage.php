<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'topic',
        'message',
        'is_read',
        'user_id',
        'reply_message',
        'replied_at',
        'replied_by',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'replied_at' => 'datetime',
    ];

    /**
     * Associated Student User (optional).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Admin/Counselor who replied (optional).
     */
    public function repliedBy()
    {
        return $this->belongsTo(User::class, 'replied_by');
    }
}
