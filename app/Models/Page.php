<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'tags',
        'content',
        'is_active',
        'show_in_navbar',
        'show_in_footer',
    ];

    public function getTagsAttribute()
    {
        return $this->attributes['tags'] ?? $this->attributes['meta_keywords'] ?? null;
    }

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
        'show_in_navbar' => 'boolean',
        'show_in_footer' => 'boolean',
    ];
}
