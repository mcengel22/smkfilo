<?php

namespace App\Modules\Media\Repositories;

use App\Modules\Media\Models\Media;
use Illuminate\Database\Eloquent\Builder;

class MediaRepository
{
    /**
     * Yeni bir medya kaydı oluşturur.
     */
    public function create(array $data): Media
    {
        return Media::create($data);
    }

    /**
     * ID ile medya bulur.
     */
    public function find(int $id): ?Media
    {
        return Media::find($id);
    }

    /**
     * Tüm medyalarda sorgu oluşturmak için kullanılır.
     */
    public function query(): Builder
    {
        return Media::query();
    }

    /**
     * ID ile kaydı siler.
     */
    public function delete(int $id): bool
    {
        return (bool) Media::destroy($id);
    }
}
