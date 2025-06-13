<?php

namespace Database\Seeders;

use App\Models\Alarm;
use App\Models\Vehicle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Avd;
use Carbon\Carbon;

class AvdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alarms = Alarm::all();

        foreach ($alarms as $alarm) {
            // VEHICLES (solo si el tipo es VEHICE)
            if ($alarm->alarmType->smart_type === 'AVD') {
                Avd::create([
                    'alarm_id'     => $alarm->id,
                    'id_event' => rand(1000, 9999),
                    'status' => ['active', 'resolved', 'ignored'][array_rand(['active', 'resolved', 'ignored'])],
                    'alarm_type' => ['AVD', 'Avd'][array_rand(['AVD', 'Avd'])],
                    'created_at' => Carbon::now()->subMinutes(rand(0, 1000)),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
