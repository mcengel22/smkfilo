<?php

namespace App\Modules\KmPaketleri\Services;

use App\Modules\KmPaketleri\Repositories\KmPaketleriRepository;

class KmPaketleriService
{
    protected $kmPaketleriRepository;

    public function __construct(KmPaketleriRepository $kmPaketleriRepository)
    {
        $this->kmPaketleriRepository = $kmPaketleriRepository;
    }

    public function all()
    {
        return $this->kmPaketleriRepository->all();
    }

    public function create(array $data)
    {
        return $this->kmPaketleriRepository->create($data);
    }

    public function find($id)
    {
        return $this->kmPaketleriRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->kmPaketleriRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->kmPaketleriRepository->delete($id);
    }
}
