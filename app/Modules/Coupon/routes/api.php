<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Coupon\Http\Controllers\CouponController;

Route::group([
    'prefix' => 'api/v1/coupon',
    'as' => 'v1.coupon',
    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [CouponController::class, 'index'])->name('index')->middleware(['auth:sanctum', 'role:super_admin']); // Listeleme
    Route::post('/', [CouponController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']); // Ekleme
    Route::get('/{id}', [CouponController::class, 'show'])->name('show')->middleware(['auth:sanctum', 'role:super_admin']); // Tekil veri getir
    Route::put('/{id}', [CouponController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']); // Güncelleme
    Route::delete('/{id}', [CouponController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']); // Silme
});

// Public coupon validation endpoint (no auth)
Route::group([
    'prefix' => 'api/v1/coupon',
], static function () {
    Route::post('/validate', [CouponController::class, 'validatePublic']);
});
