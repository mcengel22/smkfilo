<?php

namespace App\Modules\Blog\Models;

use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'slug',
        'image',
        'type',
        'region_id',
        'sections',
        'faq_title',
        'faqs',
        'keywords',
        'backlinks',
    ];

    protected $casts = [
        'sections' => 'array',
        'faqs' => 'array',
        'keywords' => 'array',
        'backlinks' => 'array',
    ];

    /** 🔹 Her blog bir bölgeye ait olabilir */
    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }

    /** 🔹 SLUG OLUŞTURMA — otomatik title'dan türetir */
    protected static function booted()
    {
        static::creating(function ($blog) {
            // Eğer slug yoksa title'dan oluştur
            if (empty($blog->slug) && !empty($blog->title)) {
                $blog->slug = Str::slug($blog->title);

                // Benzersiz yap (aynı slug varsa sonuna sayı ekle)
                $originalSlug = $blog->slug;
                $counter = 1;
                while (static::where('slug', $blog->slug)->exists()) {
                    $blog->slug = "{$originalSlug}-{$counter}";
                    $counter++;
                }
            }
        });

        static::updating(function ($blog) {
            // Eğer kullanıcı slug göndermediyse title değişmişse güncelle
            if (empty($blog->slug) && !empty($blog->title)) {
                $blog->slug = Str::slug($blog->title);

                $originalSlug = $blog->slug;
                $counter = 1;
                while (static::where('slug', $blog->slug)
                    ->where('id', '!=', $blog->id)
                    ->exists()) {
                    $blog->slug = "{$originalSlug}-{$counter}";
                    $counter++;
                }
            }
        });
    }
}
