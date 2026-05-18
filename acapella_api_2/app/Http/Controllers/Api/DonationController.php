<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DonationController extends Controller
{
    /**
     * POST /api/donations/initiate
     *
     * Accepts an arbitrary donation amount (>= 5,000 TZS) and a phone number,
     * then triggers a Mongike Mobile Money USSD prompt.
     */
    public function initiate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:5000',
            'phone'  => ['required', 'string', 'regex:/^(\+255[0-9]{9}|0[0-9]{9})$/'],
        ]);

        // Normalise phone to +255 format then strip '+' for Mongike
        $phone = $validated['phone'];
        if (str_starts_with($phone, '0')) {
            $phone = '+255' . substr($phone, 1);
        } elseif (str_starts_with($phone, '255') && !str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }
        $buyerPhone = ltrim($phone, '+');

        $idempotencyKey = Str::uuid()->toString();
        $amount = (int) $validated['amount'];
        $apiKey = config('services.mongike.api_key');
        $baseUrl = config('services.mongike.base_url', 'https://api.mongike.com');

        // No API key → mock response (dev mode)
        if (empty($apiKey)) {
            Log::info('Donation: using mock response (no Mongike API key configured)', [
                'user_id'  => $request->user()?->id,
                'amount'   => $amount,
                'phone'    => $buyerPhone,
                'order_id' => $idempotencyKey,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Asante! Malipo yameanzishwa. Thibitisha kwenye simu yako.',
                'data'    => [
                    'subscription_id' => 'donation_' . $idempotencyKey,
                    'amount'          => $amount,
                    'idempotency_key' => $idempotencyKey,
                ],
            ]);
        }

        try {
            $response = Http::withHeaders([
                'x-api-key'    => $apiKey,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ])->post("{$baseUrl}/v1/payments/mobile-money/tanzania", [
                'order_id'    => $idempotencyKey,
                'amount'      => $amount,
                'buyer_phone' => $buyerPhone,
                'fee_payer'   => 'MERCHANT',
                'buyer_name'  => 'Donations',
                'buyer_email' => $request->user()?->email,
                'metadata'    => [
                    'user_id' => $request->user()?->id,
                    'type'    => 'donation',
                ],
            ]);

            if ($response->failed()) {
                Log::error('Donation initiation failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => $response->json('message', 'Malipo hayakufanikiwa. Jaribu tena.'),
                ], 422);
            }

            $json = $response->json();

            return response()->json([
                'success' => true,
                'message' => 'Asante! Malipo yameanzishwa. Thibitisha kwenye simu yako.',
                'data'    => [
                    'subscription_id' => $json['data']['id'] ?? $idempotencyKey,
                    'amount'          => $amount,
                    'idempotency_key' => $idempotencyKey,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Donation exception', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
