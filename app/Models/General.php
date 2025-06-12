<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
class General extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\GeneralFactory> */
    use HasFactory;
    use InteractsWithMedia;

    protected $table = 'generals';

    protected $fillable = [
        'alarm_id',
        'id_event',
        'status',
        'alarm_type',
        'image',
    ];


    public function alarm()
    {
        return $this->belongsTo(Alarm::class);
    }
}
