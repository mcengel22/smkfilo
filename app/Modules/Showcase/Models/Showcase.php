<?php

namespace App\Modules\Showcase\Models;

use App\Modules\Post\Models\Post;
use App\Modules\ShowcaseHasPost\Models\ShowcaseHasPost;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Showcase extends Model
{
    use SoftDeletes;

    // Veritabanı tablosu
    protected $table = 'showcases';

    // Toplanacak alanlar
    protected $fillable = ['title', 'description', 'sort_order'];

    // Silinen kayıtlar için tarih
    protected $dates = ['deleted_at'];

    // Tarih formatlarını cast et
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime', // Soft delete tarihi de cast edilmiştir
    ];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'showcase_has_posts');
    }
    // İlişkiyi tanımlıyoruz: Bir showcase'ın birden fazla postu olabilir
    public function showcaseHasPosts()
    {
        return $this->hasMany(ShowcaseHasPost::class);
    }


}
