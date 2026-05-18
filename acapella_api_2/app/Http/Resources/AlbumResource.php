<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'choir_id' => $this->choir_id,
            'title' => $this->title,
            'cover_path' => $this->cover_path,
            'year' => $this->year,
            'is_premium' => $this->is_premium,
            'genre' => $this->genre,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
