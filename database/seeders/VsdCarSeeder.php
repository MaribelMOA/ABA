<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\DB;

class VsdCarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vsdIds = DB::table('vsds')->pluck('id');

        foreach ($vsdIds as $vsdId) {
            // Obtener el id_target_type del vsd correspondiente
            $targetType = DB::table('vsds')
                ->where('id', $vsdId)
                ->value('target_type_id');

            // Comprobar si el target_type es 'car' (usando el ID del tipo de objetivo)
            $target = DB::table('target_types')->where('id', $targetType)->first();

            // Si el target es 'car', insertar en la tabla 'vsd_cars'
            if ($target && $target->target_type === 'car') {
                DB::table('vsd_cars')->insert([
                    'vsd_id' => $vsdId,
                    'year' => rand(2010, 2023),
                    'car_type' => 'Sedan',
                    'car_color' => 'Red',
                    'brand' => 'Toyota',
                    'model' => 'Corolla',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
