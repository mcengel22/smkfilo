<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Favorite\Http\Controllers\FavoriteController;

Route::group([
    'prefix' => 'api/v1/favorite',
    'as' => 'v1.favorite',
    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/only-ids', [FavoriteController::class, 'getFavorites'])->name('getOnlyIds'); // Tekil favori bilgisi getir
    Route::get('/', [FavoriteController::class, 'index'])->name('index'); // Kullanıcının favori ilanlarını listele
    Route::post('/', [FavoriteController::class, 'store'])->name('store'); // Favori ekle veya kaldır
    Route::get('/{id}', [FavoriteController::class, 'show'])->name('show'); // Tekil favori bilgisi getir
    Route::delete('/{id}', [FavoriteController::class, 'destroy'])->name('destroy'); // Favori sil
});
