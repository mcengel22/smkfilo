<?php

namespace App\Modules\PostHasAttr\Observers;

use App\Modules\PostHasAttr\Models\PostHasAttr;

class PostHasAttrObserver
{
    public function created(PostHasAttr $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(PostHasAttr $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(PostHasAttr $model)
    {
        // Silme işlemi gözlemlendi
    }
}