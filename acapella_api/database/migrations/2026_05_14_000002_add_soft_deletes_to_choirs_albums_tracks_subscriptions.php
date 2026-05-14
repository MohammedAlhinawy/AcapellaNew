<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('choirs', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('choirs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('albums', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('tracks', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
