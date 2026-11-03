<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Order\Http\Controllers\OrderController;

Route::group([
    'prefix' => 'api/v1/order',
    'as' => 'v1.order',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [OrderController::class, 'index'])->name('index')->middleware(['auth:sanctum', 'role:super_admin']); // Listeleme
    Route::post('/', [OrderController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']); // Ekleme
    Route::get('/{id}', [OrderController::class, 'show'])->name('show')->middleware(['auth:sanctum', 'role:super_admin']); // Tekil veri getir
    Route::put('/{id}', [OrderController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']); // Güncelleme
    Route::delete('/{id}', [OrderController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']); // Silme
});