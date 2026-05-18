<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', function () {
    return Inertia::render('Auth/AuthGate');
})->name('home');

Route::get('/welcome', function () {
    $stats = [
        'choirs' => \App\Models\Choir::where('is_verified', true)->count(),
        'tracks' => \App\Models\Track::count(),
    ];
    return Inertia::render('Public/Welcome', ['stats' => $stats]);
})->name('welcome');

Route::get('/premium', function () {
    return Inertia::render('Public/Premium');
})->name('premium');

Route::get('/terms-of-service', function () {
    return Inertia::render('Public/Terms');
})->name('terms');

Route::get('/privacy-policy', function () {
    return Inertia::render('Public/Privacy');
})->name('privacy');

Route::get('/become-choir-manager', function () {
    return Inertia::render('Public/BecomeChoirManager');
})->name('become-choir-manager');

Route::get('/become-choir-manager/submit', function () {
    return Inertia::render('Public/SubmitManagerRequest');
})->name('manager-request.submit');

Route::get('/feedback', function () {
    return Inertia::render('Shared/SubmitFeedback');
})->name('feedback.submit');

// Auth Routes
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::get('/forgot-password', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('password.request');

Route::get('/reset-password/{token}', function ($token) {
    return Inertia::render('Auth/ResetPassword', ['token' => $token]);
})->name('password.reset');

Route::get('/auth-gate', function () {
    return Inertia::render('Auth/AuthGate');
})->name('auth.gate');

// Listener Routes
Route::get('/explore', function () {
    return Inertia::render('Listener/Explore');
})->name('explore');

Route::get('/library', function () {
    return Inertia::render('Listener/Library');
})->name('library');

Route::get('/profile', function () {
    return Inertia::render('Listener/Settings');
})->name('settings');

Route::get('/album/{id}', function ($id) {
    return Inertia::render('Listener/AlbumView', ['albumId' => $id]);
})->name('album.view');

Route::get('/choir/{id}', function ($id) {
    return Inertia::render('Listener/ChoirView', ['choirId' => $id]);
})->name('choir.view');

Route::get('/play-track/{id}', function ($id) {
    return Inertia::render('Listener/PlayTrack', ['trackId' => $id]);
})->name('play.track');

Route::get('/playlist/{id}', function ($id) {
    return Inertia::render('Listener/PlaylistView', ['playlistId' => $id]);
})->name('playlist.view');

Route::get('/payments', function () {
    return Inertia::render('Listener/Payments');
})->name('payments');

Route::get('/donate', function () {
    return Inertia::render('Shared/Donate');
})->name('donate');

// Choir Manager Routes
Route::get('/manager', function () {
    return Inertia::render('ChoirManager/Dashboard');
})->name('manager.dashboard');

Route::get('/manager/choirs', function () {
    return Inertia::render('ChoirManager/Choirs');
})->name('manager.choirs');

Route::get('/manager/choirs/{id}/content', function ($id) {
    return Inertia::render('ChoirManager/Content', ['choir_id' => $id]);
})->name('manager.choirs.content');

Route::get('/manager/choirs/{choirId}/albums/{albumId}/tracks', function ($choirId, $albumId) {
    return Inertia::render('ChoirManager/AlbumTracks', [
        'choir_id' => $choirId,
        'album_id' => $albumId,
    ]);
})->name('manager.albums.tracks');

Route::get('/manager/profile', function () {
    return Inertia::render('ChoirManager/Profile');
})->name('manager.profile');

// Admin Routes
Route::get('/admin', function () {
    return Inertia::render('Admin/Dashboard');
})->name('admin.dashboard');

Route::get('/admin/choirs', function () {
    return Inertia::render('Admin/Choirs');
})->name('admin.choirs');

Route::get('/admin/users', function () {
    return Inertia::render('Admin/Users');
})->name('admin.users');

Route::get('/admin/manager-requests', function () {
    return Inertia::render('Admin/RequestManagement');
})->name('admin.manager-requests');

Route::get('/admin/manager-requests/{id}', function ($id) {
    return Inertia::render('Admin/RequestView', ['requestId' => $id]);
})->name('admin.manager-requests.view');

Route::get('/admin/feedbacks', function () {
    return Inertia::render('Admin/FeedbackManagement');
})->name('admin.feedbacks');

Route::get('/admin/feedbacks/{id}', function ($id) {
    return Inertia::render('Admin/FeedbackView', ['feedbackId' => $id]);
})->name('admin.feedbacks.view');

Route::get('/admin/profile', function () {
    return Inertia::render('Admin/Profile');
})->name('admin.profile');