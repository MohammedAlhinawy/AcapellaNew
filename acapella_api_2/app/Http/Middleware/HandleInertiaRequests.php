<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $translations = __('frontend');

        // Debug logging
        \Log::info('HandleInertiaRequests share:', [
            'app_locale' => $locale,
            'session_locale' => session('locale'),
            'available_locales' => config('app.supported_locales', ['en']),
            'translations_keys' => array_keys($translations),
            'translations_sample' => $translations['nav']['home'] ?? 'missing',
        ]);

        return [
            ...parent::share($request),
            'locale' => $locale,
            'availableLocales' => config('app.supported_locales', ['en']),
            'translations' => $translations,
        ];
    }
}
