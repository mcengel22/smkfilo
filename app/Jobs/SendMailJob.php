<?php

namespace App\Jobs;

use App\Mail\NotificationMailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $notification;

    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    public function handle()
    {
        if (
            empty($this->notification?->user?->email) ||
            !filter_var($this->notification->user->email, FILTER_VALIDATE_EMAIL)
        ) {
            return; // geçersiz mail, sessizce çık
        }

        try {
            Mail::to($this->notification->user->email)
                ->send(new NotificationMailer($this->notification));
        } catch (\Throwable $e) {
            Log::error(
                'MAIL JOB FAIL: ' . $e->getMessage(),
                ['email' => $this->notification->user->email]
            );
        }
    }

}

