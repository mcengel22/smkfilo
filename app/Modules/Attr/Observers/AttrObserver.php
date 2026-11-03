<?php

namespace App\Modules\Attr\Observers;

use App\Modules\Attr\Models\Attr;

class AttrObserver
{
    public function created(Attr $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Attr $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Attr $model)
    {
        // Silme işlemi gözlemlendi
    }
}