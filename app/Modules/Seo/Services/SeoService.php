<?php

namespace App\Modules\Seo\Services;

use App\Modules\Seo\Repositories\SeoRepository;

class SeoService
{
    protected SeoRepository $seoRepository;

    public function __construct(SeoRepository $seoRepository)
    {
        $this->seoRepository = $seoRepository;
    }

    public function all()
    {
        return $this->seoRepository->all();
    }

    public function paginate($perPage = 15, $page = 1, $orderBy = 'id', $orderDirection = 'desc')
    {
        return $this->seoRepository->paginate($perPage, $page, $orderBy, $orderDirection);
    }

    public function create(array $data)
    {
        return $this->seoRepository->create($data);
    }

    public function find($id)
    {
        return $this->seoRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->seoRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->seoRepository->delete($id);
    }

    /** 🔹 sadece type bazlı SEO getir */
    public function findByType(?string $type)
    {
        return $this->seoRepository->findByType($type);
    }
}
