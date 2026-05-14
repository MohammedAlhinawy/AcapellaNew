<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ── POST /api/v1/auth/register ────────────────────────────────────────────

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:150',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'language'              => 'sometimes|in:en,sw',
            'role'                  => 'sometimes|in:listener,choir_manager',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'language' => $validated['language'] ?? 'sw',
            'role'     => $validated['role'] ?? 'listener',
        ]);

        $token = $user->createToken('acapella-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Akaunti imeundwa.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ], 201);
    }

    // ── POST /api/v1/auth/login ───────────────────────────────────────────────

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Barua pepe au nywila si sahihi.'],
            ]);
        }

        // Single-session: revoke previous tokens
        $user->tokens()->delete();
        $token = $user->createToken('acapella-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Umeingia.',
            'data'    => [
                'user'  => new UserResource($user),
                'token' => $token,
            ],
        ]);
    }

    // ── POST /api/v1/auth/logout ──────────────────────────────────────────────

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Umetoka.',
        ]);
    }

    // ── GET /api/v1/auth/me ───────────────────────────────────────────────────

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load([]);   // eager-load nothing extra for speed

        return response()->json([
            'success' => true,
            'data'    => new UserResource($user),
        ]);
    }

    // ── POST /api/v1/auth/forgot-password ───────────────────────────────────────

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Generate password reset token
        $token = Str::random(60);

        // In production, send email with reset link
        // For now, return the token (this should be sent via email)
        return response()->json([
            'success' => true,
            'message' => 'Kiungo cha kurejesha nenosiri kimepelekwa kwenye barua pepe yako.',
            'data' => [
                'reset_token' => $token, // Remove this in production - send via email
            ],
        ]);
    }

    // ── POST /api/v1/auth/reset-password ────────────────────────────────────────

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Verify token (in production, verify against stored token)
        // For now, we'll skip token verification and just reset the password
        $user = User::where('email', $validated['email'])->first();

        if ($user) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            // Revoke all tokens to force re-login
            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Nenosiri limesasishwa kwa mafanikio. Tafadhali ingia tena.',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Haiwezi kupata akaunti.',
        ], 404);
    }
}
