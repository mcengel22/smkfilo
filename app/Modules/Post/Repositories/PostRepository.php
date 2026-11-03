<?php

namespace App\Modules\Post\Repositories;

use App\Enums\PostType;
use App\Modules\Attr\Models\Attr;
use App\Modules\Post\Models\Post;

class PostRepository
{
    public function all()
    {
        return Post::with([
            'postHasAttrs',
            'postHasAttrs.attr',
            'details',
            'media',
            'comments'  // Burada comments ilişkisini da ekliyoruz
        ])->get();
    }

    // App\Modules\Post\Repositories\PostRepository.php

    public function getByUser(int $userId)
    {
        return Post::with([
            'postHasAttrs',
            'postHasAttrs.attr',
            'details',
            'media',
            'comments'
        ])
            ->where('user_id', $userId)  // sadece kendi ilanları
            ->get();
    }


    public function paginate($perPage = 15)
    {
        return Post::paginate($perPage);
    }

    public function find($id)
    {
        return Post::findOrFail($id);
    }
// ID yerine slug ile çekiyoruz artık!
    // PostRepository.php içinde:
    public function findBySlug(string $slug)
    {
        return Post::with([
            'media',
            'region.parentCity',
            // Sadece onaylanmış yorumlar gösterilir / puana dahil edilir
            'comments' => fn ($q) => $q->where('status', 'approved'),
            'details',
            'postHasAttrs.attr.infoRelation', // 🔥 attr'ı da yükle yoksa hep null döner
            'postHasAttrs.attr.media',
            'postGalleries.images.media', // 💥 Galeriyi ve görselleri çekiyoruz!
        ])->where('slug', $slug)->firstOrFail();
    }


    public function create(array $data)
    {
        return Post::create($data);
    }

    public function update($slug, array $data)
    {
        $model = Post::Where('slug',$slug)->firstOrFail();
        $model->update($data);
        return $model;
    }
    public function updateStatus($id, array $data)
    {
        $model = Post::findOrFail($id); // 👈 slug değil id!
        $model->update($data);
        return $model;
    }
    public function delete($id)
    {
        $model = Post::withCount('reservations')->findOrFail($id);

        // ❌ Rezervasyon varsa silmeye izin verme
        if ($model->reservations_count > 0) {
            throw new \Exception("Rezervasyonu olan ilan silinemez");
        }

        return $model->forceDelete();
    }

    public function filter(array $filters, string $orderBy = 'id', string $orderDirection = 'desc')
    {
        $query = Post::query()->withCardRelations();

        // 🔍 Özellik filtreleri
        if (!empty($filters['attrs'])) {
            $query->whereHas('postHasAttrs', function ($query) use ($filters) {
                foreach ($filters['attrs'] as $key => $array) {
                    $query->where(function ($subQuery) use ($array) {
                        foreach ($array as $slug) {
                            $attr = Attr::where('slug', $slug)->first();
                            if ($attr) {
                                $subQuery->orWhere('attr_id', $attr->id);
                            }
                        }
                    });
                }
            });
        }

        // 📅 Tarih filtresi
        if (!empty($filters['created_at_to'])) {
            $query->whereDate('created_at', '<=', $filters['created_at_to']);
        }

        // ✅ Sadece aktif ilanlar
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy($orderBy, $orderDirection);
    }

    public function getByType(string $type)
    {
        // Enum doğrulaması
        if (!PostType::checkValue($type)) {
            throw new \InvalidArgumentException('Geçersiz type değeri');
        }

        return Post::where('type', $type)->get();
    }

}
