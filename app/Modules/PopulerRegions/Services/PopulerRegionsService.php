<?php

namespace App\Modules\PopulerRegions\Services;

use App\Modules\PopulerRegions\Repositories\PopulerRegionsRepository;

class PopulerRegionsService
{
    protected $populerRegionsRepository;

    public function __construct(PopulerRegionsRepository $populerRegionsRepository)
    {
        $this->populerRegionsRepository = $populerRegionsRepository;
    }

    public function all()
    {
        return $this->populerRegionsRepository->all();
    }

    public function create(array $data)
    {
        return $this->populerRegionsRepository->create($data);
    }

    public function find($id)
    {
        return $this->populerRegionsRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->populerRegionsRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->populerRegionsRepository->delete($id);
    }
}