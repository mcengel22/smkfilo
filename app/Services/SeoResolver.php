<?php

namespace App\Services;

use App\Modules\Seo\Services\SeoService;
use App\Modules\Blog\Models\Blog;
use App\Modules\Post\Models\Post;
use Illuminate\Support\Str;

class SeoResolver
{
    protected SeoService $seoService;

    public function __construct(SeoService $seoService)
    {
        $this->seoService = $seoService;
    }

    public function resolveType(?string $type, string $url): array
    {
        $base = rtrim(config('app.url'), '/');
        $canonical = $url ?: $base;

        // 🔹 Path'i parçala
        $path = trim(parse_url($url, PHP_URL_PATH), '/');
        $parts = explode('/', $path);

        /**
         * 🏡 POST DETAY: /Detay/{slug}
         */
        if (count($parts) === 2 && Str::lower($parts[0]) === 'detay') {
            $slug = $parts[1];

            $post = Post::with(['region', 'media'])->where('slug', $slug)->first();

            if ($post) {
                $title = $post->title ?? 'Araç İlanı';
                $desc = Str::limit(strip_tags($post->description ?? ''), 160);
                $regionName = $post->region->name ?? '';
                $cover = $post->media ? $post->media->url : asset('img/logo/smkfavicon.webp');

                return [
                    'meta_title'       => "{$title}",
                    'media'            => $cover,
                ];
            }
        }

        /**
         * 📰 BLOG DETAY: /Blog/Detay/{slug}
         */
        if (
            count($parts) === 3 &&
            Str::lower($parts[0]) === 'blog' &&
            Str::lower($parts[1]) === 'detay'
        ) {
            $slug = $parts[2];

            $blog = Blog::where('slug', $slug)->first();

            if ($blog) {
                $desc = Str::limit(strip_tags($blog->content ?? ''), 160);
                $cover = $blog->image ?: asset('img/smkfavicon.webp');

                $keywords = is_array($blog->keywords)
                    ? implode(', ', array_filter($blog->keywords))
                    : ($blog->keywords ?? 'rentacar');

                return [
                    'meta_title'       => ($blog->title ?? 'Blog'),
                    'meta_description' => $desc ?: 'Renta Car.',
                    'keywords'         => $keywords,
                    'canonical_url'    => $canonical,
                    'media'            => $cover,
                ];
            }
        }

        /**
         * 📦 TYPE bazlı SEO (örneğin kategori sayfası)
         */
        $seo = $type ? $this->seoService->findByType($type) : null;

        if ($seo) {
            return [
                'meta_title'       => $seo->meta_title ?? 'Renta Car',
                'meta_description' => $seo->meta_description ?? 'Renta Car.',
                'keywords'         => $seo->keywords ?? 'RentaCar',
                'canonical_url'    => $seo->canonical_url ?? $canonical,
                'media'            => $seo->image ? url($seo->image) : asset('img/smkfavicon.webp'),
            ];
        }

        /**
         * 🌍 Fallback (genel SEO)
         */
        return [
            'meta_title'       => 'Araç Kiralama - Hemen Aracını Kirala',
            'meta_description' => 'Araç Kiralama.',
            'keywords'         => 'arac kiralama',
            'canonical_url'    => $canonical,
            'media'            => asset('img/smkfavicon.webp'),
        ];
    }
}
