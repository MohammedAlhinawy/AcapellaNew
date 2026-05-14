<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AlbumController;
use App\Http\Controllers\Api\ChoirController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TrackController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WebhookController;
use App\Http\Middleware\EnsureUserHasRole;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Acapella API Routes — /api/
|--------------------------------------------------------------------------
|
| Public:        POST /webhooks/mongike  (signature-verified, no Sanctum)
| Auth-required: everything else
|
*/

// ── Public: Mongike Webhook ────────────────────────────────────────────────────
// Must be outside auth middleware — Mongike posts here server-to-server
Route::post('/webhooks/mongike', [WebhookController::class, 'mongike'])
    ->middleware('throttle:60,1')
    ->name('webhooks.mongike');

// ── Authentication ────────────────────────────────────────────────────────────
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])
        ->middleware('throttle:10,1')
        ->name('register');
    Route::post('login',    [AuthController::class, 'login'])
        ->middleware('throttle:10,1')
        ->name('login');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])
        ->middleware('throttle:5,1')
        ->name('forgot-password');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])
        ->middleware('throttle:5,1')
        ->name('reset-password');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me',      [AuthController::class, 'me'])->name('me');
    });
});


// ── Publicly accessible resources (no auth required) ──────────────────────────
Route::prefix('')->name('.')->group(function () {
    Route::get('choirs',         [ChoirController::class, 'index'])->name('choirs.index');
    Route::get('choirs/{choir}', [ChoirController::class, 'show'])->name('choirs.show');
    
    Route::get('albums',         [AlbumController::class, 'index'])->name('albums.index');
    Route::get('albums/{album}', [AlbumController::class, 'show'])->name('albums.show');
    
    Route::get('tracks',         [TrackController::class, 'index'])->name('tracks.index');
    Route::get('tracks/{track}', [TrackController::class, 'show'])->name('tracks.show');
});

// ── Protected API (Sanctum token required) ────────────────────────────────────
Route::prefix('')->name('.')->middleware('auth:sanctum')->group(function () {

    // Choirs
    Route::post('choirs',       [ChoirController::class, 'store'])
        ->middleware([EnsureUserHasRole::class . ':choir_manager,admin'])
        ->name('choirs.store');

    // Albums
    Route::post('albums',        [AlbumController::class, 'store'])
        ->middleware([EnsureUserHasRole::class . ':choir_manager,admin'])
        ->name('albums.store');

    // Tracks
    Route::post('tracks',        [TrackController::class, 'store'])
        ->middleware([EnsureUserHasRole::class . ':choir_manager,admin'])
        ->name('tracks.store');

    // Like / Unlike a track
    Route::post('tracks/{track}/like',   [TrackController::class, 'like'])->name('tracks.like');
    Route::delete('tracks/{track}/like', [TrackController::class, 'unlike'])->name('tracks.unlike');

    // Subscriptions
    Route::post('subscriptions/initiate', [SubscriptionController::class, 'initiate'])->name('subscriptions.initiate');
    Route::get('subscriptions/status',    [SubscriptionController::class, 'status'])->name('subscriptions.status');

    // ── Admin Routes ─────────────────────────────────────────────────────────
    Route::middleware([EnsureUserHasRole::class . ':admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('users', [AdminController::class, 'listUsers'])->name('users.index');
        Route::post('users/{user}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
        Route::post('choirs/{choir}/verify', [AdminController::class, 'verifyChoir'])->name('choirs.verify');
        Route::post('choirs/{choir}/unverify', [AdminController::class, 'unverifyChoir'])->name('choirs.unverify');
    });

    // ── User Routes ───────────────────────────────────────────────────────────
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/me', [UserController::class, 'getMe'])->name('me');
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::get('{user}', [UserController::class, 'show'])->name('show');
        Route::put('{user}', [UserController::class, 'update'])->name('update');
        Route::delete('{user}', [UserController::class, 'destroy'])->name('destroy');
    });

    // ── Choir Manager Routes ─────────────────────────────────────────────────
    Route::middleware([EnsureUserHasRole::class . ':choir_manager,admin'])->group(function () {
        Route::put('choirs/{choir}', [ChoirController::class, 'update'])->name('choirs.update');
        Route::delete('choirs/{choir}', [ChoirController::class, 'destroy'])->name('choirs.destroy');
        Route::put('albums/{album}', [AlbumController::class, 'update'])->name('albums.update');
        Route::delete('albums/{album}', [AlbumController::class, 'destroy'])->name('albums.destroy');
        Route::put('tracks/{track}', [TrackController::class, 'update'])->name('tracks.update');
        Route::delete('tracks/{track}', [TrackController::class, 'destroy'])->name('tracks.destroy');
    });
});
