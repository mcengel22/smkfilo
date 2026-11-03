<?php

namespace App\Modules\Media\Observers;

use App\Modules\Media\Models\Media;

class MediaObserver
{
    public function created(Media $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Media $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Media $model)
    {
        // Silme işlemi gözlemlendi
    }
}