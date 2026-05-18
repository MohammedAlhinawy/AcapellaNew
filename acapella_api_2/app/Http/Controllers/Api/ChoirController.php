<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChoirResource;
use App\Models\Choir;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class ChoirController extends Controller
{
    // ── GET /api/choirs ────────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        $choirs = Choir::withCount(['albums', 'tracks'])
            ->orderByDesc('is_verified')
            ->orderBy('name')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => ChoirResource::collection($choirs)->response()->getData(true),
        ]);
    }

    // ── GET /api/choirs/{choir} ────────────────────────────────────────────

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

    // ── POST /api/choirs ───────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name'        => 'required|string|max:150',
                'location'    => 'required|string|max:100',
                'bio'         => 'nullable|string',
                'image'       => 'nullable|file|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Link choir to creating user (choir manager)
        $validated['user_id'] = $request->user()->id;
        $validated['is_verified'] = false; // New choirs need admin verification

        // Handle image upload
        if ($request->hasFile('image')) {
            Storage::disk('public')->makeDirectory('choir_images');
            $image = $request->file('image');
            $imageName = time() . '_' . $request->user()->id . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('choir_images', $image, $imageName);
            $validated['image_path'] = '/storage/choir_images/' . $imageName;
        } else {
            $validated['image_path'] = null;
        }

        $choir = Choir::create($validated);

        // Invalidate cache
        Cache::forget('choirs.list');

        return response()->json([
            'success' => true,
            'message' => 'Kwaya imeundwa. Itasubiri kuidhinishwa na msimamizi.',
            'data'    => new ChoirResource($choir),
        ], 201);
    }

    // ── PUT /api/choirs/{choir} ───────────────────────────────────────────

    public function update(Request $request, Choir $choir): JsonResponse
    {
        // Only choir owner or admin can update
        if (! $request->user()->isAdmin() && $choir->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufanya hii kitendo.',
            ], 403);
        }

        try {
            $validated = $request->validate([
                'name'        => 'sometimes|string|max:150',
                'location'    => 'sometimes|string|max:100',
                'bio'         => 'nullable|string',
                'image'       => 'nullable|file|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            Storage::disk('public')->makeDirectory('choir_images');
            $image = $request->file('image');
            $imageName = time() . '_' . $request->user()->id . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('choir_images', $image, $imageName);
            $validated['image_path'] = '/storage/choir_images/' . $imageName;
        }

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

    // ── DELETE /api/choirs/{choir} ────────────────────────────────────────

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
