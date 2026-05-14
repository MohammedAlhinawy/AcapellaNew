<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Http\Resources\UserResource;
use App\Services\MongikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    public function __construct(private readonly MongikeService $mongike) {}

    // ── POST /api/v1/subscriptions/initiate ──────────────────────────────────

    /**
     * Initiate a Mongike Mobile Money payment.
     *
     * Flow:
     *  1. Validate input.
     *  2. Create a 'pending' subscription row with idempotency_key BEFORE calling Mongike.
     *     This ensures we never lose a payment even if the request times out.
     *  3. Call Mongike API → triggers USSD push to user's phone.
     *  4. Store mongike_payment_id on the subscription.
     *  5. Mongike later calls POST /webhooks/mongike to confirm.
     */
    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plan'  => 'required|in:monthly,yearly',
            'phone' => ['required', 'string', 'regex:/^\+255[0-9]{9}$/'],
        ]);

        $amount = $validated['plan'] === 'yearly' ? 50_000 : 5_000;

        // Idempotency-Key — generated once and stored; any retry reuses it
        $idempotencyKey = Str::uuid()->toString();

        $subscription = Subscription::create([
            'user_id'         => $request->user()->id,
            'plan'            => $validated['plan'],
            'amount'          => $amount,
            'currency'        => 'TZS',
            'status'          => 'pending',
            'idempotency_key' => $idempotencyKey,
        ]);

        try {
            $mongikeResponse = $this->mongike->initiatePayment(
                user:           $request->user(),
                plan:           $validated['plan'],
                phone:          $validated['phone'],
                amount:         $amount,
                idempotencyKey: $idempotencyKey,
            );

            $subscription->update([
                'mongike_payment_id' => $mongikeResponse['payment_id'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Malipo yameanzishwa. Thibitisha kwenye simu yako.',
                'data'    => [
                    'subscription'   => new SubscriptionResource($subscription),
                    'subscription_id'  => $subscription->id,
                    'formatted_amount' => $subscription->formatted_amount,
                    'plan'             => $validated['plan'],
                    'idempotency_key'  => $idempotencyKey,
                ],
            ]);
        } catch (\Exception $e) {
            $subscription->update(['status' => 'failed']);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    // ── GET /api/v1/subscriptions/status ─────────────────────────────────────

    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        $active = $user->subscriptions()
            ->where('status', 'active')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->latest()
            ->first();

        // Eager load user relationship to avoid N+1
        if ($active) {
            $active->load('user');
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'user'                => new UserResource($user),
                'is_premium'          => $user->isPremiumActive(),
                'premium_expires_at'  => $user->premium_expires_at?->toIso8601String(),
                'active_subscription' => $active ? new SubscriptionResource($active) : null,
            ],
        ]);
    }
}
