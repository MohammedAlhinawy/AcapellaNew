<?php

namespace App\Http\Middleware;

use App\Models\Choir;
use App\Models\Album;
use App\Models\Track;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureChoirManager
{
    /**
     * Ensure user owns the choir or is admin.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        if (! $user->isChoirManager()) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufanya hii kitendo.',
            ], 403);
        }

        // Try to identify the choir being managed
        $choirId = $request->input('choir_id');
        
        $choirParam = $request->route('choir');
        if ($choirParam) {
            $choirId = $choirParam instanceof Choir ? $choirParam->id : $choirParam;
        }

        $albumParam = $request->route('album');
        if ($albumParam && !$choirId) {
            $album = $albumParam instanceof Album ? $albumParam : Album::find($albumParam);
            $choirId = $album?->choir_id;
        }
        
        $trackParam = $request->route('track');
        if ($trackParam && !$choirId) {
            $track = $trackParam instanceof Track ? $trackParam : Track::find($trackParam);
            $choirId = $track?->choir_id;
        }

        // Check if user manages this specific choir
        if ($choirId) {
            $choir = Choir::find($choirId);
            if (! $choir || $choir->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Huwezi kufanya mabadiliko kwa kwaya hii.',
                ], 403);
            }
        }

        return $next($request);
    }
}
