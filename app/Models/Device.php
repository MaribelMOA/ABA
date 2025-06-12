<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    /** @use HasFactory<\Database\Factories\DeviceFactory> */
    use HasFactory;
    // Si la tabla no sigue la convención de pluralización, puedes especificar el nombre de la tabla
    protected $table = 'devices';

    // Si quieres permitir la asignación masiva de estos campos:
    protected $fillable = [
        'account_id',
        'mac',
        'device_name',
        'sn',
        'alarm_type_id',
        'image_save_enabled',
        'device_enabled',
    ];

    /**
     * Relación con el modelo AlarmType.
     * Un "device" pertenece a un "alarm_type".
     */
    public function alarmType()
    {
        return $this->belongsTo(AlarmType::class);
    }
    public function alarm()
    {
        return $this->hasMany(Alarm::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }


}
