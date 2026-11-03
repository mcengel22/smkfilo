<?php

namespace App\Modules\Attr\Repositories;

use App\Enums\PostType;
use App\Modules\Attr\Models\Attr;

class AttrRepository
{
    public function all()
    {
        return Attr::all();
    }

    public function paginate($perPage = 15)
    {
        return Attr::paginate($perPage);
    }

    public function find($slug)
    {
        return Attr::where('slug', $slug)->firstOrFail();
    }

    public function create(array $data)
    {
        return Attr::create($data);
    }

    public function update($slug, array $data)
    {
        $model = Attr::where('slug', $slug)->firstOrFail();
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        return Attr::findOrFail($id)->delete();
    }

    //attr_type a göre listeleme örnek = rules,features gibi
    public function getByType(string $type)
    {
        return Attr::with('infoRelation') // 👈 İlişkili modeli yüklüyoruz
            ->where('attr_type', $type)
            ->get();
    }

    public function getByPostType(string $postType)
    {
        return Attr::where(function ($query) use ($postType) {
            // 'post_type' array içinde olan postType'ı sorgula
            $query->whereJsonContains('post_type', $postType);
        })
            ->get();
    }

    public function getByPostTypeAndAttrType(string $postType, string $attrType)
    {
        return Attr::where(static function ($query) use ($postType) {
            // 'post_type' array içinde olan postType'ı sorgula ve 'all' olanları da dahil et
            $query->whereJsonContains('post_type', $postType)  // JSON array içinde bir değer arar
                ->orWhereJsonContains('post_type', 'all');   // 'all' olanları da dahil et
        })
            ->where('attr_type', $attrType)  // attr_type filtresi
            ->get();
    }

    // Markaya göre paketleri getir (near_id = markaNın ID'si, attr_type = rules)
    public function getPackagesByBrand(int $nearId)
    {
        return Attr::where('attr_type', 'rules')
            ->where('near_id', $nearId)
            ->get();
    }
}
