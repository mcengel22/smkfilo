<?php

namespace App\Modules\Coupon\Repositories;

use App\Modules\Coupon\Models\Coupon;

class CouponRepository
{
    public function all()
    {
        return Coupon::with('posts')->get();
    }

    public function paginate($perPage = 15)
    {
        return Coupon::with('posts')->paginate($perPage);
    }

    public function find($id)
    {
        return Coupon::with('posts')->findOrFail($id);
    }

    public function create(array $data)
    {
        // Map post_type to valid_for if provided
        if (isset($data['post_type']) && empty($data['valid_for'])) {
            $data['valid_for'] = $data['post_type'];
        }

        $coupon = Coupon::create($data);

        if (isset($data['post_ids']) && is_array($data['post_ids'])) {
            $coupon->posts()->sync($data['post_ids']);
        }

        return $coupon->load('posts');
    }

    public function update($id, array $data)
    {
        $model = Coupon::findOrFail($id);

        if (isset($data['post_type']) && empty($data['valid_for'])) {
            $data['valid_for'] = $data['post_type'];
        }

        $model->update($data);

        if (array_key_exists('post_ids', $data) && is_array($data['post_ids'])) {
            $model->posts()->sync($data['post_ids']);
        }

        return $model->load('posts');
    }

    public function delete($id)
    {
        $model = Coupon::findOrFail($id);
        return $model->delete();
    }
}
