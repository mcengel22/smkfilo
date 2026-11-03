<?php

namespace App\Modules\Showcase\Repositories;

use App\Modules\Showcase\Models\Showcase;

class ShowcaseRepository
{
    public function all()
    {
        // showcaseHasPosts ilişkisi ile birlikte, 'sort_order' alanına göre artan sıralama
        return Showcase::with([
            'showcaseHasPosts.post' => function ($query) {
                $query->where('status', 1); // 👈 Sadece aktif post'lar
            }
        ])
            ->orderBy('sort_order', 'asc')
            ->get();

    }


    public function paginate($perPage = 15)
    {
        return Showcase::paginate($perPage);
    }

    public function find($id)
    {
        return Showcase::with('showcaseHasPosts.post')->findOrFail($id);
    }


    public function create(array $data)
    {
        // En yüksek sort_order'ı bul
        $maxSortOrder = Showcase::max('sort_order') ?? 0;

        // Sort order yoksa, otomatik ata
        if (!isset($data['sort_order'])) {
            $data['sort_order'] = $maxSortOrder + 1;
        }

        return Showcase::create($data);
    }

    public function update($id, array $data)
    {
        $model = Showcase::findOrFail($id);
        $model->update($data);
        return $model;
    }

    // ShowcaseRepository
    public function delete($id)
    {
        $model = Showcase::findOrFail($id);

        // ShowcaseHasPost ilişkisini manuel olarak sil
        $model->showcaseHasPosts()->delete(); // Showcase'a bağlı ShowcaseHasPost'ları sil

        // Showcase'ı sil
        $model->delete();
    }

    public function updateSortOrder($id, $sortOrder)
    {
        // Showcase'ı buluyoruz
        $showcase = Showcase::findOrFail($id);

        // Sort order'ı güncelliyoruz
        $showcase->update(['sort_order' => $sortOrder]);

        return $showcase;
    }

}
