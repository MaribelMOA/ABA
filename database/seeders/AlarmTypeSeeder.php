<?php

namespace Database\Seeders;

use App\Models\AlarmType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class AlarmTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('alarm_types')->insert([
            ['smart_type' => 'AVD', 'description' => 'Tampering Alarm'],
            ['smart_type' => 'PEA', 'description' => 'Line Crossing'],
            ['smart_type' => 'PEA2', 'description' => 'Sterile Alarm'],
            ['smart_type' => 'AOIENTRY', 'description' => 'Area Entry Alarm'],
            ['smart_type' => 'AOILEAVE', 'description' => 'Area Exit Alarm'],
            ['smart_type' => 'PASSLINECOUNT', 'description' => 'Passline Count'],
            ['smart_type' => 'TRAFFIC', 'description' => 'Area (Traffic)'],
            ['smart_type' => 'VFD', 'description' => 'Video Face Detection'],
            ['smart_type' => 'VSD', 'description' => 'Meta Data'],
            ['smart_type' => 'VEHICE', 'description' => 'License Plate Recognition'],
        ]);
    }
}
