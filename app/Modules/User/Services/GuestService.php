<?php

namespace App\Modules\User\Services;

use App\Modules\User\Repositories\GuestRepository;

class GuestService
{
    protected $guestRepository;

    public function __construct(GuestRepository $guestRepository)
    {
        $this->guestRepository = $guestRepository;
    }

    public function create(array $data)
    {
        return $this->guestRepository->create($data);
    }

    public function find($id)
    {
        return $this->guestRepository->find($id);
    }
}
