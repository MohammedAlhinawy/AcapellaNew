<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default system admin account.
     * Email & password are read from .env to keep credentials out of source code.
     */
    public function run(): void
    {
        $email    = env('ADMIN_EMAIL',    'admin@acapella.co.tz');
        $password = env('ADMIN_PASSWORD', 'Admin@1234!');
        $name     = env('ADMIN_NAME',     'Acapella Admin');

        User::updateOrCreate(
            ['email' => $email],
            [
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make($password),
                'role'     => 'admin',
                'language' => 'sw',
            ]
        );

        $this->command->info("✅ Admin user ready: {$email}");
    }
}
