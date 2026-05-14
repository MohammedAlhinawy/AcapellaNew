<?php

namespace App\Services;

use App\Models\Choir;
use App\Models\Subscription;
use App\Models\Track;
use App\Models\User;

class DashboardService
{
    public function getAdminStats(): array
    {
        return [
            'total_users' => User::count(),
            'total_listeners' => User::where('role', 'listener')->count(),
            'total_choir_managers' => User::where('role', 'choir_manager')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'premium_users' => User::where('is_premium', true)->count(),
            'total_choirs' => Choir::count(),
            'verified_choirs' => Choir::where('is_verified', true)->count(),
            'pending_choirs' => Choir::where('is_verified', false)->count(),
        ];
    }

    public function getRecentTracks(int $limit = 5)
    {
        return Track::with(['album', 'choir'])->latest()->take($limit)->get();
    }
}
