<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
    ];

//    public function users(){
//        return $this->belongsToMany(User::class, 'user_account');
//    }


    public function apiKeys() {
        return $this->hasMany(ApiKey::class);
    }

    public function devices()
    {
        return $this->hasMany(Device::class, 'account_id');
    }
}
