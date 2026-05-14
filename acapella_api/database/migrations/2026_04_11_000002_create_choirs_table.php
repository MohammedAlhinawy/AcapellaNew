<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('choirs', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('location', 100);
            $table->text('bio')->nullable();
            $table->string('image_path', 500)->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('choirs');
    }
};
