<?php

use Illuminate\Support\Facades\Route;
use App\Modules\KmPaketleri\Http\Controllers\KmPaketleriController;

Route::group([
    'prefix' => 'api/v1/km-paketleri',
    'as' => 'v1.km-paketleri',
    // 'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [KmPaketleriController::class, 'index'])->name('index');
    Route::post('/', [KmPaketleriController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']);
    Route::get('/{id}', [KmPaketleriController::class, 'show'])->name('show');
    Route::put('/{id}', [KmPaketleriController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']);
    Route::delete('/{id}', [KmPaketleriController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']);
});
