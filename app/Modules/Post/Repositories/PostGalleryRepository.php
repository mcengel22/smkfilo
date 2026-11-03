<?php

namespace App\Modules\Post\Repositories;

use App\Modules\Post\Models\PostGallery;
use App\Modules\Post\Models\PostGalleryImage;

class PostGalleryRepository
{
    public function all()
    {
        return PostGallery::all();
    }

    public function paginate($perPage = 15)
    {
        return PostGallery::paginate($perPage);
    }

    public function find($id)
    {
        return PostGallery::findOrFail($id);
    }

    public function create(array $data)
    {
        return PostGallery::create($data);
    }

    public function update($id, array $data)
    {
        $model = PostGallery::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = PostGallery::findOrFail($id);
        return $model->forceDelete(); // Force delete, kalıcı silme işlemi
    }
}
