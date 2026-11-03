<?php

namespace App\Modules\Order\Observers;

use App\Modules\Order\Models\Order;

class OrderObserver
{
    public function created(Order $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Order $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Order $model)
    {
        // Silme işlemi gözlemlendi
    }
}