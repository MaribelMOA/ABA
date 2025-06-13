<?php

namespace Database\Seeders;

use App\Models\Alarm;
use App\Models\General;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GeneralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alarms = Alarm::all();

        foreach ($alarms as $alarm) {
            if ($alarm->alarmType->smart_type === 'PASSLINECOUNT'
                ||  $alarm->alarmType->smart_type === 'PEA'
             || $alarm->alarmType->smart_type === 'PEA2'
               || $alarm->alarmType->smart_type === 'AOIENTRY'
            || $alarm->alarmType->smart_type === 'AOILEAVE'
                || $alarm->alarmType->smart_type === 'TRAFFIC') {

                General::create([
                    'alarm_id'    => $alarm->id,
                    'id_event'    => rand(1000, 9999),
                    'status' => ['open', 'closed'][array_rand(['open', 'closed'])],
                    'image'           => 'vsd_' . $alarm->id . '.jpg',

                ]);
            }
        }

    }
}
