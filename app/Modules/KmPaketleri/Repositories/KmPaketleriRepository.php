<?php

namespace App\Modules\KmPaketleri\Repositories;

use App\Modules\KmPaketleri\Models\KmPaketleri;

class KmPaketleriRepository
{
    public function all()
    {
        return KmPaketleri::all();
    }

    public function paginate($perPage = 15)
    {
        return KmPaketleri::paginate($perPage);
    }

    public function find($id)
    {
        return KmPaketleri::findOrFail($id);
    }

    public function create(array $data)
    {
        return KmPaketleri::create($data);
    }

    public function update($id, array $data)
    {
        $model = KmPaketleri::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = KmPaketleri::findOrFail($id);
        return $model->delete();
    }
}
