<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VsdCar extends Model
{
    /** @use HasFactory<\Database\Factories\VsdCarFactory> */
    use HasFactory;
    protected $table = 'vsd_cars';

    protected $fillable = [
        'vsd_id',
        'year',
        'car_type',
        'car_color',
        'brand',
        'model',
    ];

    public function vsd()
    {
        return $this->belongsTo(Vsd::class);
    }
}
