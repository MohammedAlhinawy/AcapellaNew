<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\QueueResource;
use App\Http\Resources\TrackResource;
use App\Models\Queue;
use App\Models\Track;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TrackController extends Controller
{
    // ── GET /api/tracks ────────────────────────────────────────────────────

    public function index(Request $request): JsonResponse
    {
        // Resolve user via sanctum guard since this is a public route
        $user = $request->user('sanctum') ?? $request->user();

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

        // Filter by liked tracks
        if ($request->filled('liked') && filter_var($request->liked, FILTER_VALIDATE_BOOLEAN)) {
            Log::info('Filtering by liked tracks', ['user_id' => $user ? $user->id : null]);
            if ($user) {
                $query->whereHas('likedByUsers', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            } else {
                return response()->json([
                    'success' => true,
                    'data'    => [],
                ]);
            }
        }

        $tracks = $query
            ->orderBy('track_number')
            ->orderBy('title')
            ->paginate(30);

        Log::info('Tracks query result', ['count' => $tracks->count(), 'liked_param' => $request->filled('liked') ? $request->liked : null]);

        // Append is_liked flag for the authenticated user (fixed N+1 query)
        if ($user) {
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

    // ── GET /api/tracks/{track} ────────────────────────────────────────────

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

    // ── POST /api/tracks ───────────────────────────────────────────────────

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'album_id'     => 'nullable|exists:albums,id',
                'choir_id'     => 'required|exists:choirs,id',
                'title'        => 'required|string|max:200',
                'file_path'    => 'required|file|mimes:mp3,wav,ogg,m4a,aac|max:51200',
                'cover_path'   => 'nullable|file|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
                'duration_sec' => 'nullable|integer|min:1',
                'bitrate'      => 'nullable|integer|min:64|max:320',
                'is_premium'   => 'sometimes|boolean',
                'track_number' => 'nullable|integer|min:1',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Handle audio file upload
        if ($request->hasFile('file_path')) {
            Storage::disk('public')->makeDirectory('tracks');
            $audio = $request->file('file_path');
            $audioName = time() . '_' . $request->choir_id . '.' . $audio->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('tracks', $audio, $audioName);
            $validated['file_path'] = '/storage/tracks/' . $audioName;
        }

        // Handle cover image upload
        if ($request->hasFile('cover_path')) {
            Storage::disk('public')->makeDirectory('track_covers');
            $image = $request->file('cover_path');
            $imageName = time() . '_' . $request->choir_id . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('track_covers', $image, $imageName);
            $validated['cover_path'] = '/storage/track_covers/' . $imageName;
        }

        // If duration_sec is not provided, set a default value
        if (!isset($validated['duration_sec'])) {
            $validated['duration_sec'] = 0;
        }

        $track = Track::create($validated);
        $track->load(['album', 'choir']);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umeongezwa.',
            'data'    => new TrackResource($track),
        ], 201);
    }

    // ── PUT /api/tracks/{track} ─────────────────────────────────────────────

    public function update(Request $request, Track $track): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title'        => 'sometimes|required|string|max:200',
                'file_path'    => 'nullable|file|mimes:mp3,wav,ogg,m4a,aac|max:51200',
                'cover_path'   => 'nullable|file|mimes:jpeg,jpg,png,gif,svg,webp|max:10240',
                'duration_sec' => 'sometimes|nullable|integer|min:1',
                'bitrate'      => 'sometimes|nullable|integer|min:64|max:320',
                'is_premium'   => 'sometimes|boolean',
                'track_number' => 'sometimes|nullable|integer|min:1',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Handle audio file upload
        if ($request->hasFile('file_path')) {
            Storage::disk('public')->makeDirectory('tracks');
            $audio = $request->file('file_path');
            $audioName = time() . '_' . $track->choir_id . '.' . $audio->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('tracks', $audio, $audioName);
            $validated['file_path'] = '/storage/tracks/' . $audioName;
        }

        // Handle cover image upload
        if ($request->hasFile('cover_path')) {
            Storage::disk('public')->makeDirectory('track_covers');
            $image = $request->file('cover_path');
            $imageName = time() . '_' . $track->choir_id . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('track_covers', $image, $imageName);
            $validated['cover_path'] = '/storage/track_covers/' . $imageName;
        }

        $track->update($validated);
        $track->load(['album', 'choir']);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umesasishwa.',
            'data'    => new TrackResource($track),
        ]);
    }

    // ── DELETE /api/tracks/{track} ───────────────────────────────────────────

    public function destroy(Request $request, Track $track): JsonResponse
    {
        $track->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umefutwa.',
            'data'    => new TrackResource($track),
        ]);
    }

    // ── POST /api/tracks/{track}/like ─────────────────────────────────────

    public function like(Request $request, Track $track): JsonResponse
    {
        // syncWithoutDetaching prevents duplicate pivot rows
        $request->user()->likedTracks()->syncWithoutDetaching([$track->id]);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umependwa.',
        ]);
    }

    // ── DELETE /api/tracks/{track}/like ───────────────────────────────────

    public function unlike(Request $request, Track $track): JsonResponse
    {
        $user = $request->user();
        Log::info('Unlike track', ['user_id' => $user->id, 'track_id' => $track->id]);
        
        $result = $user->likedTracks()->detach($track->id);
        Log::info('Detach result', ['result' => $result]);

        return response()->json([
            'success' => true,
            'message' => 'Wimbo umeondolewa kwenye pendwa.',
        ]);
    }

    // ── GET /api/tracks/{track}/related ───────────────────────────────────

    /**
     * Smart recommendations for a given track.
     *
     * Scoring signals (weighted, additive):
     *   +10  same choir
     *   +5   same album
     *   +3   liked by the current user
     *   +1   per like from any user (popularity proxy)
     *   -100 if track is premium and the user is NOT premium (push to bottom)
     *
     * Falls back to newest tracks if fewer than 5 meaningful matches.
     */
    public function getRelatedTracks(Request $request, $track)
    {
        try {
            if (is_string($track) || is_numeric($track)) {
                $track = Track::findOrFail($track);
            }

            $user = $request->user('sanctum') ?? $request->user();
            $userId = $user?->id;
            $isPremium = (bool) ($user->is_premium ?? false);

            $bindings = [
                $track->choir_id ?? 0,
                $track->album_id ?? 0,
                $userId ?? 0,
                $isPremium ? 0 : 1, // toggles the premium penalty
            ];

            $scoreSql = '(
                (CASE WHEN choir_id = ? THEN 10 ELSE 0 END) +
                (CASE WHEN album_id = ? AND album_id IS NOT NULL THEN 5 ELSE 0 END) +
                (CASE WHEN EXISTS (
                    SELECT 1 FROM liked_tracks lt
                    WHERE lt.track_id = tracks.id AND lt.user_id = ?
                ) THEN 3 ELSE 0 END) +
                (SELECT COUNT(*) FROM liked_tracks lt2 WHERE lt2.track_id = tracks.id) +
                (CASE WHEN is_premium = 1 AND ? = 1 THEN -100 ELSE 0 END)
            )';

            $recommendations = Track::where('tracks.id', '!=', $track->id)
                ->with(['album', 'choir'])
                ->select('tracks.*')
                ->selectRaw("$scoreSql AS score", $bindings)
                ->orderByDesc('score')
                ->orderByDesc('tracks.id')
                ->limit(15)
                ->get();

            // Drop entries with negative score (premium-gated when free)
            $recommendations = $recommendations->filter(fn ($t) => $t->score >= 0)->values();

            // Fallback: pad with newest tracks if too few signals
            if ($recommendations->count() < 5) {
                $existingIds = $recommendations->pluck('id')->push($track->id)->all();
                $fallbackQuery = Track::with(['album', 'choir'])
                    ->whereNotIn('id', $existingIds)
                    ->orderByDesc('id');
                if (!$isPremium) {
                    $fallbackQuery->where('is_premium', false);
                }
                $fallback = $fallbackQuery->limit(10)->get();
                $recommendations = $recommendations->concat($fallback);
            }

            return response()->json($recommendations->values());
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch related tracks',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ── GET /api/queue ───────────────────────────────────────────────────────

    public function getQueue(Request $request): JsonResponse
    {
        try {
            $queue = Queue::where('user_id', $request->user()->id)
                ->with('track')
                ->orderBy('position')
                ->get();

            return response()->json(QueueResource::collection($queue));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch queue',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ── POST /api/tracks/{track}/queue ──────────────────────────────────────

    public function addToQueue(Request $request, $track): JsonResponse
    {
        try {
            if (is_string($track) || is_numeric($track)) {
                $track = Track::findOrFail($track);
            }

            $maxPosition = Queue::where('user_id', $request->user()->id)
                ->max('position') ?? 0;

            $queueItem = Queue::create([
                'user_id' => $request->user()->id,
                'track_id' => $track->id,
                'position' => $maxPosition + 1,
            ]);

            return response()->json(new QueueResource($queueItem->load('track')), 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to add track to queue',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // ── DELETE /api/queue/{queue} ─────────────────────────────────────────────

    public function removeFromQueue(Request $request, Queue $queue): JsonResponse
    {
        if ($queue->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $queue->delete();

        return response()->json(['success' => true, 'message' => 'Track removed from queue']);
    }

    // ── DELETE /api/queue ─────────────────────────────────────────────────────

    public function clearQueue(Request $request): JsonResponse
    {
        Queue::where('user_id', $request->user()->id)->delete();

        return response()->json(['success' => true, 'message' => 'Queue cleared']);
    }

    // ── POST /api/queue/reorder ───────────────────────────────────────────────

    /**
     * Replace the user's queue with the given track order.
     * Accepts: { track_ids: [id, id, ...] }
     *
     * Used for shuffle and (future) drag-to-reorder. Atomic via DB
     * transaction so the queue is never in a half-rebuilt state.
     */
    public function reorderQueue(Request $request): JsonResponse
    {
        $request->validate([
            'track_ids' => 'required|array',
            'track_ids.*' => 'integer|exists:tracks,id',
        ]);

        $userId = $request->user()->id;
        $trackIds = $request->input('track_ids');

        try {
            DB::transaction(function () use ($userId, $trackIds) {
                Queue::where('user_id', $userId)->delete();
                foreach ($trackIds as $index => $trackId) {
                    Queue::create([
                        'user_id' => $userId,
                        'track_id' => $trackId,
                        'position' => $index + 1,
                    ]);
                }
            });

            $queue = Queue::where('user_id', $userId)
                ->with('track')
                ->orderBy('position')
                ->get();

            return response()->json(QueueResource::collection($queue));
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to reorder queue',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
