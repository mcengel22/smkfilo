<?php

namespace App\Modules\ShowcaseHasPost\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ShowcaseHasPostNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Yeni ShowcaseHasPost Bildirimi')
                    ->view('modules.ShowcaseHasPost.emails.notification')
                    ->with(['data' => $this->data]);
    }
}