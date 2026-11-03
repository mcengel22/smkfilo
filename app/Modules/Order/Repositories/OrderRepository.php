<?php

namespace App\Modules\Order\Repositories;

use App\Modules\Order\Models\Order;

class OrderRepository
{
    public function findById($id): Order
    {
        return Order::findOrFail($id);
    }

    public function create(array $data): Order
    {
        return Order::create($data);
    }

    public function findByReservationId(int $reservationId): ?Order
    {
        return Order::where('reservation_id', $reservationId)->first();
    }
}
