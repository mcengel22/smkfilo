<?php

namespace App\Modules\Post\Models;

use App\Enums\PostCard;
use App\Enums\ReservationStatus;
use App\Helpers\GeneralHelper;
use App\Models\Region;
use App\Modules\Comment\Models\Comment;
use App\Modules\Favorite\Models\Favorite;
use App\Modules\Media\Models\Media;
use App\Modules\PostHasAttr\Models\PostHasAttr;
use App\Modules\Reservation\Models\Reservation;
use App\Modules\Showcase\Models\Showcase;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    protected $table = 'posts';

    // İzin verilen alanlar
    protected $fillable = [
        'user_id',
        'title',
        'region_id',
        'neighborhood',
        'slug',
        'cover',
        'description',
        'code',
        'status',
        'type', // ✅ bunu ekle kanka
    ];


    // Silme zamanı için
    protected $dates = ['deleted_at'];

    // Tarihleri doğru şekilde yönetmek için
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public function scopeFilter($query, $filters)
    {
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        //        $filters['status'] = $filters['status'] ?? 1; // 🛡 default aktif
        // Search filtresi
        $query = $this->applySearchFilter($query, $filters);

        // Category filtresi
        $query = $this->applyTypeFilter($query, $filters);

        // Region filtresi
        $query = $this->applyRegionFilter($query, $filters);

        // Attribute filtresi
        $query = $this->applyAttributeFilter($query, $filters);

        // Detail filtresi
        $query = $this->applyDetailFilter($query, $filters);

        // Rezervasyon Date filtresi
        $query = $this->applyReservationDateFilter($query, $filters);

        // Price Dtae filtresi
        $query = $this->applyPriceDateFilter($query, $filters);

        // Price filtresi bu daha kurgulanmadı
        // $query = $this->applyPriceFilter($query, $filters);

        // Status filtresi
        $query = $this->applyStatusFilter($query, $filters);

        return $query;
    }

    public function scopeFilters($query, $filters)
    {
        // 🔐 Sadece aktif ilanlar gelsin
        $filters['status'] = 1;

        $query = $this->applySearchFilter($query, $filters);
        $query = $this->applyTypeFilter($query, $filters);
        $query = $this->applyRegionFilter($query, $filters);
        $query = $this->applyAttributeFilter($query, $filters);
        $query = $this->applyDetailFilter($query, $filters);
        $query = $this->applyReservationDateFilter($query, $filters);
        $query = $this->applyPriceDateFilter($query, $filters);
        $query = $this->applyPasifStatusFilter($query, $filters); // 👈 Özel status filtresi

        return $query;
    }


    public function applyPasifStatusFilter($query, $filters)
    {
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }
    public function applyStatusFilter($query, $filters)
    {
        // Eğer status gelmişse uygula, gelmemişse dokunma
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }

    public function applySearchFilter($query, $filters)
    {
        // search Filtreleme
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('slug', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('code', 'LIKE', "%{$searchTerm}%");
            });
        }
        return $query;
    }


    protected function applyTypeFilter($query, $filters)
    {
        // Eğer 'type' boş değilse ve 'all' değilse filtre uygula
        if (!empty($filters['type']) && $filters['type'] !== 'all') {
            $query->where('type', $filters['type']);
        }

        return $query;
    }


    protected function applyRegionFilter($query, $filters)
    {
        if (!empty($filters['region']['id'])) {
            $query->whereHas('region', function ($q) use ($filters) {
                $q->where('id', $filters['region']['id']);
            });
        }

        return $query;
    }

    // Attribute filtresi fonksiyonu
    protected function applyAttributeFilter($query, $filters)
    {
        if (isset($filters['attrs']) && is_array($filters['attrs'])) {
            foreach ($filters['attrs'] as $attrType => $slugs) {
                if (is_array($slugs) && count($slugs)) {
                    $query->whereHas('postHasAttrs.attr', function ($q) use ($attrType, $slugs) {
                        $q->where('attr_type', $attrType)
                            ->whereIn('slug', $slugs);
                    });
                }
            }
        }

        return $query;
    }

    // Detail filtresi fonksiyonu
    protected function applyDetailFilter($query, $filters)
    {
        if (!isset($filters['type'])) return $query;

        $enum = PostCard::tryFrom($filters['type']);
        if (!$enum) {
            return $query;
        }

        $details = $enum->keys();

        if (!empty($filters['detail'])) {
            foreach ($filters['detail'] as $key => $value) {
                // Detay tipine göre uygun filtreleme yapılır
                if (isset($details[$key])) {
                    $type = $details[$key]['type'];
                    $rule = $details[$key]['rule'];

                    // Sayısal filtre
                    if ($type === 'numeric') {
                        $value = (int) $value;
                        if ($rule === 'integer|min:0') {
                            $query->whereHas('details', function ($q) use ($key, $value) {
                                $q->where('key', $key)->where('value', '>=', $value);
                            });
                        } else {
                            $query->whereHas('details', function ($q) use ($key, $value) {
                                $q->where('key', $key)->where('value', '=', $value);
                            });
                        }
                    }
                    // String filtre
                    elseif ($type === 'string') {
                        $query->whereHas('details', function ($q) use ($key, $value) {
                            $q->where('key', $key)->where('value', 'LIKE', "%$value%");
                        });
                    }
                    // Boolean filtre
                    elseif ($type === 'boolean') {
                        $query->whereHas('details', function ($q) use ($key, $value) {
                            $q->where('key', $key)->where('value', '=', (bool)$value);
                        });
                    }
                }
            }
        }

        return $query;
    }


    protected function applyReservationDateFilter($query, $filters)
    {
        // Tarih filtrelerini al
        $startDate = $filters['dateRange']['start_date'] ?? null;
        $endDate = $filters['dateRange']['end_date'] ?? null;

        if ($startDate && $endDate) {
            $query->whereDoesntHave('reservations', function ($q) use ($startDate, $endDate) {
                $q->where('status', '!=', ReservationStatus::CANCELED)  // İptal edilmiş olanları dışarıda tut
                    ->where(function ($q) use ($startDate, $endDate) {
                        // Çakışan tarih aralıkları kontrolü
                        $q->where(function ($q1) use ($startDate, $endDate) {
                            // Tarih aralıklarının çakışıp çakışmadığını kontrol et
                            $q1->whereBetween('start_date', [$startDate, $endDate])
                                ->orWhereBetween('end_date', [$startDate, $endDate]);
                        })
                            ->orWhere(function ($q2) use ($startDate, $endDate) {
                                // Başlangıç ve bitiş tarihleri tamamen çakışıyorsa
                                $q2->where('start_date', '<=', $endDate)
                                    ->where('end_date', '>=', $startDate);
                            });
                    });
            });
        }

        return $query;
    }

    protected function applyPriceDateFilter($query, $filters)
    {
        $startDate = $filters['dateRange']['start_date'] ?? null;
        $endDate = $filters['dateRange']['end_date'] ?? null;

        if ($startDate && $endDate) {
            $query->whereHas('prices', function ($q) use ($startDate, $endDate) {
                $q->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('start_date', [$startDate, $endDate])
                        ->orWhereBetween('end_date', [$startDate, $endDate])
                        ->orWhere(function ($q2) use ($startDate, $endDate) {
                            $q2->where('start_date', '<=', $startDate)
                                ->where('end_date', '>=', $endDate);
                        });
                });
            });
        }

        return $query;
    }

    protected function applyPriceFilter($query, $filters)
    {
        $min_price = $filters['min_price'] ?? null;
        $max_price = $filters['max_price'] ?? null;

        if ($min_price && $max_price) {
            $query->whereHas('prices', function ($q) use ($min_price, $max_price) {});
        }

        return $query;
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'post_id');
    }
    public function postHasAttrs()
    {
        return $this->hasMany(PostHasAttr::class, 'post_id');
    }

    // Post modelinde kullanıcı ile ilişki
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id'); // Kullanıcıya ait
    }

    // Post modelinde detaylarla ilişki
    public function details()
    {
        return $this->hasMany(PostDetail::class, 'post_id'); // Post detayları
    }

    // 🔗 Medya ilişkisi (Tek bir media varsa belongsTo kullanılır!)
    public function media()
    {
        return $this->belongsTo(Media::class, 'cover');
    }
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    // Post modelinde aşağıdakine benzer bir ilişki olmalı:
    public function favoritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favorites', 'post_id', 'user_id');
    }


    public function prices()
    {
        return $this->hasMany(PostPrice::class);
    }

    public function showcases()
    {
        return $this->belongsToMany(Showcase::class, 'showcase_has_posts');
    }
    public function galleries()
    {
        return $this->hasMany(PostGallery::class)->orderBy('sort_order');
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            if (is_null($post->code)) {
                $post->code = GeneralHelper::generateUniqueCode(Post::class);
            }
        });

        static::saving(function ($post) {
            if (empty($post->slug)) {
                $post->slug = GeneralHelper::toSlug($post->title, static::class);
            }
        });

        static::saved(function ($post) {
            $user = User::findOrFail($post->user_id);

            if ($user->type !== 'super_admin') {
                if (!str_contains($post->title, 'mera-')) {
                    $extra = 5000 + $post->id;
                    $post->title .= ' mera-' . $extra;
                    $post->slug = GeneralHelper::toSlug($post->title, static::class);
                    $post->saveQuietly();
                }
            }
        });
    }
    public function comments()
    {
        return $this->hasMany(Comment::class); // Burada Comment modelini kullanıyorum
    }

    public function getMinFuturePrice(): float
    {
        return (float) (
            $this->prices()
            ->min('price') ?? 0
        );
    }
    // Post.php modeline ekle
    public function postGalleries()
    {
        return $this->hasMany(PostGallery::class, 'post_id')->with('images.media');
    }

    // SEO ilişkisi
    public function seo()
    {
        return $this->hasOne(\App\Modules\Seo\Models\Seo::class, 'post_id');
    }
}
