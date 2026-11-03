<?php

namespace App\Modules\Showcase\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ShowcaseNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Yeni Showcase Bildirimi')
                    ->view('modules.Showcase.emails.notification')
                    ->with(['data' => $this->data]);
    }
}