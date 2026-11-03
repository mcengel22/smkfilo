<?php

namespace App\Modules\Reservation\Models;

use Illuminate\Database\Eloquent\Model;

class ReservationDetail extends Model
{
    protected $table = 'reservation_details';

    protected $fillable = [
        'reservation_id',
        'adults',
        'children',
        'infants',
        'cleaning_fee',
        'deposit',
        'note',
        'post_price_id',
        'km_package_id',
    ];

    // 📎 İlişki: Bu detay bir rezervasyona ait
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function postPrice()
    {
        return $this->belongsTo(\App\Modules\Post\Models\PostPrice::class, 'post_price_id');
    }

    public function kmPackage()
    {
        return $this->belongsTo(\App\Modules\KmPaketleri\Models\KmPaketleri::class, 'km_package_id');
    }
}
