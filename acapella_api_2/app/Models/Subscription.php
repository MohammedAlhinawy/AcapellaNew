<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $fillable = [
        'user_id',
        'plan',
        'amount',
        'currency',
        'status',
        'idempotency_key',
        'mongike_payment_id',
        'started_at',
        'expires_at',
        'grace_period_ends_at',
    ];

    protected $appends = ['formatted_amount'];

    protected function casts(): array
    {
        return [
            'amount'               => 'integer',
            'started_at'           => 'datetime',
            'expires_at'           => 'datetime',
            'grace_period_ends_at' => 'datetime',
        ];
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /**
     * Formatted TZS price as displayed in the UI, e.g. "TZS 5,000/="
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'TZS ' . number_format($this->amount) . '/=';
    }

    // ── Business Logic ────────────────────────────────────────────────────────

    public function isActive(): bool
    {
        // Subscription is active if status is active and either:
        // 1. No expiration date, or
        // 2. Not yet expired, or
        // 3. Expired but still within grace period
        return $this->status === 'active'
            && ($this->expires_at === null || $this->expires_at->isFuture() || $this->isInGracePeriod());
    }

    public function isInGracePeriod(): bool
    {
        return $this->grace_period_ends_at !== null
            && $this->grace_period_ends_at->isFuture();
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    public function scopeWithHistory($query)
    {
        return $query->withTrashed();
    }
}
