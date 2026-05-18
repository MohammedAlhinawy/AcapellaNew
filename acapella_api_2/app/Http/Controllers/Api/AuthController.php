<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Mail\PasswordResetMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // ── POST /api/auth/register ────────────────────────────────────────────

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

    // ── POST /api/auth/login ───────────────────────────────────────────────

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

    // ── POST /api/auth/logout ──────────────────────────────────────────────

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Umetoka.',
        ]);
    }

    // ── GET /api/auth/me ───────────────────────────────────────────────────

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load([]);   // eager-load nothing extra for speed

        return response()->json([
            'success' => true,
            'data'    => new UserResource($user),
        ]);
    }

    // ── POST /api/auth/forgot-password ───────────────────────────────────────

    public function forgotPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(60);

        // Store (or replace) token in password_reset_tokens
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $validated['email']],
            ['token' => Hash::make($token), 'created_at' => Carbon::now()]
        );

        // Build the reset URL pointing to the web reset-password page
        $resetUrl = url('/reset-password/' . $token . '?email=' . urlencode($validated['email']));

        // Send email
        Mail::to($validated['email'])->send(new PasswordResetMail($resetUrl, $validated['email']));

        return response()->json([
            'success' => true,
            'message' => 'Kiungo cha kurejesha nenosiri kimepelekwa kwenye barua pepe yako.',
        ]);
    }

    // ── POST /api/auth/reset-password ────────────────────────────────────────

    public function resetPassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'    => 'required|email|exists:users,email',
            'token'    => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->first();

        if (! $record || ! Hash::check($validated['token'], $record->token)) {
            return response()->json([
                'success' => false,
                'message' => 'Tokeni ya kurejesha nenosiri si sahihi.',
            ], 422);
        }

        // Expire tokens older than 60 minutes
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            return response()->json([
                'success' => false,
                'message' => 'Tokeni ya kurejesha nenosiri imeisha muda wake. Tafadhali omba tena.',
            ], 422);
        }

        $user = User::where('email', $validated['email'])->first();
        $user->update(['password' => Hash::make($validated['password'])]);
        $user->tokens()->delete();

        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return response()->json([
            'success' => true,
            'message' => 'Nenosiri limesasishwa kwa mafanikio. Tafadhali ingia tena.',
        ]);
    }
}
