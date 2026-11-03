<?php

namespace App\Modules\Notifications\Observers;

use App\Modules\Notifications\Models\Notifications;

class NotificationsObserver
{
    public function created(Notifications $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Notifications $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Notifications $model)
    {
        // Silme işlemi gözlemlendi
    }
}