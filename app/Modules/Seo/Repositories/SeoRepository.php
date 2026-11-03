<?php

namespace App\Modules\Seo\Repositories;

use App\Modules\Seo\Models\Seo;

class SeoRepository
{
    public function all()
    {
        return Seo::with('region')->get();
    }

    public function paginate($perPage = 15, $page = 1, $orderBy = 'id', $orderDirection = 'desc')
    {
        return Seo::with('region')
            ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function find($id)
    {
        return Seo::with('region')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Seo::create($data)->fresh(['region']);
    }

    public function update($id, array $data)
    {
        $seo = Seo::findOrFail($id);
        $seo->update($data);
        return $seo->fresh(['region']);
    }

    public function delete($id)
    {
        $seo = Seo::findOrFail($id);
        return $seo->delete();
    }

    /** 🔹 sadece type bazlı SEO bul (Fail içermez, güvenli) */
    public function findByType(?string $type)
    {
        return Seo::with('region')
            ->when($type, fn($q) => $q->where('type', $type))
            ->first(); // ❗ firstOrFail değil
    }
}
