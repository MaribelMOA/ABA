<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObjectCounting extends Model
{
    /** @use HasFactory<\Database\Factories\ObjectCountingFactory> */
    use HasFactory;
    protected $table = 'object_countings';

    // Si quieres permitir la asignación masiva de estos campos:
    protected $fillable = [
        'general_id',
        'alarm_type_id',
        'object_type',
        'object_state',
        'count'
    ];


    /**Un "object_counting" pertenece a un "general".*/
    public function general()
    {
        return $this->belongsTo(General::class);
    }

    /** Un "object_counting" pertenece a un "alarm_type". */
    public function alarmType()
    {
        return $this->belongsTo(AlarmType::class);
    }

}
