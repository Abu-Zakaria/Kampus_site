<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScholarshipApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_no',
        'scholarship_name',
        'destination_country',
        'full_name',
        'email',
        'phone',
        'nationality',
        'highest_qualification',
        'gpa',
        'desired_intake',
        'notes',
        'status',
        'admin_notes',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get user if application was submitted by an authenticated user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate unique application tracking number.
     */
    public static function generateApplicationNumber(): string
    {
        $prefix = 'SCH-' . date('Ym');
        $random = strtoupper(substr(uniqid(), -4));
        $count = static::whereYear('created_at', date('Y'))->count() + 1;
        return sprintf('%s-%04d-%s', $prefix, $count, $random);
    }
}
