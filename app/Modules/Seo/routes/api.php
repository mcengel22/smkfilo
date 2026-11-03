<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Seo\Http\Controllers\SeoController;

Route::group([
    'prefix' => 'api/v1/seo',
    'as' => 'v1.seo.',
], static function () {

    Route::get('/', [SeoController::class, 'index'])->name('index');
    Route::post('/', [SeoController::class, 'store'])->name('store');

    // 🔥 önce özel endpointi tanımla
    Route::get('/byTypeRegion', [SeoController::class, 'seoByTypeAndRegion'])->name('byTypeRegion');

    // 🔽 sonra ID’ye göre çalışan endpoint’ler gelsin
    Route::get('/{id}', [SeoController::class, 'show'])->name('show');
    Route::put('/{id}', [SeoController::class, 'update'])->name('update');
    Route::delete('/{id}', [SeoController::class, 'destroy'])->name('destroy');
});
