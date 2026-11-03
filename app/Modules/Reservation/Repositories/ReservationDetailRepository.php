<?php

namespace App\Modules\Reservation\Repositories;

use App\Modules\Reservation\Models\ReservationDetail;

class ReservationDetailRepository
{
    public function all()
    {
        return ReservationDetail::all();
    }

    public function paginate($perPage = 15)
    {
        return ReservationDetail::paginate($perPage);
    }

    public function find($id)
    {
        return ReservationDetail::findOrFail($id);
    }

    public function create(array $data)
    {
        return ReservationDetail::create($data);
    }

    public function update($id, array $data)
    {
        $model = ReservationDetail::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        return ReservationDetail::findOrFail($id)->delete();
    }
}
