<?php

namespace App\Modules\Post\Repositories;

use App\Modules\Post\Models\PostPrice;

class PostPricesRepository
{
    public function all()
    {
        return PostPrice::all();
    }

    public function paginate($perPage = 15)
    {
        return PostPrice::paginate($perPage);
    }

    public function find($id)
    {
        return PostPrice::findOrFail($id);
    }

    public function create(array $data)
    {
        return PostPrice::create($data);
    }

    public function update($id, array $data)
    {
        $model = PostPrice::findOrFail($id);

        $model->update($data);

        return $model;
    }

    public function delete($id)
    {
        $model = PostPrice::findOrFail($id);

        return $model->forceDelete();
    }

    public function syncPrices(int $postId, array $prices): void
    {
        $existingIds = [];

        foreach ($prices as $item) {

            $price = PostPrice::updateOrCreate(
                [
                    'post_id' => $postId,
                    'years' => (int) $item['years'],
                    'km' => (int) $item['km'],
                ],
                [
                    'price' => (float) $item['value'],
                ]
            );

            $existingIds[] = $price->id;
        }

        // Yeni listede olmayanları sil
        PostPrice::where('post_id', $postId)
            ->whereNotIn('id', $existingIds)
            ->delete();
    }
}
