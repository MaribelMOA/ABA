<?php

namespace Database\Seeders;

use App\Models\Alarm;
use App\Models\AlarmType;
use App\Models\General;
use App\Models\ObjectCounting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ObjectCountingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $generals = General::all();
        $alarmTypeIds = AlarmType::whereIn('smart_type', ['TRAFFIC', 'PASSLINECOUNT'])->pluck('id')->toArray();


        foreach ($generals as $general) {
            // Simula entre 1 y 3 tipos de objetos contados por general
            $types = ['person', 'car', 'bike'];
            shuffle($types);
            $slice = array_slice($types, 0, rand(1, 3));

            foreach ($slice as $type) {
                ObjectCounting::create([
                    'general_id'   => $general->id,
                    'alarm_type_id' => $alarmTypeIds[array_rand($alarmTypeIds)],
                    'object_type'  => $type,
                    'object_state' => ['enter', 'leave', 'exist'][array_rand(['enter', 'leave', 'exist'])],
                    'count'        => rand(1, 20),
                ]);
            }
        }
    }
}
