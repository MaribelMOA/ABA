<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VsdPerson extends Model
{
    /** @use HasFactory<\Database\Factories\VsdPersonFactory> */
    use HasFactory;
    protected $table = 'vsd_people';

    protected $fillable = [
        'vsd_id',
        'upper_length',
        'upper_color',
        'skirt',
        'shoulderbag',
        'sex',
        'mask',
        'hat',
        'glasses',
        'backpack',
        'age',
    ];


    public function vsd()
    {
        return $this->belongsTo(Vsd::class);
    }
}
