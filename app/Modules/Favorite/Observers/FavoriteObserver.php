<?php

namespace App\Modules\Favorite\Observers;

use App\Modules\Favorite\Models\Favorite;

class FavoriteObserver
{
    public function created(Favorite $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Favorite $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Favorite $model)
    {
        // Silme işlemi gözlemlendi
    }
}