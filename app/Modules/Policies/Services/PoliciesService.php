<?php

namespace App\Modules\Policies\Services;

use App\Modules\Policies\Repositories\PoliciesRepository;

class PoliciesService
{
    protected $repository;

    public function __construct(PoliciesRepository $repository)
    {
        $this->repository = $repository;
    }

    public function all()
    {
        return $this->repository->all();
    }

    public function find($idOrType)
    {
        return $this->repository->find($idOrType);
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}
