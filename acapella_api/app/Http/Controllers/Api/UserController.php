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
    // ── GET /api/v1/users/me ───────────────────────────────────────────────────

    public function getMe(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new UserResource($request->user()),
        ]);
    }

    // ── GET /api/v1/users ────────────────────────────────────────────────────

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

    // ── GET /api/v1/users/{user} ──────────────────────────────────────────────

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

    // ── PUT /api/v1/users/{user} ───────────────────────────────────────────────

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

    // ── DELETE /api/v1/users/{user} ────────────────────────────────────────────

    public function destroy(Request $request, User $user): JsonResponse
    {
        // Only admins can delete users
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufuta mtumiaji.',
            ], 403);
        }

        // Prevent admin from deleting themselves
        if ($request->user()->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Hawezi kufuta akaunti yako mwenyewe.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Mtumiaji amefutwa.',
            'data' => new UserResource($user),
        ]);
    }
}
