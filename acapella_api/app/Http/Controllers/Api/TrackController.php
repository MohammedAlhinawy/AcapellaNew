<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrackResource;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrackController extends Controller
{
    // ── GET /api/v1/tracks ────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        $query = Track::with(['album', 'choir']);

        if ($request->filled('album_id')) {
            $query->where('album_id', $request->album_id);
        }
        if ($request->filled('choir_id')) {
            $query->where('choir_id', $request->choir_id);
        }
        if ($request->filled('is_premium')) {
            $query->where('is_premium', filter_var($request->is_premium, FILTER_VALIDATE_BOOLEAN));
        }

        $tracks = $query
            ->orderBy('track_number')
            ->orderBy('title')
            ->paginate(30);

        // Append is_liked flag for the authenticated user (fixed N+1 query)
        $user = $request->user();
        if ($user) {
            // Get all liked track IDs in a single query
            $likedIds = $user->likedTracks()->pluck('tracks.id')->toArray();
            $tracks->getCollection()->each(function (Track $track) use ($likedIds) {
                $track->is_liked = in_array($track->id, $likedIds);
            });
        }

        return response()->json([
            'success' => true,
            'data'    => TrackResource::collection($tracks)->response()->getData(true),
        ]);
    }

    // ── GET /api/v1/tracks/{track} ────────────────────────────────────────────

    public function show(Request $request, Track $track): JsonResponse
    {
        $track->load(['album', 'choir']);

        /**
         * Media Lifecycle Guardian — freemium gate.
         * If this track is premium and the user is NOT an active subscriber,
         * hide the file_path so the client cannot access the stream URL.
         * The Flutter/React app checks this field before attempting playback.
         */
        $user = $request->user();
        if ($track->is_premium && (! $user || ! $user->isPremiumActive())) {
            $track->makeHidden('file_path');
        }

        $track->is_liked = $user
            ? $user->likedTracks()->where('track_id', $track->id)->exists()
            : false;

        return response()->json([
            'success' => true,
            'data'    => new TrackResource($track),
        ]);
    }

    // ── POST /api/v1/tracks ───────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'album_id'     => 'required|exists:albums,id',
            'choir_id'     => 'required|exists:choirs,id',
            'title'        => 'required|string|max:200',
            'file_path'    => 'required|string|max:500',
            'cover_path'   => 'nullable|string|max:500',
            'duration_sec' => 'required|integer|min:1',
            'bitrate'      => 'nullable|integer|min:64|max:320',
            'is_premium'   => 'sometimes|boolean',
            'track_number' => 'nullable|integer|min:1',
        ]);

        $track = Track::create($validated);
        $track->load(['album', 'choir']);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umeongezwa.',
            'data'    => new TrackResource($track),
        ], 201);
    }

    // ── PUT /api/v1/tracks/{track} ─────────────────────────────────────────────

    public function update(Request $request, Track $track): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:200',
            'cover_path'   => 'sometimes|nullable|string|max:500',
            'duration_sec' => 'sometimes|required|integer|min:1',
            'bitrate'      => 'sometimes|nullable|integer|min:64|max:320',
            'is_premium'   => 'sometimes|boolean',
            'track_number' => 'sometimes|nullable|integer|min:1',
        ]);

        $track->update($validated);
        $track->load(['album', 'choir']);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umesasishwa.',
            'data'    => new TrackResource($track),
        ]);
    }

    // ── DELETE /api/v1/tracks/{track} ───────────────────────────────────────────

    public function destroy(Request $request, Track $track): JsonResponse
    {
        $track->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umefutwa.',
            'data'    => new TrackResource($track),
        ]);
    }

    // ── POST /api/v1/tracks/{track}/like ─────────────────────────────────────

    public function like(Request $request, Track $track): JsonResponse
    {
        // syncWithoutDetaching prevents duplicate pivot rows
        $request->user()->likedTracks()->syncWithoutDetaching([$track->id]);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umependwa.',
        ]);
    }

    // ── DELETE /api/v1/tracks/{track}/like ───────────────────────────────────

    public function unlike(Request $request, Track $track): JsonResponse
    {
        $request->user()->likedTracks()->detach($track->id);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umeondolewa kwenye pendwa.',
        ]);
    }
}
