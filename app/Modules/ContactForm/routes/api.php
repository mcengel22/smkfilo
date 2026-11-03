<?php

use Illuminate\Support\Facades\Route;
use App\Modules\ContactForm\Http\Controllers\ContactFormController;

Route::group([
    'prefix' => 'api/v1/contactform',
    'as' => 'v1.contactform',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [ContactFormController::class, 'index'])->name('index')->middleware(['auth:sanctum', 'role:super_admin']); // Listeleme
    Route::post('/', [ContactFormController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [ContactFormController::class, 'show'])->name('show')->middleware(['auth:sanctum', 'role:super_admin']); // Tekil veri getir
    Route::put('/{id}', [ContactFormController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']); // Güncelleme
    Route::delete('/{id}', [ContactFormController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']); // Silme
});