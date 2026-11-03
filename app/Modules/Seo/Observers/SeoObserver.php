<?php

namespace App\Modules\Seo\Observers;

use App\Modules\Seo\Models\Seo;

class SeoObserver
{
    public function created(Seo $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Seo $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Seo $model)
    {
        // Silme işlemi gözlemlendi
    }
}