<?php

namespace App\Modules\KmPaketleri\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KmPaketleri extends Model
{
    use SoftDeletes;

    protected $table = 'km_paketleri';
    protected $fillable = ['km', 'price'];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'km' => 'integer',
        'price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
