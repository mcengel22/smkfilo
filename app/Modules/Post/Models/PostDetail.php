<?php

namespace App\Modules\Post\Models;

use App\Modules\Post\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PostDetail extends Model
{
    use SoftDeletes;

    protected $table = 'post_details';

    // İzin verilen alanlar
    protected $fillable = ['post_id', 'key', 'value']; // 'key' ve 'value' alanlarını ekledim

    // Silme zamanı için
    protected $dates = ['deleted_at'];

    // Tarihleri doğru şekilde yönetmek için
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // PostDetail modelinin Post modeline ait olduğunu belirtiyoruz
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id'); // Post ile ilişki kuruyoruz
    }
}
