<?php

namespace App\Http\Controllers;

use App\Modules\Blog\Models\Blog;
use App\Modules\Post\Models\Post;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemaps = [
            ['loc' => url('/sitemaps/static'), 'lastmod' => Carbon::now()->toAtomString()],
            ['loc' => url('/sitemaps/blogs'), 'lastmod' => Blog::latest('updated_at')->value('updated_at') ?? Carbon::now()->toAtomString()],
            ['loc' => url('/sitemaps/ilanlar'), 'lastmod' => Post::latest('updated_at')->value('updated_at') ?? Carbon::now()->toAtomString()],
            ['loc' => url('/sitemaps/iletisim'), 'lastmod' => Carbon::now()->toAtomString()], // ✅ iletişim sitemap
        ];

        return Response::view('sitemaps.index', compact('sitemaps'))
            ->header('Content-Type', 'application/xml');
    }

    public function static()
    {
        $urls = [
            ['loc' => url('/'), 'lastmod' => Carbon::now()->toAtomString()],
            ['loc' => url('/Ilanlar'), 'lastmod' => Carbon::now()->toAtomString()],
            ['loc' => url('/blog'), 'lastmod' => Carbon::now()->toAtomString()],
        ];

        return Response::view('sitemaps.urls', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }

    public function blogs()
    {
        $urls = Blog::all()->map(fn($b) => [
            'loc' => url("/blog/{$b->slug}"),
            'lastmod' => $b->updated_at?->toAtomString() ?? Carbon::now()->toAtomString(),
        ]);

        return Response::view('sitemaps.urls', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }

    public function ilanlar()
    {
        $urls = Post::all()->map(fn($p) => [
            'loc' => url("/Detay/{$p->slug}"),
            'lastmod' => $p->updated_at?->toAtomString() ?? Carbon::now()->toAtomString(),
        ]);

        return Response::view('sitemaps.urls', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }

    public function iletisim()
    {
        // 🔥 sadece tek bir sayfa: /İletisim
        $urls = [
            ['loc' => url('/İletisim'), 'lastmod' => Carbon::now()->toAtomString()],
        ];

        return Response::view('sitemaps.urls', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }
}
