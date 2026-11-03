<?php

namespace App\Modules\User\Repositories;

use App\Modules\User\Models\Guest;

class GuestRepository
{

    public function find($id)
    {
        return Guest::findOrFail($id);
    }

    public function create(array $data)
    {
        return Guest::create($data);
    }

}
