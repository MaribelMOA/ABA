<?php

namespace Database\Seeders;

use App\Models\Alarm;
use App\Models\Avd;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Vfd;

class VfdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alarms = Alarm::all();

        foreach ($alarms as $alarm) {
            // VEHICLES (solo si el tipo es VEHICE)
            if ($alarm->alarmType->smart_type === 'VFD') {
                Vfd::create([
                    'alarm_id'     => $alarm->id,
                    'id_target' => rand(1000, 9999),
                    'sex' => fake()->randomElement(['male', 'female', 'unknown']),
                    'age' => fake()->numberBetween(10, 80) . 'y',
                    'image' => fake()->imageUrl(640, 480, 'people', true, 'face'),
                    'created_at' => Carbon::now()->subMinutes(rand(0, 500)),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
