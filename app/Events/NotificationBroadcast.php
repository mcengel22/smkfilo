<?php

namespace App\Events;

use App\Modules\Notifications\Models\Notifications;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationBroadcast implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    // NotificationBroadcast, ilgili bildirim verisini alır
    public function __construct(Notifications $notification)
    {
        $this->notification = $notification;
    }

    // Broadcast kanalı
    public function broadcastOn()
    {
        return new Channel('user.' . $this->notification->user_id);
    }

    // Broadcast mesajının içeriği
    public function broadcastWith()
    {
        return [
            'message' => $this->notification->message,
            'type' => $this->notification->type,
        ];
    }
}

