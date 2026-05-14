<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->index('idempotency_key');
            $table->index('mongike_payment_id');
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->index('is_premium');
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->index('is_premium');
        });

        Schema::table('choirs', function (Blueprint $table) {
            $table->index('is_verified');
        });
    }

    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropIndex(['idempotency_key']);
            $table->dropIndex(['mongike_payment_id']);
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->dropIndex(['is_premium']);
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->dropIndex(['is_premium']);
        });

        Schema::table('choirs', function (Blueprint $table) {
            $table->dropIndex(['is_verified']);
        });
    }
};
