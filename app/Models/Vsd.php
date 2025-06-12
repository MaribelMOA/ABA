<?php

namespace App\Models;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vsd extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\VsdFactory> */
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'vsds';

    protected $fillable = [
        'alarm_id',
        'id_event',
        'id_target',
        'target_type_id',
        'image',
    ];


    public function alarm()
    {
        return $this->belongsTo(Alarm::class);
    }

    public function targetType()
    {
        return $this->belongsTo(TargetType::class);
    }
}
