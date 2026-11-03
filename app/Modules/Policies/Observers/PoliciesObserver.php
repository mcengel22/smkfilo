<?php

namespace App\Modules\Policies\Observers;

use App\Modules\Policies\Models\Policies;

class PoliciesObserver
{
    public function created(Policies $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Policies $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Policies $model)
    {
        // Silme işlemi gözlemlendi
    }
}