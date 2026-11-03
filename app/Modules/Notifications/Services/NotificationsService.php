<?php

namespace App\Modules\Notifications\Services;

use App\Jobs\SendSmsJob;
use App\Mail\NotificationMailer;
use App\Modules\Notifications\Models\NotificationPreferences;
use App\Modules\Notifications\Repositories\NotificationsRepository;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Mail;

class NotificationsService
{
    protected $repository;

    public function __construct(NotificationsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function createNotification($userId, $message, $type = 'database')
    {
        $user = User::find($userId);

        // Bildirim verisini oluştur
        return $this->repository->create([
            'user_id' => $user->id,
            'type'    => $type,
            'message' => $message,
        ]);
    }

    public function getUserNotifications($userId, $onlyUnread = false)
    {
        return $this->repository->getUserNotifications($userId, $onlyUnread);
    }

    public function markAsRead($notificationId)
    {
        return $this->repository->markAsRead($notificationId);
    }
}

