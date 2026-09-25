<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class University extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'country_id',
        'name',
        'slug',
        'location',
        'website',
        'description',
        'cover_image',
        'logo',
        'features',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'features' => 'array',
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
            'name' => $this->name,
            'location' => $this->location,
            'description' => $this->description,
        ];
    }

    /**
     * Get the country this university belongs to.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the courses offered by this university.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
