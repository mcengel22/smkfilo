<?php

namespace App\Modules\Reservation\Services;

use App\Modules\Reservation\Repositories\ReservationDetailRepository;

class ReservationDetailService
{
    protected ReservationDetailRepository $reservationDetailRepository;
    public function __construct(ReservationDetailRepository $reservationDetailRepository)
    {
        $this->reservationDetailRepository = $reservationDetailRepository;
    }

    public function all()
    {
        return $this->reservationDetailRepository->all();
    }

    public function create(array $data)
    {
        return $this->reservationDetailRepository->create($data);

    }

    public function find($id)
    {
        return $this->reservationDetailRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->reservationDetailRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->reservationDetailRepository->delete($id);
    }
}
