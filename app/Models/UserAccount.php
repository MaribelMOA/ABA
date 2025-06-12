<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAccount extends Model
{
    /** @use HasFactory<\Database\Factories\UserAccountFactory> */
    use HasFactory;

    protected $table = 'user_accounts';

    protected $fillable = [
        'user_id',
        'account_id',
    ];

    // Relaciones (opcional, pero recomendado para Eloquent)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

}
