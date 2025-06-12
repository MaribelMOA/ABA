<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VsdPersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los IDs de 'vsds'
        $vsdIds = DB::table('vsds')->pluck('id');

        foreach ($vsdIds as $vsdId) {
            // Obtener el id_target_type del vsd correspondiente
            $targetType = DB::table('vsds')
                ->where('id', $vsdId)
                ->value('target_type_id');

            // Comprobar si el target_type es 'person'
            $target = DB::table('target_types')->where('id', $targetType)->first();

            // Si el target es 'person', insertar en la tabla 'vsd_people'
            if ($target && $target->target_type === 'person') {
                DB::table('vsd_people')->insert([
                    'vsd_id' => $vsdId,
                    'upper_length' => 'M',
                    'upper_color' => 'Black',
                    'skirt' => 'Jeans',
                    'shoulderbag' => 'No',
                    'sex' => 'Female',
                    'mask' => 'No',
                    'hat' => 'No',
                    'glasses' => 'Yes',
                    'backpack' => 'Yes',
                    'age' => '25',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
