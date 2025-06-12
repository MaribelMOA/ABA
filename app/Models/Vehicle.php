<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
class Vehicle extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\VehicleFactory> */
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'vehicles';

    protected $fillable = [
        'alarm_id',
        'plate_number',
        'id_car',
        'car_color',
        'image',
        'plate_image',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('vehicle_general_image')->useDisk('public');
        $this->addMediaCollection('vehicle_plate_image')->useDisk('public');
    }

    public function alarm()
    {
        return $this->belongsTo(Alarm::class);
    }
}
