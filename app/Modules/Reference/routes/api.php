<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Reference\Http\Controllers\ReferenceController;

Route::group([
    'prefix' => 'api/v1/reference',
    'as' => 'v1.reference.',
], static function () {
    Route::get('/', [ReferenceController::class, 'index'])->name('index'); // Anasayfa: sadece aktifler
    Route::get('/admin', [ReferenceController::class, 'adminIndex'])->name('admin')->middleware('auth:sanctum'); // Panel: hepsi
    Route::post('/', [ReferenceController::class, 'store'])->name('store')->middleware('auth:sanctum');
    Route::post('/{id}', [ReferenceController::class, 'update'])->name('update')->middleware('auth:sanctum'); // Güncelleme
    Route::delete('/{id}', [ReferenceController::class, 'destroy'])->name('destroy')->middleware('auth:sanctum'); // Silme
});
