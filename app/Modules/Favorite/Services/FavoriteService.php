<?php

namespace App\Modules\Favorite\Services;

use App\Modules\Favorite\Repositories\FavoriteRepository;

class FavoriteService
{
    protected $favoriteRepository;

    public function __construct(FavoriteRepository $favoriteRepository)
    {
        $this->favoriteRepository = $favoriteRepository;
    }

    /**
     * Kullanıcıya ait favorileri getir.
     *
     * @param $userId
     * @return mixed
     */
    public function getFavoritesByUser($userId)
    {
        return $this->favoriteRepository->getFavoritesByUser($userId);
    }

    /**
     * Favori eklemek.
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data)
    {
        return $this->favoriteRepository->create($data);
    }

    /**
     * Favori silmek.
     *
     * @param $id
     * @return mixed
     */
    public function delete($id)
    {
        return $this->favoriteRepository->delete($id);
    }

    /**
     * Favori verisini bulmak.
     *
     * @param $id
     * @return mixed
     */
    public function find($id)
    {
        return $this->favoriteRepository->find($id);
    }

    public function getFavoritePostsByUser(int $userId)
    {
        return $this->favoriteRepository->getFavoritePostsByUser($userId);
    }
}
