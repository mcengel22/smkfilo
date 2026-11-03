<?php

namespace App\Modules\Post\Repositories;

use App\Modules\Post\Models\PostGalleryImage;

class PostGalleryImageRepository
{
    public function create(array $data): PostGalleryImage
    {
        return PostGalleryImage::create($data);
    }

    public function update($id, array $data)
    {
        $model = PostGalleryImage::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = PostGalleryImage::findOrFail($id);
        return $model->forceDelete(); // Force delete, kalıcı silme işlemi
    }

}
