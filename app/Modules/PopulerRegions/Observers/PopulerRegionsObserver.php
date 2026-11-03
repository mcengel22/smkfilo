<?php

namespace App\Modules\PopulerRegions\Observers;

use App\Modules\PopulerRegions\Models\PopulerRegions;

class PopulerRegionsObserver
{
    public function created(PopulerRegions $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(PopulerRegions $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(PopulerRegions $model)
    {
        // Silme işlemi gözlemlendi
    }
}