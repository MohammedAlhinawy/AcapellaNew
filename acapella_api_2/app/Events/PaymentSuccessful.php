<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Broadcast to the user's private Reverb channel the moment Mongike confirms payment.
 * Flutter/React subscribes to `private-user.{id}` and listens for `.payment.successful`
 * to trigger an immediate UI upgrade without a page refresh.
 */
class PaymentSuccessful implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly User $user) {}

    /**
     * Private channel guarantees only this user receives the event.
     * Auth is handled by the /api/broadcasting/auth Sanctum route.
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->user->id}"),
        ];
    }

    /**
     * Event name received by Laravel Echo / Flutter Pusher client.
     */
    public function broadcastAs(): string
    {
        return 'payment.successful';
    }

    /**
     * Payload delivered to the client — only what the UI needs.
     * Never expose sensitive fields (idempotency_key, mongike_payment_id).
     */
    public function broadcastWith(): array
    {
        return [
            'is_premium'          => true,
            'premium_expires_at'  => $this->user->premium_expires_at?->toIso8601String(),
        ];
    }
}
