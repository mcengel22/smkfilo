<?php

namespace App\Modules\Faq\Repositories;

use App\Modules\Faq\Models\Faq;

class FaqRepository
{
    public function all()
    {
        return Faq::all();
    }

    public function paginate($perPage = 15)
    {
        return Faq::paginate($perPage);
    }

    public function find($id)
    {
        return Faq::findOrFail($id);
    }

    public function create(array $data)
    {
        return Faq::create($data);
    }

    public function update($id, array $data)
    {
        $model = Faq::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = Faq::findOrFail($id);
        return $model->delete();
    }
}