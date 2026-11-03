<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Comment\Http\Controllers\CommentController;

Route::group([
    'prefix' => 'api/v1/comment',
    'as' => 'v1.comment',
    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/post/{postId?}', [CommentController::class, 'getCommentsByPost'])->name('getByPost'); // post_id'ye göre yorumlar
    Route::get('/user', [CommentController::class, 'getCommentsByUser'])->name('getByUser'); // Kullanıcıya göre yorumlar
    Route::get('/', [CommentController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [CommentController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [CommentController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [CommentController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [CommentController::class, 'destroy'])->name('destroy'); // Silme


    Route::put('/approve/{id}', [CommentController::class, 'approve'])->name('approve'); // Yorum onayla
    Route::put('/reject/{id}', [CommentController::class, 'reject'])->name('reject'); // Yorum reddet
});
