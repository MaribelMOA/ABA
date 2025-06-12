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
        Schema::create('avds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('alarm_id')
                ->constrained('alarms')
                ->onDelete('cascade');
            $table->integer('id_event');
            $table->string('status');
            $table->string('alarm_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avds');
    }
};
