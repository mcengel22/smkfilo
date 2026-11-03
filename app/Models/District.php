<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;

    protected $table = 'districts';

    protected $fillable = [
        'city_id',
        'name', // district yerine name kullanıldı
    ];

    public $timestamps = false; // Eğer timestamps yoksa

    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }
}
