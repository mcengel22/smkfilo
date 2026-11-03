<?php

namespace App\Modules\User\Models;

use Illuminate\Database\Eloquent\Model;

class UserContract extends Model
{
    protected $table = 'user_contracts';

    protected $fillable = [
        'user_id',
        'contract_text',
        'approved_at',
        'ip_address',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
