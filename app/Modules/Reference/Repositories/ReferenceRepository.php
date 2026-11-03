<?php

namespace App\Modules\Reference\Repositories;

use App\Modules\Reference\Models\Reference;

class ReferenceRepository
{
    public function all()
    {
        return Reference::with('media')->orderBy('sort_order')->orderBy('id')->get();
    }

    public function active()
    {
        return Reference::with('media')->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get();
    }

    public function create(array $data)
    {
        return Reference::create($data);
    }

    public function update($id, array $data)
    {
        $model = Reference::findOrFail($id);
        $model->update($data);

        return $model->load('media');
    }

    public function delete($id)
    {
        $model = Reference::findOrFail($id);
        return $model->delete();
    }
}
