<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChoirResource;
use App\Models\Choir;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ChoirController extends Controller
{
    // ── GET /api/v1/choirs ────────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        $choirs = Cache::remember('choirs.list', 3600, function () {
            return Choir::withCount(['albums', 'tracks'])
                ->orderByDesc('is_verified')
                ->orderBy('name')
                ->paginate(20);
        });

        return response()->json([
            'success' => true,
            'data'    => ChoirResource::collection($choirs)->response()->getData(true),
        ]);
    }

    // ── GET /api/v1/choirs/{choir} ────────────────────────────────────────────

    public function show(Choir $choir): JsonResponse
    {
        $choir->load([
            'albums' => fn ($q) => $q->withCount('tracks')->orderByDesc('year'),
        ]);
        $choir->loadCount(['albums', 'tracks']);

        return response()->json([
            'success' => true,
            'data'    => new ChoirResource($choir),
        ]);
    }

    // ── POST /api/v1/choirs ───────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:150',
            'location'    => 'required|string|max:100',
            'bio'         => 'nullable|string',
            'image_path'  => 'nullable|string|max:500',
        ]);

        // Link choir to creating user (choir manager)
        $validated['user_id'] = $request->user()->id;
        $validated['is_verified'] = false; // New choirs need admin verification

        $choir = Choir::create($validated);

        // Invalidate cache
        Cache::forget('choirs.list');

        return response()->json([
            'success' => true,
            'message' => 'Kwaya imeundwa. Itasubiri kuidhinishwa na msimamizi.',
            'data'    => new ChoirResource($choir),
        ], 201);
    }

    // ── PUT /api/v1/choirs/{choir} ───────────────────────────────────────────

    public function update(Request $request, Choir $choir): JsonResponse
    {
        // Only choir owner or admin can update
        if (! $request->user()->isAdmin() && $choir->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufanya hii kitendo.',
            ], 403);
        }

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:150',
            'location'    => 'sometimes|string|max:100',
            'bio'         => 'nullable|string',
            'image_path'  => 'nullable|string|max:500',
        ]);

        // Only admin can verify/unverify
        if ($request->has('is_verified') && $request->user()->isAdmin()) {
            $validated['is_verified'] = $request->boolean('is_verified');
        }

        $choir->update($validated);

        // Invalidate cache
        Cache::forget('choirs.list');

        return response()->json([
            'success' => true,
            'message' => 'Kwaya imesasishwa.',
            'data'    => new ChoirResource($choir),
        ]);
    }

    // ── DELETE /api/v1/choirs/{choir} ────────────────────────────────────────

    public function destroy(Request $request, Choir $choir): JsonResponse
    {
        // Only choir owner or admin can delete
        if (! $request->user()->isAdmin() && $choir->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufanya hii kitendo.',
            ], 403);
        }

        $choir->delete();

        // Invalidate cache
        Cache::forget('choirs.list');

        return response()->json([
            'success' => true,
            'message' => 'Kwaya imefutwa.',
            'data'    => new ChoirResource($choir),
        ]);
    }
}
