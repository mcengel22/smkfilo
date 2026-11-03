<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Blog\Http\Controllers\BlogController;

Route::prefix('v1/blog')->group(function () {

    // Listeleme + oluşturma
    Route::get('/', [BlogController::class, 'index']);
    Route::post('/', [BlogController::class, 'store']);

    // Sabit endpointler slug’dan önce olmalı
    Route::get('/byType/{type}', [BlogController::class, 'blogByType']);

    // ID ile update/delete (PUT - DELETE)
    Route::put('/{id}', [BlogController::class, 'update']);
    Route::delete('/{id}', [BlogController::class, 'destroy']);

    // Slug → en sona
    Route::get('/{slug}', [BlogController::class, 'show']);
});
