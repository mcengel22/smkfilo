<?php

namespace App\Modules\Post\Repositories;

use App\Modules\Post\Models\PostDetail;

class PostDetailRepository
{
    public function all()
    {
        return PostDetail::all();
    }

    public function paginate($perPage = 15)
    {
        return PostDetail::paginate($perPage);
    }

    public function find($id)
    {
        return PostDetail::findOrFail($id);
    }

    public function create(array $data)
    {
        return PostDetail::create($data);
    }

    public function update($id, array $data)
    {
        $model = PostDetail::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        // ID'ye göre post detayını bul ve sil
        $model = PostDetail::findOrFail($id);
        // Silme işlemi
        return $model->forceDelete();  // ForceDelete yerine delete() de kullanabilirsin.
    }

    /**
     * Bir post için gönderilen key=>value çiftlerini
     * updateOrCreate ile senkronize eder.
     */
    public function syncDetails(int $postId, array $details): void
    {
        // 0) İsterseniz artık gönderilmeyen anahtarları silebilirsiniz:
        PostDetail::where('post_id', $postId)
            ->whereNotIn('key', array_keys($details))
            ->delete();

        // 1) Her bir key=>value çifti için ya güncelle ya oluştur
        foreach ($details as $key => $value) {
            PostDetail::updateOrCreate(
                [
                    'post_id' => $postId,
                    'key'     => $key,
                ],
                [
                    'value'   => $value,
                ]
            );
        }
    }
}
