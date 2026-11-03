<?php

namespace App\Modules\PopulerRegions\Models;

use App\Models\Region;
use App\Modules\Media\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\City; // City modelini dahil ediyoruz
use App\Models\District; // District modelini dahil ediyoruz


class PopulerRegions extends Model
{
    use SoftDeletes;

    protected $table = 'populer_regions';
    protected $dates = ['deleted_at'];
    protected $fillable = ['region_id', 'cover'];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // City ile ilişki
    public function regions()
    {
        return $this->belongsTo(Region::class);
    }


    // Cover (media) ile ilişki
    public function media()
    {
        return $this->belongsTo(Media::class, 'cover');
    }
}
