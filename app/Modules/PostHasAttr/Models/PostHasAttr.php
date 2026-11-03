<?php

namespace App\Modules\PostHasAttr\Models;

use App\Modules\Attr\Models\Attr;
use App\Modules\Post\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostHasAttr extends Model
{
    use SoftDeletes;

    protected $table = 'post_has_attrs'; // Tablo adı

    // Bu modelde doldurulabilen alanlar
    protected $fillable = ['post_id', 'attr_id','value']; // 'post_id' ve 'attr_id' alanlarını kullanacağız

    // Tarih alanlarını 'datetime' formatında tutuyoruz
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // 'Post' modeliyle ilişkiyi kuruyoruz
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id'); // 'post_id' ile ilişkiyi kuruyoruz
    }

    // 'Attr' modeliyle ilişkiyi kuruyoruz
    public function attr()
    {
        return $this->belongsTo(Attr::class, 'attr_id'); // 'attr_id' ile ilişkiyi doğru şekilde tanımlıyoruz
    }

}
