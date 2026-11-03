<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Order\Http\Controllers\OrderController;

Route::group([
    'prefix' => 'api/v1/order',
    'as' => 'v1.order',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [OrderController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [OrderController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [OrderController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [OrderController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [OrderController::class, 'destroy'])->name('destroy'); // Silme
});