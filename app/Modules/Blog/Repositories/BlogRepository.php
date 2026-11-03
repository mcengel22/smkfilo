<?php

namespace App\Modules\Blog\Repositories;

use App\Modules\Blog\Models\Blog;

class BlogRepository
{
    public function all()
    {
        return Blog::all();
    }

    public function paginate($perPage = 15, $page = 1, $orderBy = 'id', $orderDirection = 'desc')
    {
        return Blog::with('region') // 🔥 Eager load
        ->orderBy($orderBy, $orderDirection)
            ->paginate($perPage, ['*'], 'page', $page);
    }


    public function find($id)
    {
        return Blog::findOrFail($id);
    }

    public function create(array $data)
    {
        return Blog::create($data);
    }

    public function update($id, array $data)
    {
        $blog = Blog::findOrFail($id);
        $blog->update($data);
        return $blog;
    }

    public function delete($id)
    {
        $blog = Blog::findOrFail($id);
        return $blog->delete();
    }

    public function findByType(?string $type)
    {
        return Blog::where('type', $type)->first();
    }

    /** 🔹 Yeni: Slug bazlı bulma */
    public function findBySlug(string $slug)
    {
        return Blog::with('region') // 🔥 İlişkiyi yükle
        ->where('slug', $slug)
            ->first();
    }

}
