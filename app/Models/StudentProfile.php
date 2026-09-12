<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'date_of_birth',
        'gender',
        'nationality',
        'city',
        'country',
        'current_education_level',
        'target_destination',
        'target_degree_level',
        'target_intake_year',
        'target_subject_area',
        'bio',
        'avatar',
        'linkedin_url',
        'portfolio_website',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
