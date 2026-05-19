<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Get locale from query parameter, then session, then default
        $locale = $request->query('locale')
            ?? session('locale')
            ?? config('app.locale');

        // Debug logging
        \Log::info('SetLocale middleware:', [
            'query_locale' => $request->query('locale'),
            'session_locale' => session('locale'),
            'config_locale' => config('app.locale'),
            'final_locale' => $locale,
        ]);

        // Validate against supported locales
        $supportedLocales = config('app.supported_locales', ['en']);
        if (!in_array($locale, $supportedLocales)) {
            $locale = config('app.fallback_locale', 'en');
        }

        // Set Laravel locale
        App::setLocale($locale);

        // Set Carbon locale
        Carbon::setLocale($locale);

        // Store locale in session
        session(['locale' => $locale]);

        return $next($request);
    }
}
