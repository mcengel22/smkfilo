<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpaController;
use App\Http\Controllers\SitemapController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/sitemaps/static', [SitemapController::class, 'static']);
Route::get('/sitemaps/blogs', [SitemapController::class, 'blogs']);
Route::get('/sitemaps/ilanlar', [SitemapController::class, 'ilanlar']);
Route::get('/sitemaps/iletisim', [SitemapController::class, 'iletisim']);

// 📌 SPA fallback route — tüm diğer yollar React'e gidecek
Route::get('/{path?}', [SpaController::class, 'index'])
    ->where('path', '^(?!api|storage|_debugbar|admin|login|register|sitemap\.xml)(.*)$')
    ->name('spa');
