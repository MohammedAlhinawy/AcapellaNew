<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QueueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'track_id' => $this->track_id,
            'position' => $this->position,
            'track' => new TrackResource($this->whenLoaded('track')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
