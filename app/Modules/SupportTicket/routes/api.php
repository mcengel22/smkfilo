<?php

use Illuminate\Support\Facades\Route;
use App\Modules\SupportTicket\Http\Controllers\Api\SupportTicketController;

Route::group(['prefix' => 'api'], function () {
    Route::get('support-tickets', [SupportTicketController::class, 'index']);
});
