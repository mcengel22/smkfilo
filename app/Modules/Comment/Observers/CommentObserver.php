<?php

namespace App\Modules\Comment\Observers;

use App\Modules\Comment\Models\Comment;

class CommentObserver
{
    public function created(Comment $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Comment $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Comment $model)
    {
        // Silme işlemi gözlemlendi
    }
}