<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Policies\Http\Controllers\PoliciesController;

Route::group([
    'prefix' => 'api/policies',
    'as' => 'policies.',
    // 'middleware' => ['auth:sanctum'],
], function () {
    Route::get('/', [PoliciesController::class, 'index'])->name('index');
    Route::post('/', [PoliciesController::class, 'store'])->name('store');
    Route::get('/{idOrType}', [PoliciesController::class, 'show'])->name('show'); // hem id hem type
    Route::put('/{id}', [PoliciesController::class, 'update'])->name('update');
    Route::delete('/{id}', [PoliciesController::class, 'destroy'])->name('destroy');
});
