<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Console\Command;

class ExpireSubscriptions extends Command
{
    protected $signature = 'subscriptions:expire';
    protected $description = 'Check and expire subscriptions that have passed their expiration date';

    public function handle(): int
    {
        $this->info('Checking for expired subscriptions...');

        // Find active subscriptions that have expired AND are past grace period
        $expiredSubscriptions = Subscription::where('status', 'active')
            ->where('expires_at', '<', now())
            ->where(function ($query) {
                $query->whereNull('grace_period_ends_at')
                    ->orWhere('grace_period_ends_at', '<', now());
            })
            ->get();

        foreach ($expiredSubscriptions as $subscription) {
            // Update subscription status to expired
            $subscription->update(['status' => 'expired']);

            // Update user's premium status
            $user = $subscription->user;
            if ($user) {
                $user->update([
                    'is_premium' => false,
                    'premium_expires_at' => null,
                ]);

                $this->info("Expired subscription for user: {$user->email}");
            }
        }

        $count = $expiredSubscriptions->count();
        $this->info("Expired {$count} subscription(s).");

        return Command::SUCCESS;
    }
}
