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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')
                ->nullable()
                ->constrained('accounts')
                ->onDelete('set null');
            $table->string('mac')->unique();
            $table->string('device_name');
            $table->string('sn');
            $table->foreignId('alarm_type_id')
                ->constrained('alarm_types')
                ->onDelete('cascade');
            $table->boolean('image_save_enabled')->default(true);
            $table->boolean('device_enabled')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
