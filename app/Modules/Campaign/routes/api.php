<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Campaign\Http\Controllers\CampaignController;

Route::group([
    'prefix' => 'api/v1/campaign',
    'as' => 'v1.campaign',
], static function () {
    Route::get('/', [CampaignController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [CampaignController::class, 'store'])->name('store')->middleware('auth:sanctum');
    Route::get('/{id}', [CampaignController::class, 'show'])->name('show'); // Tekil veri getir
    Route::post('/{slug}', [CampaignController::class, 'update'])->name('update')->middleware('auth:sanctum'); // Güncelleme
    Route::delete('/{id}', [CampaignController::class, 'destroy'])->name('destroy')->middleware('auth:sanctum'); // Silme
});
