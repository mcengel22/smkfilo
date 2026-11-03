<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Post\Http\Controllers\PostController;

Route::group([
    'prefix' => 'api/v1/post',
    'as' => 'v1.post',
], static function () {
    Route::post('/filter', [PostController::class, 'filter'])->name('filter'); // Filtreleme
    Route::group(['middleware' => ['auth:sanctum']], static function () {
        Route::post('/', [PostController::class, 'store'])->name('store'); // Ekleme
        Route::post('{slug}', [PostController::class, 'update'])->name('update'); // Güncelleme
        Route::delete('/{id}', [PostController::class, 'destroy'])->name('destroy'); // Silme
        Route::prefix('super')->group( static function () {
            Route::get('/', [PostController::class, 'super_index'])->name('super.index'); // Listeleme
            Route::post('/filter', [PostController::class, 'super_filter'])->name('super.filter'); // Listeleme
        });
    });
    Route::get('/', [PostController::class, 'index'])->name('index'); // Listeleme
    Route::get('/{slug}', [PostController::class, 'show'])->name('show'); // Detay
    Route::get('/type/{type}', [PostController::class, 'getByType'])->name('getByType'); // Type'a göre filtreleme
    Route::put('/{id}/toggle-status', [PostController::class, 'toggleStatus']);
});
