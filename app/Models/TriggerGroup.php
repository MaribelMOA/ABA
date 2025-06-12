<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TriggerGroup extends Model
{
    /** @use HasFactory<\Database\Factories\TriggerGroupFactory> */
    use HasFactory;
    protected $table = 'trigger_groups';

    protected $fillable = [
        'id_trigger_device',
        'id_related_device',
    ];

    // Dispositivo que activa (Ej. LPR)
    public function triggerDevice()
    {
        return $this->belongsTo(Device::class, 'id_trigger_device');
    }

    // Dispositivo relacionado que responde al trigger (Ej. ObjCounting)
    public function relatedDevice()
    {
        return $this->belongsTo(Device::class, 'id_related_device');
    }


    public static function createGroup(array $data)
    {
        return self::create($data);
    }

    public static function getGroupById($id)
    {
        return self::find($id);
    }

    public static function getGroupByConditions(array $conditions)
    {
        return self::where($conditions)->first();
    }

    public static function getAllGroupsByConditions(array $conditions)
    {
        return self::where($conditions)->get();
    }

    public static function updateGroup($id, array $data)
    {
        $group = self::find($id);
        if ($group) {
            $group->update($data);
            return $group;
        }
        return null;
    }
}
