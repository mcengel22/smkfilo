<?php

namespace App\Modules\Post\Models;

use App\Modules\Media\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostGalleryImage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'gallery_id',
        'media_id',
        'sort_order',
    ];

    public function gallery()
    {
        return $this->belongsTo(PostGallery::class, 'gallery_id');
    }

    public function media()
    {
        return $this->belongsTo(Media::class);
    }
}
