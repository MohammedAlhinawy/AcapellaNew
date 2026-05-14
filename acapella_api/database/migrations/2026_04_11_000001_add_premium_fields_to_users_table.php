<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_premium')->default(false)->after('password');
            $table->timestamp('premium_expires_at')->nullable()->after('is_premium');
            $table->string('snippe_customer_id', 100)->nullable()->after('premium_expires_at');
            $table->enum('language', ['en', 'sw'])->default('sw')->after('snippe_customer_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_premium',
                'premium_expires_at',
                'snippe_customer_id',
                'language',
            ]);
        });
    }
};
