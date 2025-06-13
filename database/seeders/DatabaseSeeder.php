<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Services\DevicesServices;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;



class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

//        \App\Models\User::where('email', 'test@example.com')->delete();
//
//        \App\Models\User::factory()->create([
//            'name' => 'Test User',
//            'email' => 'test@example.com',
//        ]);

        $user=User::firstOrCreate([
            ['email' => 'admin@example.com'],
            [
                'name' => 'admin',
                'password' => Hash::make('D123d456!'),
            ]
        ]);

        $role=Role::firstOrCreate(['name' => 'admin']);
        $user->assignRole($role);
        if (DB::table('alarm_types')->count() === 0) {
            $this->call(AlarmTypeSeeder::class);
        }

        if (DB::table('target_types')->count() === 0) {
            $this->call(TargetTypeSeeder::class);
        }

        if (DB::table('devices')->count() === 0) {
            $this->call(DeviceSeeder::class);
        }











        if (DB::table('alarms')->count() === 0) {
            $this->call(AlarmSeeder::class);
        }

        if (DB::table('vehicles')->count() === 0) {
            $this->call(VehicleSeeder::class);
        }

        if (DB::table('generals')->count() === 0) {
            $this->call(GeneralSeeder::class);
        }

        if (DB::table('object_countings')->count() === 0) {
            $this->call(ObjectCountingSeeder::class);
        }

        if (DB::table('vsds')->count() === 0) {
            $this->call(VsdSeeder::class);
        }

        if (DB::table('vsd_cars')->count() === 0) {
            $this->call(VsdCarSeeder::class);
        }

        if (DB::table('vsd_people')->count() === 0) {
            $this->call(VsdPersonSeeder::class);
        }

        if (DB::table('avds')->count() === 0) {
            $this->call(AvdSeeder::class);
        }

        if (DB::table('vfds')->count() === 0) {
            $this->call(VfdSeeder::class);
        }

//        $this->call([
//            AlarmTypeSeeder::class,
//            TargetTypeSeeder::class,
//            DeviceSeeder::class,
//            AlarmSeeder::class,
//            VehicleSeeder::class,
//            GeneralSeeder::class,
//            ObjectCountingSeeder::class,
//            VsdSeeder::class,
//            VsdCarSeeder::class,
//            VsdPersonSeeder::class,
//            AvdSeeder::class,
//            VfdSeeder::class,
//
//        ]);
    }
}
