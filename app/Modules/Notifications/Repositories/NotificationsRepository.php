<?php

namespace App\Modules\Notifications\Repositories;

use App\Modules\Notifications\Models\Notifications;

class NotificationsRepository
{
    public function create(array $data)
    {
        return Notifications::create($data);
    }

    public function getUserNotifications($userId, $onlyUnread = false)
    {
        return Notifications::where('user_id', $userId)
            ->when($onlyUnread, fn($q) => $q->where('read', false))
            ->latest()
            ->get();
    }

    public function markAsRead($notificationId)
    {
        return Notifications::where('id', $notificationId)->update(['read' => true]);
    }
}

