<?php

namespace App\Modules\Showcase\Observers;

use App\Modules\Showcase\Models\Showcase;

class ShowcaseObserver
{
    public function created(Showcase $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Showcase $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Showcase $model)
    {
        // Silme işlemi gözlemlendi
    }
}