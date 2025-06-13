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
            $age = rand(10, 80) . 'y';

            $imageUrls = [
                'https://via.placeholder.com/640x480?text=Face1',
                'https://via.placeholder.com/640x480?text=Face2',
                'https://via.placeholder.com/640x480?text=Face3',
            ];
            $image = $imageUrls[array_rand($imageUrls)];

            // VEHICLES (solo si el tipo es VEHICE)
            if ($alarm->alarmType->smart_type === 'VFD') {
                Vfd::create([
                    'alarm_id'     => $alarm->id,
                    'id_target' => rand(1000, 9999),
                    'sex' => ['male', 'female', 'unknown'][array_rand(['male', 'female', 'unknown'])],
                    'age' => $age,
                    'image' => $image,
                    'created_at' => Carbon::now()->subMinutes(rand(0, 500)),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
