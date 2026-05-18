<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChoirResource;
use App\Http\Resources\UserResource;
use App\Models\Choir;
use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    // ── GET /api/admin/dashboard ──────────────────────────────────────────

    public function dashboard(Request $request): JsonResponse
    {
        $stats = $this->dashboardService->getAdminStats();

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    // ── POST /api/admin/choirs/{choir}/verify ───────────────────────────

    public function verifyChoir(Request $request, Choir $choir): JsonResponse
    {
        $choir->update(['is_verified' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Kwaya imethibitishwa.',
            'data' => new ChoirResource($choir),
        ]);
    }

    // ── POST /api/admin/choirs/{choir}/unverify ───────────────────────────

    public function unverifyChoir(Request $request, Choir $choir): JsonResponse
    {
        $choir->update(['is_verified' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Kwaya haijathibitishwa.',
            'data' => new ChoirResource($choir),
        ]);
    }

    // ── GET /api/admin/users ─────────────────────────────────────────────

    public function listUsers(Request $request): JsonResponse
    {
        $users = User::withCount(['subscriptions'])
            ->latest()
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users)->response()->getData(true),
        ]);
    }

    // ── POST /api/admin/users/{user}/role ────────────────────────────────

    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:listener,choir_manager,admin',
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'success' => true,
            'message' => 'Jukumu la mtumiaji limebadilishwa.',
            'data' => new UserResource($user),
        ]);
    }
}
