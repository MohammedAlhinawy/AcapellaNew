<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AlbumController extends Controller
{
    // ── GET /api/albums ────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        try {
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

            $albums = $query->orderByDesc('year')->paginate(20);

            return response()->json([
                'success' => true,
                'data'    => AlbumResource::collection($albums)->response()->getData(true),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching albums',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ── GET /api/albums/{album} ────────────────────────────────────────────

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

    // ── POST /api/albums ───────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'choir_id'   => 'required|exists:choirs,id',
                'title'      => 'required|string|max:200',
                'cover_path' => 'nullable|file|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
                'year'       => 'required|integer|min:1900|max:2100',
                'is_premium' => 'sometimes|boolean',
                'genre'      => 'nullable|string|max:80',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Handle cover image upload
        if ($request->hasFile('cover_path')) {
            Storage::disk('public')->makeDirectory('album_covers');
            $image = $request->file('cover_path');
            $imageName = time() . '_' . $request->choir_id . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('album_covers', $image, $imageName);
            $validated['cover_path'] = '/storage/album_covers/' . $imageName;
        }

        $album = Album::create($validated);
        $album->load('choir');

        // Invalidate all album cache keys
        Cache::flush();

        return response()->json([
            'success' => true,
            'message' => 'Album imeundwa.',
            'data'    => new AlbumResource($album),
        ], 201);
    }

    // ── PUT /api/albums/{album} ────────────────────────────────────────────

    public function update(Request $request, Album $album): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title'      => 'sometimes|required|string|max:200',
                'cover_path' => 'nullable|file|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
                'year'       => 'sometimes|required|integer|min:1900|max:2100',
                'is_premium' => 'sometimes|boolean',
                'genre'      => 'sometimes|nullable|string|max:80',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Handle cover image upload
        if ($request->hasFile('cover_path')) {
            Storage::disk('public')->makeDirectory('album_covers');
            $image = $request->file('cover_path');
            $imageName = time() . '_' . $album->choir_id . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('album_covers', $image, $imageName);
            $validated['cover_path'] = '/storage/album_covers/' . $imageName;
        }

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

    // ── DELETE /api/albums/{album} ──────────────────────────────────────────

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
