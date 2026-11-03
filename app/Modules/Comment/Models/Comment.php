<?php

namespace App\Modules\Comment\Models;

use App\Modules\Post\Models\Post;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $table = 'comments';

    // Hangi alanlar doldurulabilir? 🔨
    protected $fillable = [
        'reservation_id',
        'post_id',
        'user_id',
        'comment',
        'rating',
        'status',
    ];

    protected $dates = ['deleted_at'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // İlişkiler başlasın! 🎉

    // Yorumun sahibi
    // İlişkileri tanımlıyoruz
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Yorum hangi ilana yapılmış
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // Yorum hangi rezervasyona ait
    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
