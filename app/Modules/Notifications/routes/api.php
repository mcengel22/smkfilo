<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Notifications\Http\Controllers\NotificationsController;

Route::group([
    'prefix' => 'api/notifications',
    'as' => 'notifications.',
    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [NotificationsController::class, 'index'])->name('index');
    Route::patch('/read/{id}', [NotificationsController::class, 'markAsRead'])->name('markAsRead');
});
