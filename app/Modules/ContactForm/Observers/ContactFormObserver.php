<?php

namespace App\Modules\ContactForm\Observers;

use App\Modules\ContactForm\Models\ContactForm;

class ContactFormObserver
{
    public function created(ContactForm $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(ContactForm $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(ContactForm $model)
    {
        // Silme işlemi gözlemlendi
    }
}