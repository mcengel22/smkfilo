<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SmsController;
use App\Modules\Iyzico\Http\Controllers\IyzicoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Select2Controller;
use App\Http\Controllers\DealerController;

// /api/v1/ prefix'i ile rotalar
Route::prefix('v1')->group(function () {

    Route::get('/reports/statistics', [ReportsController::class, 'statistics'])
        ->name('reports.statistics')->middleware(['auth:sanctum', 'role:super_admin']);
    Route::post('/send-sms', [SmsController::class, 'send'])->middleware(['auth:sanctum', 'role:super_admin']);
    // Kullanıcı Girişi
    Route::post('Giris', [AuthController::class, 'login'])->name('login');
    Route::post('TokenYenile', [AuthController::class, 'refreshToken'])->name('token.refresh')->middleware('auth:sanctum');
    // Kullanıcı kaydı
    Route::post('KayitOl', [AuthController::class, 'register'])->name('register');
    // Kullanıcı çıkışı
    Route::middleware('auth:sanctum')->post('Cikis', [AuthController::class, 'logout'])->name('logout');
    // Giriş yapmış kullanıcıyı döndüren rota
    Route::middleware('auth:sanctum')->get('me', function () {
        return new \App\Modules\User\Http\Resources\UserResource(auth()->user()->load('regionSimple'));
    })->name('me');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/admin-request', [AuthController::class, 'adminRequest'])->name('adminRequest');
        Route::get('/admin-request', [AuthController::class, 'listPendingAdminRequests'])->name('adminRequest.pending');
        Route::post('/admin-request/approve/{id}', [AuthController::class, 'approveAdmin'])->name('adminRequest.approve');
        Route::post('/admin-request/reject/{id}', [AuthController::class, 'rejectAdmin'])->name('adminRequest.reject');


    });

    // Dealer routes
    Route::middleware(['auth:sanctum', 'role:super_admin'])->group(function () {
        Route::get('/dealers', [DealerController::class, 'index'])->name('dealers.index');
        Route::get('/dealers/{id}/statistics', [DealerController::class, 'statistics'])->name('dealers.statistics');
        Route::get('/dealers/{id}/payment-plans', [DealerController::class, 'paymentPlanHistory'])->name('dealers.payment-plans.history');
    });

    Route::prefix('payten')->group(function () {
        Route::post('create-payment', [IyzicoController::class, 'showHashRequest']);
        Route::post('success', [IyzicoController::class, 'success']);
        Route::post('fail', [IyzicoController::class, 'fail']);
        Route::get('payment-status/{paymentId}', [IyzicoController::class, 'checkPaymentStatus']);
        Route::post('fail-reservation', [IyzicoController::class, 'failReservation']);
    });

    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::middleware('auth:sanctum')->put('reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
    Route::get('/select2/regions', [Select2Controller::class, 'searchRegions']);
    Route::get('/select2/icons', [Select2Controller::class, 'searchIcons']);
    Route::get('/select2/search', [Select2Controller::class, 'searchPosts']);


});
