<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Faq\Http\Controllers\FaqController;

Route::group([
    'prefix' => 'api/v1/faq',
    'as' => 'v1.faq',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [FaqController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [FaqController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [FaqController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [FaqController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [FaqController::class, 'destroy'])->name('destroy'); // Silme
});