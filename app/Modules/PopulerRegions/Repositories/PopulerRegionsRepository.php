<?php

namespace App\Modules\PopulerRegions\Repositories;

use App\Modules\PopulerRegions\Models\PopulerRegions;

class PopulerRegionsRepository
{
    public function all()
    {
        return PopulerRegions::all();
    }

    public function paginate($perPage = 15)
    {
        return PopulerRegions::paginate($perPage);
    }

    public function find($id)
    {
        return PopulerRegions::findOrFail($id);
    }

    public function create(array $data)
    {
        return PopulerRegions::create($data);
    }

    public function update($id, array $data)
    {
        $model = PopulerRegions::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = PopulerRegions::findOrFail($id);
        return $model->delete();
    }
}