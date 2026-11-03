<?php

namespace App\Modules\ShowcaseHasPost\Services;

use App\Modules\ShowcaseHasPost\Repositories\ShowcaseHasPostRepository;

class ShowcaseHasPostService
{
    protected $showcaseHasPostRepository;

    public function __construct(ShowcaseHasPostRepository $showcaseHasPostRepository)
    {
        $this->showcaseHasPostRepository = $showcaseHasPostRepository;
    }

    public function all()
    {
        return $this->showcaseHasPostRepository->all();
    }

    public function create(array $data)
    {
        $created = [];

        foreach ($data['post_ids'] as $postId) {
            $exists = $this->showcaseHasPostRepository->findByShowcaseAndPost($data['showcase_id'], $postId);

            if (!$exists) {
                $created[] = $this->showcaseHasPostRepository->create([
                    'showcase_id' => $data['showcase_id'],
                    'post_id' => $postId,
                ]);
            }
        }

        return $created;
    }


    public function find($id)
    {
        return $this->showcaseHasPostRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->showcaseHasPostRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->showcaseHasPostRepository->delete($id);
    }
}
