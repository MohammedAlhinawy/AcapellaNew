<?php

namespace App\Services;

use App\Models\Choir;
use App\Models\User;

class DashboardService
{
    public function getAdminStats(): array
    {
        try {
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
        } catch (\Exception $e) {
            \Log::error('DashboardService error: ' . $e->getMessage());
            return [
                'total_users' => 0,
                'total_listeners' => 0,
                'total_choir_managers' => 0,
                'total_admins' => 0,
                'premium_users' => 0,
                'total_choirs' => 0,
                'verified_choirs' => 0,
                'pending_choirs' => 0,
            ];
        }
    }
}
