<?php

use Illuminate\Support\Facades\Route;
use App\Modules\ShowcaseHasPost\Http\Controllers\ShowcaseHasPostController;

Route::group([
    'prefix' => 'api/v1/showcasehaspost',
    'as' => 'v1.showcasehaspost',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [ShowcaseHasPostController::class, 'index'])->name('index'); // Listeleme
    Route::post('/{showcase}', [ShowcaseHasPostController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']);
    Route::get('/{id}', [ShowcaseHasPostController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [ShowcaseHasPostController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']); // Güncelleme
    Route::delete('/{id}', [ShowcaseHasPostController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']); // Silme
});
