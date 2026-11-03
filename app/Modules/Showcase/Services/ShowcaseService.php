<?php

namespace App\Modules\Showcase\Services;

use App\Modules\Showcase\Repositories\ShowcaseRepository;

class ShowcaseService
{
    protected $showcaseRepository;

    public function __construct(ShowcaseRepository $showcaseRepository)
    {
        $this->showcaseRepository = $showcaseRepository;
    }

    public function all()
    {
        return $this->showcaseRepository->all();  // Repository'deki all metodunu çağırıyoruz
    }

    public function create(array $data)
    {
        return $this->showcaseRepository->create($data);
    }

    public function find($id)
    {
        return $this->showcaseRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->showcaseRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->showcaseRepository->delete($id);
    }


    public function updateSortOrder($id, $sortOrder)
    {
        return $this->showcaseRepository->updateSortOrder($id, $sortOrder);
    }
}
