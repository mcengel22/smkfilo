<?php

namespace App\Http\Controllers;

use App\Modules\Blog\Models\Blog;
use App\Modules\Post\Models\Post;
use Illuminate\Support\Facades\Response;
use App\Services\SeoResolver;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function index()
    {
        $now = Carbon::now()->toAtomString();

        $sitemaps = [
            ['loc' => $this->link('/sitemaps/static'), 'lastmod' => $now],
            ['loc' => $this->link('/sitemaps/blogs'), 'lastmod' => $this->lastmod(Blog::max('updated_at'))],
            ['loc' => $this->link('/sitemaps/ilanlar'), 'lastmod' => $this->lastmod(Post::where('status', 1)->max('updated_at'))],
            ['loc' => $this->link('/sitemaps/iletisim'), 'lastmod' => $now],
        ];

        return Response::view('sitemaps.index', compact('sitemaps'))
            ->header('Content-Type', 'application/xml');
    }

    public function static()
    {
        $now = Carbon::now()->toAtomString();

        // React tarafındaki gerçek route'lar (resources/js/Libs/Routes/config.jsx)
        $urls = collect([
            '/', '/Ilanlar', '/Blog/Listing', '/Campaign/Listing', '/Hakkimizda', '/Kurumsal',
            '/Sozlesmeler/KiralikSozlesmesi', '/Sozlesmeler/IptalSartlari',
            '/Sozlesmeler/GizlilikSozlesmesi', '/Sozlesmeler/KisiselVerilerinKorunmasi',
            '/Sozlesmeler/KullanimSartlari',
        ])->map(fn($path) => ['loc' => $this->link($path), 'lastmod' => $now]);

        return Response::view('sitemaps.urls', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }

    public function blogs()
    {
        $urls = Blog::select('slug', 'updated_at')->get()->map(fn($b) => [
            'loc' => $this->link('/Blog/Detay/' . rawurlencode($b->slug)),
            'lastmod' => $this->lastmod($b->updated_at),
        ]);

        return Response::view('sitemaps.urls', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }

    public function ilanlar()
    {
        // Sadece yayındaki ilanlar
        $urls = Post::where('status', 1)->select('slug', 'updated_at')->get()->map(fn($p) => [
            'loc' => $this->link('/Detay/' . rawurlencode($p->slug)),
            'lastmod' => $this->lastmod($p->updated_at),
        ]);

        return Response::view('sitemaps.urls', ['urls' => $urls])
            ->header('Content-Type', 'application/xml');
    }

    public function iletisim()
    {
        // Route "/İletisim" (Türkçe İ) — sitemap'te URL-encode edilmiş olmalı
        $urls = [
            ['loc' => $this->link('/' . rawurlencode('İletisim')), 'lastmod' => Carbon::now()->toAtomString()],
        ];

        return Response::view('sitemaps.urls', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }

    // Sitemap linkleri her zaman www'suz tek adresle
    private function link(string $path): string
    {
        return SeoResolver::baseUrl() . ($path === '/' ? '/' : $path);
    }

    private function lastmod($date): string
    {
        return $date ? Carbon::parse($date)->toAtomString() : Carbon::now()->toAtomString();
    }
}
