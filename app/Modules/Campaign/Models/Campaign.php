<?php

namespace App\Modules\Campaign\Models;
use App\Modules\Coupon\Models\Coupon;
use App\Modules\Media\Models\Media;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Campaign extends Model
{
    use SoftDeletes;

    protected $table = 'campaigns'; // Tablo adı
    protected $fillable = ['title', 'content', 'long_content', 'slug', 'image', 'coupons_id']; // Doldurulabilir alanlar
    protected $dates = ['deleted_at']; // Silinmiş tarih
    protected $casts = [
        'created_at' => 'datetime', // Tarih dönüşümü
        'updated_at' => 'datetime', // Tarih dönüşümü
    ];

    /**
     * Coupon ile ilişkiyi tanımlıyoruz.
     * Her kampanya bir kupona aittir.
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class, 'coupons_id'); // campaigns tablosu coupons_id ile coupon'a bağlı
    }

    public function media()
    {
        return $this->belongsTo(Media::class, 'image');
    }
    protected static function booted()
    {
        static::creating(function ($campaign) {
            // Eğer slug boşsa, başlıktan slug oluştur
            if (empty($campaign->slug)) {
                $campaign->slug = Str::slug($campaign->title);  // Başlıktan URL dostu slug oluştur
            }

            // Slug'ın benzersiz olmasını sağla
            if (self::where('slug', $campaign->slug)->exists()) {
                $campaign->slug = $campaign->slug . '-' . time();  // Eğer aynı slug varsa zaman damgası ekle
            }
        });
    }

}
