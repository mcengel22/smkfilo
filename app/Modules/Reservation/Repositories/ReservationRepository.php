<?php

namespace App\Modules\Reservation\Repositories;

use App\Modules\Reservation\Models\Reservation;

class ReservationRepository
{
    public function all()
    {
        return Reservation::all();
    }

    public function paginate($perPage = 15)
    {
        return Reservation::paginate($perPage);
    }

    public function find($id)
    {
        return Reservation::findOrFail($id);
    }

    public function create(array $data)
    {
        return Reservation::create($data);
    }

    public function update($id, array $data)
    {
        $model = Reservation::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        return Reservation::findOrFail($id)->delete();
    }

    /**
     * Code ve phone’a göre rezervasyon getirir.
     */
    public function findByCodeAndPhone(string $code, string $phone): ?Reservation
    {
        return Reservation::where('code', $code)
            ->whereHas('reservable', function ($q) use ($phone) {
                $q->where('phone', $phone);
            })
            ->first();
    }

    public function createExternal(array $data)
    {
        return Reservation::create([
            'reservable_type' => null, // guest yok çünkü
            'reservable_id'   => null,
            'post_id'         => $data['post_id'],
            'price'           => 0,
            'start_date'      => $data['start_date'],
            'end_date'        => $data['end_date'],
            'status'          => 'confirmed', // direkt onaylı geliyor
            'state'           => 'finished',
            'code'            => 'EXT-' . strtoupper(uniqid()), // kod üret
            'type'            => $data['type'] ?? 'manuel', // ✅ manual değil, external
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);
    }

}
