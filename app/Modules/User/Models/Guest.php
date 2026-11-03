<?php

namespace App\Modules\User\Models;

use App\Modules\Order\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Reservation\Models\Reservation;

class Guest extends Model
{

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone'
    ];

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    // Misafirin yaptığı rezervasyonlar
    public function reservations()
    {
        return $this->morphMany(Reservation::class, 'reservable');
    }

    // Misafirin yaptığı siparişler (Polymorphic ilişki ile Order'ı bağlama)
    public function orders()
    {
        return $this->morphMany(Order::class, 'reservable');
    }
}
