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
        Schema::create('tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('choir_id')->constrained()->cascadeOnDelete();
            $table->string('title', 200);
            $table->string('file_path', 500);                      // S3 object key
            $table->string('cover_path', 500)->nullable();
            $table->unsignedInteger('duration_sec');               // e.g. 272 = 4:32
            $table->unsignedSmallInteger('bitrate')->nullable()    // kbps: 128/192/320
                  ->comment('Audio bitrate in kbps');
            $table->boolean('is_premium')->default(false);
            $table->unsignedTinyInteger('track_number')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('album_id');
            $table->index('choir_id');
            $table->index('is_premium');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracks');
    }
};
