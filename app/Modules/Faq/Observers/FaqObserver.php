<?php

namespace App\Modules\Faq\Observers;

use App\Modules\Faq\Models\Faq;

class FaqObserver
{
    public function created(Faq $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Faq $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Faq $model)
    {
        // Silme işlemi gözlemlendi
    }
}