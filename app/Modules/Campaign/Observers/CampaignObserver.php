<?php

namespace App\Modules\Campaign\Observers;

use App\Modules\Campaign\Models\Campaign;

class CampaignObserver
{
    public function created(Campaign $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Campaign $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Campaign $model)
    {
        // Silme işlemi gözlemlendi
    }
}