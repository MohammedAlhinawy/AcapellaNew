<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureUserHasRole Middleware - For API Routes
 *
 * This middleware is designed for API routes that return JSON responses.
 * It ensures the authenticated user has one of the required roles.
 *
 * Usage in routes: middleware([EnsureUserHasRole::class . ':admin'])
 * or middleware([EnsureUserHasRole::class . ':choir_manager,admin'])
 *
 * Behavior:
 * - If user is not authenticated, returns 401 JSON error
 * - If user doesn't have required role, returns 403 JSON error
 *
 * Note: Use CheckRole middleware for web routes that redirect users.
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (! in_array($user->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'Huna ruhusa ya kufanya hii kitendo.', // You don't have permission
            ], 403);
        }

        return $next($request);
    }
}
