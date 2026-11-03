<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Reservation\Http\Controllers\ReservationController;

Route::group([
    'prefix' => 'api/v1/reservation',
    'as' => 'v1.reservation',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/pending-count', [ReservationController::class, 'pendingCount'])->name('pendingCount')->middleware('auth:sanctum');
    Route::post('/manual', [ReservationController::class, 'storeManual'])->name('manual.store');
    Route::post('/external', [ReservationController::class, 'storeExternal']);
    Route::get('/', [ReservationController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [ReservationController::class, 'store'])->name('store')->middleware([\App\Http\Middleware\CheckForToken::class]);
    Route::get('/{id}', [ReservationController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [ReservationController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [ReservationController::class, 'destroy'])->name('destroy'); // Silme
    Route::post('/filter', [ReservationController::class, 'filter'])->name('filter')->middleware('auth:sanctum');
    Route::post('root/by-post', [ReservationController::class, 'rootByPost'])->name('rootByPost')->middleware('auth:sanctum');
    Route::post('/user/filter', [ReservationController::class, 'userByFilter'])->name('userByFilter')->middleware('auth:sanctum');

    Route::post('/search', [ReservationController::class, 'search'])->name('search');


    // 👇 Yeni eklenen aksiyonlar
    Route::post('/confirmed/{id}', [ReservationController::class, 'confirmed'])
        ->name('confirmed');
    Route::post('/canceled/{id}',  [ReservationController::class, 'canceled'])
        ->name('canceled');
});
