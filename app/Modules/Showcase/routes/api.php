<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Showcase\Http\Controllers\ShowcaseController;

Route::group([
    'prefix' => 'api/v1/showcase',
    'as' => 'v1.showcase',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [ShowcaseController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [ShowcaseController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [ShowcaseController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [ShowcaseController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [ShowcaseController::class, 'destroy'])->name('destroy'); // Silme
    Route::put('/{id}/sort-order', [ShowcaseController::class, 'updateSortOrder'])->name('updateSortOrder'); // Sort order güncelleme
});
