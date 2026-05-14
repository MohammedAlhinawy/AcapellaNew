<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Album extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $fillable = [
        'choir_id',
        'title',
        'cover_path',
        'year',
        'is_premium',
        'genre',
    ];

    protected function casts(): array
    {
        return [
            'is_premium' => 'boolean',
            'year'        => 'integer',
        ];
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function choir(): BelongsTo
    {
        return $this->belongsTo(Choir::class);
    }

    public function tracks(): HasMany
    {
        return $this->hasMany(Track::class)->orderBy('track_number');
    }
}
