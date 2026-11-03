<?php

namespace App\Modules\PopulerRegions\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PopulerRegionsNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function build()
    {
        return $this->subject('Yeni PopulerRegions Bildirimi')
                    ->view('modules.PopulerRegions.emails.notification')
                    ->with(['data' => $this->data]);
    }
}