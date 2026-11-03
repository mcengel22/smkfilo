<?php

namespace App\Modules\ShowcaseHasPost\Observers;

use App\Modules\ShowcaseHasPost\Models\ShowcaseHasPost;

class ShowcaseHasPostObserver
{
    public function created(ShowcaseHasPost $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(ShowcaseHasPost $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(ShowcaseHasPost $model)
    {
        // Silme işlemi gözlemlendi
    }
}