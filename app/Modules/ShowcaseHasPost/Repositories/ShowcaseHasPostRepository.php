<?php

namespace App\Modules\ShowcaseHasPost\Repositories;

use App\Modules\ShowcaseHasPost\Models\ShowcaseHasPost;

class ShowcaseHasPostRepository
{
    public function all()
    {
        return ShowcaseHasPost::all();
    }

    public function paginate($perPage = 15)
    {
        return ShowcaseHasPost::paginate($perPage);
    }

    public function find($id)
    {
        return ShowcaseHasPost::findOrFail($id);
    }

    public function create(array $data)
    {
        return ShowcaseHasPost::create($data);
    }

    // New method to check if the relationship already exists
    public function findByShowcaseAndPost(int $showcaseId, int $postId)
    {
        return ShowcaseHasPost::where('showcase_id', $showcaseId)
            ->where('post_id', $postId)
            ->first(); // Returns the existing record or null
    }


    public function update($id, array $data)
    {
        $model = ShowcaseHasPost::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = ShowcaseHasPost::findOrFail($id);
        return $model->delete();
    }
}
