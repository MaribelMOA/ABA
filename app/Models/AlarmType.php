<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlarmType extends Model
{
    /** @use HasFactory<\Database\Factories\AlarmTypeFactory> */
    use HasFactory;
    protected $table = 'alarm_types';

    protected $fillable = [
        'smart_type',
        'description',
    ];

    public static function createAlarmType(array $data)
    {
        return self::create($data);
    }

    public static function getAlarmTypeById($id)
    {
        return self::find($id);
    }

    public static function getAlarmTypeByConditions(array $conditions)
    {
        return self::where($conditions)->first();
    }

    // Relación inversa, un tipo de alarma puede tener muchas alarmas.
    public function alarms()
    {
        return $this->hasMany(Alarm::class);
    }
    public function devices()
    {
        return $this->hasMany(Device::class);
    }
}
