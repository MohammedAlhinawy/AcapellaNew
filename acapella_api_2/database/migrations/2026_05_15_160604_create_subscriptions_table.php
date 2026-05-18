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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('plan', ['monthly', 'yearly'])->default('monthly');
            $table->unsignedInteger('amount')->comment('TZS — no decimal places');
            $table->char('currency', 3)->default('TZS');
            $table->enum('status', ['pending', 'active', 'expired', 'failed'])->default('pending');
            // Idempotency-Key stored as law — prevents double-charging on retry
            $table->string('idempotency_key', 100)->nullable()->unique();
            $table->string('mongike_payment_id', 100)->nullable()->unique();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('grace_period_ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('user_id');
            $table->index('status');
            $table->index('expires_at');
            $table->index('idempotency_key');
            $table->index('mongike_payment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
