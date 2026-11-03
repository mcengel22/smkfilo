<?php

namespace App\Modules\Favorite\Repositories;

use App\Modules\Favorite\Models\Favorite;

class FavoriteRepository
{
    /**
     * Kullanıcıya ait tüm favorileri döndür.
     *
     * @param $userId
     * @return mixed
     */
    public function getFavoritesByUser($userId)
    {
        return Favorite::where('user_id', $userId)->get();
    }

    /**
     * Tüm favorileri döndür.
     *
     * @return mixed
     */
    public function all()
    {
        return Favorite::all();
    }

    /**
     * Favori eklemek.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return Favorite::create($data);
    }

    /**
     * Favoriyi silmek.
     *
     * @param $id
     * @return mixed
     */
    public function delete($id)
    {
        $model = Favorite::findOrFail($id);
        return $model->delete();
    }


    public function getFavoritePostsByUser(int $userId): \Illuminate\Support\Collection
    {
        return Favorite::with('post')
            ->where('user_id', $userId)
            ->get(); // sadece get
    }



}
