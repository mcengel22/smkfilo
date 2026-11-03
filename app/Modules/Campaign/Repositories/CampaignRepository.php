<?php

namespace App\Modules\Campaign\Repositories;

use App\Modules\Campaign\Models\Campaign;

class CampaignRepository
{
    public function all()
    {
        return Campaign::with(['coupon', 'media'])->get(); // Kupon ve medya ilişkilerini yükle
    }

    public function paginate($perPage = 15)
    {
        return Campaign::with(['coupon', 'media'])->paginate($perPage); // Kupon ve medya ilişkilerini yükle
    }

    public function find($slug)
    {
        return Campaign::with(['coupon', 'media'])->where('slug', $slug)->firstOrFail(); // Slug ile sorgulama yapıyoruz
    }

    public function create(array $data)
    {
        return Campaign::create($data);
    }

    public function update($slug, array $data)
    {
        // Slug kolonu ile kaydı bulalım
        $model = Campaign::where('slug', $slug)->firstOrFail();

        // Modeli güncelleyelim
        $model->update($data);

        // Güncellenmiş modeli döndürelim
        return $model;
    }

    public function delete($id)
    {
        $model = Campaign::findOrFail($id);
        return $model->delete();
    }
}
