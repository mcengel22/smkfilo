<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Policies\Http\Controllers\PoliciesController;

Route::group([
    'prefix' => 'api/policies',
    'as' => 'policies.',
    // 'middleware' => ['auth:sanctum'],
], function () {
    Route::get('/', [PoliciesController::class, 'index'])->name('index');
    Route::post('/', [PoliciesController::class, 'store'])->name('store')->middleware(['auth:sanctum', 'role:super_admin']);
    Route::get('/{idOrType}', [PoliciesController::class, 'show'])->name('show'); // hem id hem type
    Route::put('/{id}', [PoliciesController::class, 'update'])->name('update')->middleware(['auth:sanctum', 'role:super_admin']);
    Route::delete('/{id}', [PoliciesController::class, 'destroy'])->name('destroy')->middleware(['auth:sanctum', 'role:super_admin']);
});
