<?php

use Illuminate\Support\Facades\Route;
use App\Modules\PostHasAttr\Http\Controllers\PostHasAttrController;

Route::group([
    'prefix' => 'api/v1/posthasattr',
    'as' => 'posthasattr',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [PostHasAttrController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [PostHasAttrController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']); // Ekleme
    Route::get('/{id}', [PostHasAttrController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [PostHasAttrController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']); // Güncelleme
    Route::delete('/{id}', [PostHasAttrController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']); // Silme
    Route::get('/{postId}/attrs', [PostHasAttrController::class, 'getAttrsByPost'])->name('getAttrsByPost');
});
