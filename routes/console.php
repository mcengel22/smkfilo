<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Günlük state güncelleme
Schedule::call(static function () {
    Artisan::call('reservation:state-update');
})->dailyAt('00:00');

// Her dakika: Ödeme yapılmadan beklemede kalan rezervasyonları temizle
Schedule::call(static function () {
    Artisan::call('reservation:cleanup-waiting', [
        '--minutes' => 10,
    ]);
})->everyMinute();
