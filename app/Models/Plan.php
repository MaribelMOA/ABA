<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    /** @use HasFactory<\Database\Factories\PlanFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'rate_limit_per_min',
        'rate_limit_per_day',
        'price',
        'description',
    ];
}
