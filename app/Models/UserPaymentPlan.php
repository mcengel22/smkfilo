<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPaymentPlan extends Model
{
    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'monthly_amount',
        'status',
        'note',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Modules\User\Models\User::class);
    }
}
