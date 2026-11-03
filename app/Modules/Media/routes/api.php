<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Media\Http\Controllers\MediaController;

Route::group([
    'prefix'     => 'api/v1/media',
    'as'         => 'v1.media.',
    'middleware' => ['auth:sanctum'],
], function () {
    // 1) Kullanıcının tüm medyalarını getir
    Route::get('/',     [MediaController::class, 'index'])->name('index');

    // 2) Yeni medya yükle
    Route::post('/',    [MediaController::class, 'store'])->name('store');

    // 3) Tek bir medyayı sil
    Route::delete('/{media}', [MediaController::class, 'destroy'])->name('destroy');
});
