<?php

namespace App\Modules\Post\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostGallery extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'post_id',
        'title',
        'sort_order',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function images()
    {
        return $this->hasMany(PostGalleryImage::class, 'gallery_id')->orderBy('sort_order');
    }
}
