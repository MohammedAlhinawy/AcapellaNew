<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ── Public Landing Pages ─────────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'stats' => [
            'choirs' => \App\Models\Choir::count(),
            'tracks' => \App\Models\Track::count(),
        ]
    ]);
});

Route::get('/discover', function () {
    return Inertia::render('Discover', [
        'popularAlbums' => \App\Models\Album::with('choir')->latest()->take(4)->get(),
        'trendingTracks' => \App\Models\Track::with(['album', 'choir'])->latest()->take(4)->get(),
    ]);
});

Route::get('/choirs', function () {
    return Inertia::render('Choirs', [
        'choirs' => \App\Models\Choir::where('is_verified', true)->latest()->get(),
    ]);
});

Route::get('/premium', function () {
    return Inertia::render('Premium', [
        'verifiedChoirsCount' => \App\Models\Choir::where('is_verified', true)->count(),
    ]);
});

Route::get('/privacy-policy', fn () => Inertia::render('Policies/Privacy'))->name('privacy');
Route::get('/terms-of-service', fn () => Inertia::render('Policies/Terms'))->name('terms');

// ── Note: Web authentication and dashboard routes have been removed.
// All functionality is now available through the API endpoints in routes/api.php

