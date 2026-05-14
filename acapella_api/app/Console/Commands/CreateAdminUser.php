<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'acapella:create-admin
                            {--name= : Admin display name}
                            {--email= : Admin email address}
                            {--password= : Admin password (min 8 chars)}';

    protected $description = 'Create or update the Acapella system admin user';

    public function handle(): int
    {
        $name  = $this->option('name')     ?? $this->ask('Admin name', 'Acapella Admin');
        $email = $this->option('email')    ?? $this->ask('Admin email', 'admin@acapella.co.tz');
        $password = $this->option('password') ?? $this->secret('Admin password');

        $validator = Validator::make(
            ['email' => $email, 'password' => $password],
            ['email' => 'required|email', 'password' => 'required|min:8']
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name'     => $name,
                'password' => Hash::make($password),
                'role'     => 'admin',
                'language' => 'sw',
            ]
        );

        $action = $user->wasRecentlyCreated ? 'Created' : 'Updated';
        $this->info("✅ {$action} admin: {$user->name} <{$user->email}>");

        return self::SUCCESS;
    }
}
