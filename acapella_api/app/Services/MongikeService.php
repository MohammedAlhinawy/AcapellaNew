<?php

namespace App\Services;

use App\Events\PaymentSuccessful;
use App\Exceptions\MongikePaymentException;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Mongike Payment Service
 * ──────────────────────
 * Handles all interactions with the Mongike payment gateway (https://mongike.com/api).
 *
 * Rules enforced:
 *  - Every request includes an Idempotency-Key to prevent double-charging.
 *  - All credentials are read from config (sourced from .env) — never hardcoded.
 *  - Webhook signature is verified with HMAC-SHA256 before any state change.
 */
class MongikeService
{
    private readonly string $apiKey;
    private readonly string $baseUrl;
    private readonly string $webhookSecret;

    public function __construct()
    {
        $this->apiKey        = config('services.mongike.api_key');
        $this->baseUrl       = config('services.mongike.base_url', 'https://mongike.com/api');
        $this->webhookSecret = config('services.mongike.webhook_secret');
    }

    // ── Initiate Payment ──────────────────────────────────────────────────────

    /**
     * POST /v1/payments — trigger a Mobile Money USSD push to the user's phone.
     *
     * @param User   $user           The subscribing user
     * @param string $plan           'monthly' | 'yearly'
     * @param string $phone          E.164 format, e.g. +255712345678
     * @param int    $amount         TZS amount (integer — no decimals)
     * @param string $idempotencyKey UUID stored on the subscription row before this call
     *
     * @throws \RuntimeException on Mongike API failure
     */
    public function initiatePayment(
        User $user,
        string $plan,
        string $phone,
        int $amount,
        string $idempotencyKey
    ): array {
        $response = Http::withHeaders([
            'Authorization'   => "Bearer {$this->apiKey}",
            'Idempotency-Key' => $idempotencyKey,
            'Accept'          => 'application/json',
            'Content-Type'    => 'application/json',
        ])->post("{$this->baseUrl}/v1/payments", [
            'amount'               => $amount,
            'currency'             => 'TZS',
            'phone'                => $phone,
            'description'          => "Acapella {$plan} subscription",
            'customer_reference'   => (string) $user->id,
            'metadata'             => [
                'user_id' => $user->id,
                'plan'    => $plan,
            ],
        ]);

        if ($response->failed()) {
            Log::error('Mongike payment initiation failed', [
                'status'          => $response->status(),
                'body'            => $response->body(),
                'idempotency_key' => $idempotencyKey,
                'user_id'         => $user->id,
            ]);

            throw new MongikePaymentException(
                $response->json('message', 'Malipo hayakufanikiwa. Jaribu tena.')
            );
        }

        return $response->json();
    }

    // ── Webhook Signature Verification ────────────────────────────────────────

    /**
     * Verify that an incoming POST /webhooks/mongike is genuinely from Mongike.
     * Uses constant-time comparison to prevent timing attacks.
     */
    public function verifyWebhookSignature(Request $request): bool
    {
        $receivedSignature = $request->header('X-Mongike-Signature', '');
        $payload           = $request->getContent();
        $expectedSignature = hash_hmac('sha256', $payload, $this->webhookSecret);

        return hash_equals($expectedSignature, $receivedSignature);
    }

    // ── Webhook Handlers ──────────────────────────────────────────────────────

    /**
     * Activate the user's subscription and broadcast the upgrade via Reverb.
     */
    public function handlePaymentSuccess(array $payload): void
    {
        $paymentId = $payload['payment_id'] ?? null;
        $userId    = $payload['metadata']['user_id'] ?? null;
        $plan      = $payload['metadata']['plan'] ?? 'monthly';

        if (! $paymentId || ! $userId) {
            Log::warning('Mongike webhook: missing required fields', $payload);
            return;
        }

        // Find the subscription — prefer idempotency match, fall back to latest pending
        $subscription = Subscription::where('mongike_payment_id', $paymentId)->first()
            ?? Subscription::where('user_id', $userId)
                ->where('status', 'pending')
                ->latest()
                ->first();

        if (! $subscription) {
            Log::warning('Mongike webhook: no matching subscription found', [
                'payment_id' => $paymentId,
                'user_id'    => $userId,
            ]);
            return;
        }

        $expiresAt = $plan === 'yearly' ? now()->addYear() : now()->addMonth();
        $gracePeriodEndsAt = $expiresAt->copy()->addDays(7); // 7-day grace period

        // Update subscription record
        $subscription->update([
            'status'               => 'active',
            'mongike_payment_id'   => $paymentId,
            'started_at'           => now(),
            'expires_at'           => $expiresAt,
            'grace_period_ends_at' => $gracePeriodEndsAt,
        ]);

        // Promote user to premium
        $user = $subscription->user;
        $user->update([
            'is_premium'          => true,
            'premium_expires_at'  => $expiresAt,
        ]);

        // Broadcast real-time upgrade to user's private Reverb channel
        broadcast(new PaymentSuccessful($user));

        Log::info("Premium activated: user={$user->id}, expires={$expiresAt}, plan={$plan}");
    }

    /**
     * Mark the pending subscription as failed.
     */
    public function handlePaymentFailed(array $payload): void
    {
        $paymentId = $payload['payment_id'] ?? null;

        if ($paymentId) {
            Subscription::where('mongike_payment_id', $paymentId)
                ->update(['status' => 'failed']);
        }

        Log::warning('Mongike payment failed', $payload);
    }
}
