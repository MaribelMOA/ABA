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
        Schema::create('vsd_people', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vsd_id')
                ->constrained('vsds')
                ->onDelete('cascade');
            $table->string('upper_length');
            $table->string('upper_color');
            $table->string('skirt');
            $table->string('shoulderbag');
            $table->string('sex');
            $table->string('mask');
            $table->string('hat');
            $table->string('glasses');
            $table->string('backpack');
            $table->string('age');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vsd_people');
    }
};
