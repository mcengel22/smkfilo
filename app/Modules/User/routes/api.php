<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Http\Controllers\UserController;

Route::prefix('api/v1/Kullanici')->group(function () {
    // 🔐 Giriş yapan kullanıcıya özel işlemler
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/detay/me', [UserController::class, 'me']);       // Giriş yapan kullanıcıyı getir
        Route::put('/me', [UserController::class, 'updateMe']);   // Giriş yapan kullanıcıyı güncelle
    });

    Route::get('/', [UserController::class, 'index']); // Listeleme
    Route::get('/{id}', [UserController::class, 'show']);       // Giriş yapan kullanıcıyı getir
    Route::post('/', [UserController::class, 'store']); // Ekleme
    Route::put('/{id}', [UserController::class, 'update']); // ID ile güncelleme
    Route::delete('/{id}', [UserController::class, 'destroy']); // Silme
    Route::get('/{id}/payment-plans', [UserController::class, 'paymentPlans']);
    Route::get('/payment-plans/{planId}', [UserController::class, 'showPaymentPlan']);

    Route::post('/{id}/payment-plans', [UserController::class, 'storePaymentPlan']);
    Route::put('/payment-plans/{planId}', [UserController::class, 'updatePaymentPlan']);

    Route::delete('/payment-plans/{planId}', [UserController::class, 'deletePaymentPlan']);
});
