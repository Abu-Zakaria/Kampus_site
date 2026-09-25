<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get a setting value by key with a fallback default.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        try {
            $value = static::where('key', $key)->value('value');
            if ($value !== null && $value !== '') {
                return $value;
            }
        } catch (\Throwable $e) {
            // Fallback gracefully if database or table is inaccessible
        }

        return $default;
    }
}
