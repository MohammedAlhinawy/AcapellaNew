<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlaylistResource;
use App\Http\Resources\TrackResource;
use App\Models\Playlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaylistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $playlists = Playlist::where('user_id', $request->user()->id)
            ->withCount('tracks')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(PlaylistResource::collection($playlists));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $playlist = Playlist::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json(new PlaylistResource($playlist), 201);
    }

    public function show(Request $request, Playlist $playlist): JsonResponse
    {
        if ($playlist->user_id !== $request->user()->id && !$playlist->is_public) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $playlist->load('tracks');

        return response()->json(new PlaylistResource($playlist));
    }

    public function update(Request $request, Playlist $playlist): JsonResponse
    {
        if ($playlist->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'is_public' => 'sometimes|boolean',
        ]);

        $playlist->update($validated);

        return response()->json(new PlaylistResource($playlist->fresh()));
    }

    public function destroy(Request $request, Playlist $playlist): JsonResponse
    {
        if ($playlist->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $playlist->delete();

        return response()->json(['success' => true, 'message' => 'Playlist deleted']);
    }

    public function addTrack(Request $request, Playlist $playlist, $trackId): JsonResponse
    {
        if ($playlist->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $maxPosition = \DB::table('playlist_track')
            ->where('playlist_id', $playlist->id)
            ->max('position') ?? 0;

        $playlist->tracks()->syncWithoutDetaching([
            $trackId => ['position' => $maxPosition + 1],
        ]);

        return response()->json(['success' => true, 'message' => 'Track added to playlist']);
    }

    public function removeTrack(Request $request, Playlist $playlist, $trackId): JsonResponse
    {
        if ($playlist->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $playlist->tracks()->detach($trackId);

        return response()->json(['success' => true, 'message' => 'Track removed from playlist']);
    }
}
