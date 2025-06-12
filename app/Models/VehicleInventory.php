<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleInventory extends Model
{
    /** @use HasFactory<\Database\Factories\VehicleInventoryFactory> */
    use HasFactory;
    protected $table = 'vehicle_inventories';

    protected $fillable = [
        'plate_number',
        'brand',
        'car_color',
        'model',
        'year',
    ];

    public static function createVehicle(array $data)
    {
        return self::create($data);
    }

    public static function getAllVehiclesInventory()
    {
        return self::all();
    }

    public static function findVehicle(array $data)
    {
        return self::where($data)->first();
    }

    public static function getVehicleById($id)
    {
        return self::find($id);
    }

    public function updateVehicle(array $data)
    {
        return $this->update($data);
    }

    public function deleteVehicle()
    {
        return $this->delete();
    }
}
