<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MongikeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles raw webhook POSTs from Mongike.
 * This route MUST be excluded from Sanctum auth middleware —
 * Mongike calls it server-to-server, not as a logged-in user.
 * Security is enforced by HMAC-SHA256 signature verification.
 */
class WebhookController extends Controller
{
    public function __construct(private readonly MongikeService $mongike) {}

    // ── POST /api/v1/webhooks/mongike ──────────────────────────────────────────

    public function mongike(Request $request): JsonResponse
    {
        // Step 1: Verify signature — reject anything that didn't come from Mongike
        if (! $this->mongike->verifyWebhookSignature($request)) {
            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        $payload = $request->all();
        $event   = $payload['event'] ?? null;

        // Step 2: Dispatch to the appropriate handler
        match ($event) {
            'payment.success' => $this->mongike->handlePaymentSuccess($payload),
            'payment.failed'  => $this->mongike->handlePaymentFailed($payload),
            default           => null,   // ignore unknown events gracefully
        };

        // Always return 200 — Mongike retries on any non-2xx response
        return response()->json(['message' => 'Webhook received.']);
    }
}
