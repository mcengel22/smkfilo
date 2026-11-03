<?php

namespace App\Modules\Post\Services;

use App\Modules\Post\Models\PostDetail;
use App\Modules\Post\Repositories\PostDetailRepository;


class PostDetailService
{
    protected $postDetailRepository;

    public function __construct(PostDetailRepository $postDetailRepository)
    {
        $this->postDetailRepository = $postDetailRepository;
    }

    public function all()
    {
        return $this->postDetailRepository->all();
    }

    public function create(array $data)
    {
        return $this->postDetailRepository->create($data);
    }

    public function find($id)
    {
        return $this->postDetailRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->postDetailRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->postDetailRepository->delete($id);
    }

    public function syncDetails(int $postId, array $details): void
    {
        $this->postDetailRepository->syncDetails($postId, $details);
    }
}
