<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // ── GET /api/users/me ───────────────────────────────────────────────────

    public function getMe(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ]);
    }

    // ── GET /api/users ────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        // Only admins can list all users
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kuona watumiaji wote.',
            ], 403);
        }

        $users = User::latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users)->response()->getData(true),
        ]);
    }

    // ── GET /api/users/{user} ──────────────────────────────────────────────

    public function show(Request $request, User $user): JsonResponse
    {
        // Users can only view their own profile, admins can view any
        if (!$request->user()->isAdmin() && $request->user()->id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kuona wasifu huu.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    // ── PUT /api/users/{user} ───────────────────────────────────────────────

    public function update(Request $request, User $user): JsonResponse
    {
        // Users can only update their own profile, admins can update any
        if (!$request->user()->isAdmin() && $request->user()->id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa kusasisha wasifu huu.',
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'language' => 'sometimes|in:en,sw',
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Wasifu umesasishwa.',
            'data' => new UserResource($user),
        ]);
    }

    // ── DELETE /api/users/{user} ────────────────────────────────────────────

    public function destroy(Request $request, User $user): JsonResponse
    {
        $authUser = $request->user();
        $isSelf = $authUser->id === $user->id;
        $isAdmin = $authUser->isAdmin();

        // Only the account owner or an admin can delete an account
        if (!$isSelf && !$isAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufuta mtumiaji.',
            ], 403);
        }

        // Prevent an admin from deleting their own admin account via this route
        // (forces them to use admin tooling, avoids accidental lockout).
        if ($isAdmin && $isSelf) {
            return response()->json([
                'success' => false,
                'message' => 'Admin hawezi kufuta akaunti yake mwenyewe kupitia hii route.',
            ], 403);
        }

        // If self-deleting, revoke all sanctum tokens for a clean logout
        if ($isSelf) {
            $authUser->tokens()->delete();
        }

        // Force delete to permanently remove the user (including email) from database
        // A:: Uncomment this line if you want to remove the user in the database
        // $user->forceDelete();

        // B:: Comment this
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mtumiaji amefutwa.',
            // C:: Comment this
            'data' => new UserResource($user),
        ]);
    }
}
