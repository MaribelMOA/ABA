<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TargetType extends Model
{
    /** @use HasFactory<\Database\Factories\TargetTypeFactory> */
    use HasFactory;
    protected $table = 'target_types';

     protected $fillable = ['target_type'];

    public static function createTargetType(array $data)
    {
        return self::create($data);
    }
    public static function createOrGetTargetType(array $data)
    {
        return self::firstOrCreate($data);
    }


    public static function getTargetTypeById($id)
    {
        return self::find($id);
    }

    public static function getTargetTypeByConditions(array $conditions)
    {
        return self::where($conditions)->first();
    }
}
