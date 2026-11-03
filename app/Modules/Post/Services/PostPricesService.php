<?php

namespace App\Modules\Post\Services;

use App\Modules\Post\Models\PostDetail;
use App\Modules\Post\Repositories\PostPricesRepository;


class PostPricesService
{
    protected PostPricesRepository $postPriceRepository;

    public function __construct(PostPricesRepository $postPriceRepository)
    {
        $this->postPriceRepository = $postPriceRepository;
    }

    public function all()
    {
        return $this->postPriceRepository->all();
    }

    public function create(array $data)
    {
        return $this->postPriceRepository->create($data);
    }

    public function find($id)
    {
        return $this->postPriceRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->postPriceRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->postPriceRepository->delete($id);
    }

    public function syncPrices(int $postId, array $prices): void
    {
        $this->postPriceRepository->syncPrices($postId, $prices);
    }
}
