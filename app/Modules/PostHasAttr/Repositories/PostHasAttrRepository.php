<?php

namespace App\Modules\PostHasAttr\Repositories;

use App\Modules\PostHasAttr\Models\PostHasAttr;
use Illuminate\Support\Facades\Log;

class PostHasAttrRepository
{
    public function all()
    {
        return PostHasAttr::all();
    }

    public function paginate($perPage = 15)
    {
        return PostHasAttr::paginate($perPage);
    }

    public function find($id)
    {
        return PostHasAttr::findOrFail($id);
    }

    public function create(array $data)
    {
        return PostHasAttr::create($data);
    }

    public function update($id, array $data)
    {
        $model = PostHasAttr::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = PostHasAttr::findOrFail($id);
        return $model->delete();
    }

    // PostHasAttrRepository'de yeni metod
    public function findByPost($postId)
    {
        return PostHasAttr::where('post', $postId) // 'post' burada doğru
        ->with(['post', 'attr'])  // İlişkili post ve attr verilerini yükle
        ->get();  // Verileri döndür
    }

    public function updateOrCreateAttr(array $data): void
    {

        PostHasAttr::updateOrCreate(
            [
                'post_id' => $data['post_id'],
                'attr_id' => $data['attr_id'],
            ],
            [
                'value' => $data['value'] ?? null,
            ]
        );
    }
}
