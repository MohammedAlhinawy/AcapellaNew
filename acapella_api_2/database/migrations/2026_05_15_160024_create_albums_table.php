<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('choir_id')->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('cover_path', 500)->nullable();
            $table->unsignedSmallInteger('year');
            $table->boolean('is_premium')->default(false);
            $table->string('genre', 80)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('choir_id');
            $table->index('is_premium');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};
