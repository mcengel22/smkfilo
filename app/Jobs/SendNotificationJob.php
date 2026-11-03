<?php

namespace App\Jobs;

use App\Events\NotificationBroadcast;
use App\Modules\Notifications\Services\NotificationsService;
use App\Modules\User\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;
    protected $message;
    protected $type;

    public function __construct($userId, $message, $type)
    {
        $this->userId = $userId;
        $this->message = $message;
        $this->type = $type;
    }

    public function handle()
    {
        $notification = app(NotificationsService::class)->createNotification($this->userId, $this->message, $this->type);

        // Bildirimi hemen broadcast et
        $this->broadcastNotification($notification);

        // SMS ve e-posta gönderimlerini tetikle
        $this->sendNotificationIfNeeded($notification);
    }

    // Bildirimi broadcast et
    protected function broadcastNotification($notification)
    {
        broadcast(new NotificationBroadcast($notification));  // Bu event frontend'e bildirim gönderiyor
    }

    protected function sendNotificationIfNeeded($notification): void
    {
        $user = User::find($this->userId);

        if ($user->notificationPreferences->email_notifications) {
            dispatch(new SendMailJob($notification));
        }
        if ($user->notificationPreferences->sms_notifications) {
            dispatch(new SendSmsJob($notification));
        }
    }
}

