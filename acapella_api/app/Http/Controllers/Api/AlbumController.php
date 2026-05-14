<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AlbumController extends Controller
{
    // ── GET /api/v1/albums ────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'albums.list.' . md5(json_encode($request->only(['genre', 'choir_id', 'is_premium'])));

        $albums = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = Album::with('choir')->withCount('tracks');

            if ($request->filled('genre')) {
                $query->where('genre', $request->genre);
            }
            if ($request->filled('choir_id')) {
                $query->where('choir_id', $request->choir_id);
            }
            if ($request->filled('is_premium')) {
                $query->where('is_premium', filter_var($request->is_premium, FILTER_VALIDATE_BOOLEAN));
            }

            return $query->orderByDesc('year')->paginate(20);
        });

        return response()->json([
            'success' => true,
            'data'    => AlbumResource::collection($albums)->response()->getData(true),
        ]);
    }

    // ── GET /api/v1/albums/{album} ────────────────────────────────────────────

    public function show(Album $album): JsonResponse
    {
        $album->load([
            'choir',
            'tracks' => fn ($q) => $q->orderBy('track_number'),
        ]);

        return response()->json([
            'success' => true,
            'data'    => new AlbumResource($album),
        ]);
    }

    // ── POST /api/v1/albums ───────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'choir_id'   => 'required|exists:choirs,id',
            'title'      => 'required|string|max:200',
            'cover_path' => 'nullable|string|max:500',
            'year'       => 'required|integer|min:1900|max:2100',
            'is_premium' => 'sometimes|boolean',
            'genre'      => 'nullable|string|max:80',
        ]);

        $album = Album::create($validated);
        $album->load('choir');

        // Invalidate all album cache keys
        Cache::flush(); // Simple approach - flush all cache on create

        return response()->json([
            'success' => true,
            'message' => 'Album imeundwa.',
            'data'    => new AlbumResource($album),
        ], 201);
    }

    // ── PUT /api/v1/albums/{album} ────────────────────────────────────────────

    public function update(Request $request, Album $album): JsonResponse
    {
        $validated = $request->validate([
            'title'      => 'sometimes|required|string|max:200',
            'cover_path' => 'sometimes|nullable|string|max:500',
            'year'       => 'sometimes|required|integer|min:1900|max:2100',
            'is_premium' => 'sometimes|boolean',
            'genre'      => 'sometimes|nullable|string|max:80',
        ]);

        $album->update($validated);
        $album->load('choir');

        // Invalidate all album cache keys
        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Album imesasishwa.',
            'data'    => new AlbumResource($album),
        ]);
    }

    // ── DELETE /api/v1/albums/{album} ──────────────────────────────────────────

    public function destroy(Request $request, Album $album): JsonResponse
    {
        $album->delete();

        // Invalidate all album cache keys
        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Album imefutwa.',
            'data'    => new AlbumResource($album),
        ]);
    }
}
