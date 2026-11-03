<?php

namespace App\Modules\ShowcaseHasPost\Models;

use App\Modules\Post\Models\Post;
use App\Modules\Showcase\Models\Showcase;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShowcaseHasPost extends Model
{
    use SoftDeletes;

    // Tablo adı
    protected $table = 'showcase_has_posts';

    // Toplanacak alanlar
    protected $fillable = ['showcase_id', 'post_id'];

    // Soft delete için tarih alanı
    protected $dates = ['deleted_at'];

    // Tarih formatlarını cast et
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime', // Soft delete tarihi de cast ediliyor
    ];

    // ShowcaseHasPost Model
    public function showcase()
    {
        return $this->belongsTo(Showcase::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
