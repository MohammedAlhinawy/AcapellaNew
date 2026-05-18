<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $guarded = ['id', 'remember_token'];

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_premium',
        'premium_expires_at',
        'snippe_customer_id',
        'language',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at'   => 'datetime',
            'password'            => 'hashed',
            'is_premium'          => 'boolean',
            'premium_expires_at'  => 'datetime',
            'role'                => 'string',
        ];
    }

    // ── Business Logic ────────────────────────────────────────────────────────

    /**
     * Returns true if the user has an active, non-expired premium status.
     * Called by the Media Lifecycle Guardian on every playback event.
     */
    public function isPremiumActive(): bool
    {
        return $this->is_premium
            && ($this->premium_expires_at === null || $this->premium_expires_at->isFuture());
    }

    // ── Role Helpers ──────────────────────────────────────────────────────────

    public function isListener(): bool
    {
        return $this->role === 'listener';
    }

    public function isChoirManager(): bool
    {
        return $this->role === 'choir_manager';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription(): HasMany
    {
        return $this->hasMany(Subscription::class)
            ->where('status', 'active')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()));
    }

    public function likedTracks(): BelongsToMany
    {
        return $this->belongsToMany(Track::class, 'liked_tracks')
            ->withTimestamps();
    }
}
