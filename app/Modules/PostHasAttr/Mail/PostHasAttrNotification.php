<?php

namespace App\Modules\PostHasAttr\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PostHasAttrNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Yeni PostHasAttr Bildirimi')
                    ->view('modules.PostHasAttr.emails.notification')
                    ->with(['data' => $this->data]);
    }
}