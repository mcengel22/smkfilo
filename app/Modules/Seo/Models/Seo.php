<?php

namespace App\Modules\Seo\Models;

use App\Models\Region;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Seo extends Model
{
    protected $table = 'seos';

    protected $fillable = [
        'main_title',
        'titles',
        'main_description',
        'descriptions',
        'canonical_url',
        'slug',
        'image',
        'keywords',
        'type',
        'region_id',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'titles' => 'array',
        'descriptions' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::saving(function ($model) {
            // Slug oluştur
            if ($model->isDirty('main_title') || empty($model->slug)) {
                $model->slug = \Illuminate\Support\Str::slug($model->main_title ?? \Illuminate\Support\Str::random(6));
            }
        });
    }

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}
