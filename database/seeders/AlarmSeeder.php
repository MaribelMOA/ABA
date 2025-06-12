<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Alarm;
use App\Models\Device;

class AlarmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = Device::with('alarmType')->get();

        foreach ($devices as $device) {
            for ($i = 0; $i < 10; $i++) {
                Alarm::create([
                    'device_id' => $device->id,
                    'alarm_type_id' => $device->alarm_type_id,
                    'utc' => now()->subMinutes(rand(1, 10000))->timestamp, // Simula una fecha pasada
                ]);
            }
        }
    }
}
