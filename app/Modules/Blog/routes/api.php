<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Blog\Http\Controllers\BlogController;

Route::prefix('v1/blog')->group(function () {

    // Listeleme + oluşturma
    Route::get('/', [BlogController::class, 'index']);
    Route::post('/', [BlogController::class, 'store'])->middleware(['auth:sanctum', 'role:super_admin']);

    // Sabit endpointler slug’dan önce olmalı
    Route::get('/byType/{type}', [BlogController::class, 'blogByType']);

    // ID ile update/delete (PUT - DELETE)
    Route::put('/{id}', [BlogController::class, 'update'])->middleware(['auth:sanctum', 'role:super_admin']);
    Route::delete('/{id}', [BlogController::class, 'destroy'])->middleware(['auth:sanctum', 'role:super_admin']);

    // Slug → en sona
    Route::get('/{slug}', [BlogController::class, 'show']);
});
