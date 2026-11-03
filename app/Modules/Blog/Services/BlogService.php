<?php

namespace App\Modules\Blog\Services;

use App\Modules\Blog\Repositories\BlogRepository;

class BlogService
{
    protected BlogRepository $blogRepository;

    public function __construct(BlogRepository $blogRepository)
    {
        $this->blogRepository = $blogRepository;
    }

    public function all()
    {
        return $this->blogRepository->all();
    }

    public function paginate($perPage = 15, $page = 1, $orderBy = 'id', $orderDirection = 'desc')
    {
        return $this->blogRepository->paginate($perPage, $page, $orderBy, $orderDirection);
    }

    public function create(array $data)
    {
        return $this->blogRepository->create($data);
    }

    public function find($id)
    {
        return $this->blogRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->blogRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->blogRepository->delete($id);
    }

    public function findByType(?string $type)
    {
        return $this->blogRepository->findByType($type);
    }

    /** 🔹 Yeni: Slug bazlı bulma */
    public function findBySlug(string $slug)
    {
        return $this->blogRepository->findBySlug($slug);
    }
}
