<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Modules\Notifications\Models\Notifications; //  Model dahil edelim

class NotificationMailer extends Mailable
{
    use Queueable, SerializesModels;

    public $notification;

    /**
     * Create a new message instance.
     *
     * @param  \App\Modules\Notifications\Models\Notification  $notification
     * @return void
     */
    public function __construct(Notifications $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this
            ->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Yeni Rezervasyon Bildirimi')
            ->view('notification')
            ->with(['notification' => $this->notification]);
    }


}
