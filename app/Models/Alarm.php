<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alarm extends Model
{
    /** @use HasFactory<\Database\Factories\AlarmFactory> */
    use HasFactory;
    protected $table = 'alarms';
    protected $fillable = ['device_id', 'alarm_type_id', 'utc'];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function alarmType()
    {
        return $this->belongsTo(AlarmType::class);
    }


    public function avd()
    {
        return $this->hasMany(Avd::class,);
    }

    public function general()
    {
        return $this->hasMany(General::class);
    }
}
