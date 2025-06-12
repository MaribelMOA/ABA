<?php

namespace Database\Seeders;

use App\Models\Alarm;
use App\Models\General;
use App\Models\Vehicle;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alarms = Alarm::all();

        foreach ($alarms as $alarm) {
            // VEHICLES (solo si el tipo es VEHICE)
            if ($alarm->alarmType->smart_type === 'VEHICE') {
                Vehicle::create([
                    'alarm_id'     => $alarm->id,
                    'plate_number' => 'ABC-' . rand(100, 999),
                    'id_car'       => Str::uuid(),
                    'car_color'    => fake()->safeColorName(),
                    'image'        => 'vehicle_' . $alarm->id . '.jpg',
                    'plate_image'  => 'plate_' . $alarm->id . '.jpg',
                ]);
            }
        }
    }
}
