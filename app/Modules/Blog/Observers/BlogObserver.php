<?php

namespace App\Modules\Blog\Observers;

use App\Modules\Blog\Models\Blog;

class BlogObserver
{
    public function created(Blog $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Blog $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Blog $model)
    {
        // Silme işlemi gözlemlendi
    }
}