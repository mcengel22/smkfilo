<?php

namespace App\Modules\Coupon\Observers;

use App\Modules\Coupon\Models\Coupon;

class CouponObserver
{
    public function created(Coupon $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Coupon $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Coupon $model)
    {
        // Silme işlemi gözlemlendi
    }
}