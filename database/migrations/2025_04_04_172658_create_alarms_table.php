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
        Schema::create('alarms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id') // Relación con "devices"
            ->constrained('devices')
                ->onDelete('cascade');

            $table->foreignId('alarm_type_id') // Relación con "alarm_types"
            ->constrained('alarm_types')
                ->onDelete('cascade');

            $table->bigInteger('utc'); // Guardará el timestamp en formato UNIX

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alarms');
    }
};
