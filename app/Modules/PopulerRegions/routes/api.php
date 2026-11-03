<?php

use Illuminate\Support\Facades\Route;
use App\Modules\PopulerRegions\Http\Controllers\PopulerRegionsController;

Route::group([
    'prefix' => 'api/v1/populerregions',
    'as' => 'v1.populerregions',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [PopulerRegionsController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [PopulerRegionsController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [PopulerRegionsController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [PopulerRegionsController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [PopulerRegionsController::class, 'destroy'])->name('destroy'); // Silme
});