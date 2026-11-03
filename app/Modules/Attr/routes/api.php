<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Attr\Http\Controllers\AttrController;

Route::group([
    'prefix' => 'api/v1/attr',
    'as' => 'attr',
], static function () {
    Route::group(['middleware' => ['auth:sanctum']], static function () {
        Route::post('/', [AttrController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']); // Ekleme
        Route::get('/{slug}', [AttrController::class, 'show'])->name('show'); // Tekil veri getir
        Route::post('/{slug}', [AttrController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']); // Güncelleme
        Route::delete('/{id}', [AttrController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']); // Silme
    });
    Route::get('/', [AttrController::class, 'index'])->name('index'); // Listeleme
     Route::get('/type/{attrType}', [AttrController::class, 'getByType'])->name('getByType'); //attr_type a göre listeleme(features,rules..)
    Route::get('/post/{postType}', [AttrController::class, 'getByPostType'])->name('getByPostType'); //post_type a göre listeleme(villa,bungalov..)
    Route::get('/post/{postType}/{attrType}', [AttrController::class, 'getByPostTypeAndAttrType'])->name('getByPostTypeAndAttrType'); //post_type ve attr_type a göre listeleme(villa ve features aynı anda gibi)
});
