<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Course extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'university_id',
        'title',
        'slug',
        'level',
        'duration',
        'tuition_fee',
        'show_tuition_fee',
        'intake',
    ];

    protected $casts = [
        'show_tuition_fee' => 'boolean',
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray(): array
    {
        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'level' => $this->level,
            'duration' => $this->duration,
        ];
    }

    /**
     * Get the university that offers this course.
     */
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }
}
