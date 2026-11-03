<?php

namespace App\Modules\Coupon\Services;

use App\Modules\Coupon\Repositories\CouponRepository;

class CouponService
{
    protected $couponRepository;

    public function __construct(CouponRepository $couponRepository)
    {
        $this->couponRepository = $couponRepository;
    }

    public function all()
    {
        return $this->couponRepository->all();
    }

    public function create(array $data)
    {
        return $this->couponRepository->create($data);
    }

    public function find($id)
    {
        return $this->couponRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->couponRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->couponRepository->delete($id);
    }
}
