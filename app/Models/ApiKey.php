<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    /** @use HasFactory<\Database\Factories\ApiKeyFactory> */
    use HasFactory;
    protected $fillable = [
        'account_id',
        'api_key',
        'client_secret',
        'label',
        'mode',
        'active',
    ];

    public function account() {
        return $this->belongsTo(Account::class);
    }
}
