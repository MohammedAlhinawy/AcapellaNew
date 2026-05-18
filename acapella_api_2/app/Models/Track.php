<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Track extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $fillable = [
        'album_id',
        'choir_id',
        'title',
        'file_path',
        'cover_path',
        'duration_sec',
        'bitrate',
        'is_premium',
        'track_number',
    ];

    protected $appends = ['duration_label'];

    protected function casts(): array
    {
        return [
            'is_premium'   => 'boolean',
            'duration_sec' => 'integer',
            'bitrate'      => 'integer',
            'track_number' => 'integer',
        ];
    }

    // ── Accessors ─────────────────────────────────────────────────────────────

    /**
     * Human-readable duration, e.g. "4:32".
     * Appended automatically on serialisation.
     */
    public function getDurationLabelAttribute(): string
    {
        $m = intdiv($this->duration_sec, 60);
        $s = $this->duration_sec % 60;

        return sprintf('%d:%02d', $m, $s);
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function album(): BelongsTo
    {
        return $this->belongsTo(Album::class);
    }

    public function choir(): BelongsTo
    {
        return $this->belongsTo(Choir::class);
    }

    public function likedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'liked_tracks')
            ->withTimestamps();
    }
}
