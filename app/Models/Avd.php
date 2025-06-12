<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avd extends Model
{
    /** @use HasFactory<\Database\Factories\AvdFactory> */
    use HasFactory;
    protected $table = 'avds';

    protected $fillable = [
        'alarm_id',
        'id_event',
        'status',
        'alarm_type',
    ];

    public function alarm()
    {
        return $this->belongsTo(Alarm::class);
    }




}
