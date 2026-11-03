<?php

namespace App\Modules\Favorite\Models;

use App\Modules\User\Models\User;
use App\Modules\Post\Models\Post;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Favorite extends Model
{
    use SoftDeletes;

    protected $table = 'favorites'; // Tablo adı
    protected $fillable = ['user_id', 'post_id']; // Doldurulabilir alanlar
    protected $dates = ['deleted_at']; // Silinmiş tarih
    protected $casts = [
        'created_at' => 'datetime', // Tarih dönüşümü
        'updated_at' => 'datetime', // Tarih dönüşümü
    ];

    /**
     * Kullanıcı ile ilişkiyi tanımlıyoruz.
     * Her favori bir kullanıcıya aittir.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Gönderi (Post) ile ilişkiyi tanımlıyoruz.
     * Her favori bir gönderiye aittir.
     */
    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'id');
    }

    /**
     * Kullanıcının favori postlarını getirir.
     * Belirli bir kullanıcıya ait tüm favori postlar alınır.
     */
    public function userFavorites(User $user)
    {
        return $this->where('user_id', $user->id)->with('post')->get();
    }

    /**
     * Bir postun kaç tane favorisi olduğunu sayar.
     * Belirli bir postun favori sayısını döndürür.
     */
    public function postFavorites(Post $post)
    {
        return $this->where('post_id', $post->id)->count();
    }

    /**
     * Kullanıcı ve post için favorinin var olup olmadığını kontrol eder.
     * Eğer kullanıcı bu postu favorileştirmişse true döner, aksi takdirde false.
     */
    public static function isFavorite(User $user, Post $post)
    {
        return self::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();
    }

    /**
     * Kullanıcının tüm favorilerini siler.
     * Belirli bir kullanıcıya ait tüm favoriler silinir.
     */
    public function removeAllUserFavorites(User $user)
    {
        return $this->where('user_id', $user->id)->delete();
    }

    /**
     * Bir postu favoriye ekler veya favoriden kaldırır.
     * Eğer favoriyse, siler; değilse ekler.
     */
    public static function toggleFavorite(User $user, Post $post)
    {
        $favorite = self::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->first();

        if ($favorite) {
            $favorite->delete(); // Eğer favoriyse, kaldır.
        } else {
            self::create([
                'user_id' => $user->id,
                'post_id' => $post->id,
            ]); // Eğer favori değilse, ekle.
        }
    }
}
