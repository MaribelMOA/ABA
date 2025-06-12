<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;

class TargetTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('target_types')->insert([
            ['target_type' => 'person'],
            ['target_type' => 'car'],
            ['target_type' => 'bike'],
        ]);
    }
}
