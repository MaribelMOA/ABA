<?php

namespace Database\Seeders;

use App\Models\Alarm;
use App\Models\Vsd;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VsdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alarms = Alarm::all();
        $targetTypeIds = \App\Models\TargetType::pluck('id')->toArray();


        foreach ($alarms as $alarm) {
            if ($alarm->alarmType->smart_type === 'VSD') {
                Vsd::create([
                    'alarm_id'        => $alarm->id,
                    'id_event'        => rand(1000, 9999),
                    'id_target'       => rand(1, 50),
                    'target_type_id'  => fake()->randomElement($targetTypeIds),
                    'image'           => 'vsd_' . $alarm->id . '.jpg',
                ]);
            }

        }
    }
}
