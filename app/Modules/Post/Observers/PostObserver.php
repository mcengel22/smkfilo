<?php

namespace App\Modules\Post\Observers;

use App\Modules\Post\Models\Post;

class PostObserver
{
    public function created(Post $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Post $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Post $model)
    {
        // Silme işlemi gözlemlendi
    }
}