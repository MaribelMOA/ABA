<?php

namespace App\Models;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vfd extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\VfdFactory> */
    use HasFactory;
    use InteractsWithMedia;


    protected $table = 'vfds';
    protected $fillable = [
        'alarm_id',
        'id_target',
        'sex',
        'age',
        'image',
    ];



    public function alarm()
    {
        return $this->belongsTo(Alarm::class);
    }
}
