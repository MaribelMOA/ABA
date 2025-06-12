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
        Schema::create('vsd_cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vsd_id')
                ->constrained('vsds')
                ->onDelete('cascade');
            $table->integer('year');
            $table->string('car_type');
            $table->string('car_color');
            $table->string('brand');
            $table->string('model');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vsd_cars');
    }
};
