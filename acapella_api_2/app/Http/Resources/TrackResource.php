<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'album_id' => $this->album_id,
            'choir_id' => $this->choir_id,
            'album' => new AlbumResource($this->whenLoaded('album')),
            'choir' => new ChoirResource($this->whenLoaded('choir')),
            'title' => $this->title,
            'file_path' => $this->file_path,
            'cover_path' => $this->cover_path,
            'duration_sec' => $this->duration_sec,
            'duration_label' => $this->duration_label,
            'bitrate' => $this->bitrate,
            'is_premium' => $this->is_premium,
            'track_number' => $this->track_number,
            'is_liked' => $this->is_liked ?? false,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
