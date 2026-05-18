<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'category' => $this->category,
            'subject' => $this->subject,
            'message' => $this->message,
            'rating' => $this->rating,
            'status' => $this->status,
            'admin_response' => $this->admin_response,
            'responded_by' => $this->responded_by,
            'responded_at' => $this->responded_at?->toIso8601String(),
            'user' => new UserResource($this->whenLoaded('user')),
            'responder' => new UserResource($this->whenLoaded('responder')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
