<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    /**
     * Update the application locale.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'locale' => 'required|in:en,sw',
        ]);

        $locale = $validated['locale'];

        // Debug logging
        \Log::info('LocaleController update:', [
            'requested_locale' => $validated['locale'],
            'current_session_locale' => session('locale'),
            'current_app_locale' => app()->getLocale(),
        ]);

        // Validate against supported locales
        $supportedLocales = config('app.supported_locales', ['en']);
        if (!in_array($locale, $supportedLocales)) {
            $locale = config('app.fallback_locale', 'en');
        }

        // Store locale in session
        session(['locale' => $locale]);

        // Set Laravel locale
        App::setLocale($locale);

        \Log::info('LocaleController after set:', [
            'new_session_locale' => session('locale'),
            'new_app_locale' => app()->getLocale(),
        ]);

        return redirect()->back();
    }
}
