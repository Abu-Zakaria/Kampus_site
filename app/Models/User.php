<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'password_set_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password_set_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Student conversations.
     */
    public function studentConversations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StudentConversation::class, 'user_id');
    }

    /**
     * Determine if the user is an administrator or staff member.
     */
    public function isAdmin(): bool
    {
        return $this->id === 1 || $this->hasAnyRole(['Super Admin', 'Admin', 'Editor']);
    }

    /**
     * Determine if the user is an educational partner.
     */
    public function isPartner(): bool
    {
        return $this->hasRole('Partner');
    }

    /**
     * Determine if the user is a student (either explicitly assigned or non-staff default).
     */
    public function isStudent(): bool
    {
        if ($this->hasRole('Student')) {
            return true;
        }

        return ! ($this->isAdmin() || $this->isPartner());
    }
}
