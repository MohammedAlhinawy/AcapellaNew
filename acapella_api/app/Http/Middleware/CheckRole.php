<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * CheckRole Middleware - For Web Routes
 *
 * This middleware is designed for web routes where the user should be redirected
 * to appropriate dashboard pages if they don't have the required role.
 *
 * Usage in routes: middleware(['role:admin']) or middleware(['role:choir_manager,admin'])
 *
 * Behavior:
 * - If user is not authenticated, redirects to login
 * - If user doesn't have required role, redirects to their appropriate dashboard:
 *   - admin → /admin/dashboard
 *   - choir_manager → /manager/dashboard
 *   - listener → /listener/dashboard
 *
 * Note: Use EnsureUserHasRole middleware for API routes that return JSON responses.
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        if (! in_array($user->role, $roles)) {
            // Redirect based on actual role
            return match ($user->role) {
                'admin'         => redirect('/admin/dashboard'),
                'choir_manager' => redirect('/manager/dashboard'),
                default         => redirect('/listener/dashboard'),
            };
        }

        return $next($request);
    }
}
