<?php

namespace App\Modules\Policies\Repositories;

use App\Modules\Policies\Models\Policies;

class PoliciesRepository
{
    public function all()
    {
        return Policies::orderBy('id', 'desc')->get();
    }

    public function find($idOrType)
    {
        return Policies::where('id', $idOrType)
            ->orWhere('type', $idOrType)
            ->firstOrFail();
    }

    public function create(array $data)
    {
        return Policies::create($data);
    }

    public function update($id, array $data)
    {
        $model = Policies::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = Policies::findOrFail($id);
        return $model->delete();
    }
}
