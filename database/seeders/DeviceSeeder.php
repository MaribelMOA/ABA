<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Device;
use App\Models\AlarmType;
use Illuminate\Support\Str;


class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $alarmTypes = AlarmType::all();

        foreach ($alarmTypes as $index => $type) {
            Device::create([
                'mac' => $this->generateMac($index),
                'device_name' => 'Device for ' . $type->smart_type,
                'sn' => 'SN-' . strtoupper(Str::random(6)),
                'alarm_type_id' => $type->id,
            ]);
        }
    }

    private function generateMac(int $index): string
    {
        return sprintf('AA:BB:CC:%02X:%02X:%02X', ($index + 1), rand(0, 255), rand(0, 255));
    }
}
