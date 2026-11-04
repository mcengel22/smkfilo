<?php

namespace App\Services;

use App\Modules\Blog\Models\Blog;
use App\Modules\Faq\Models\Faq;
use App\Modules\Post\Models\Post;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * React (SPA) sayfaları tarayıcıda oluştuğu için ham HTML boş geliyordu.
 * Bu sınıf her sayfanın gerçek içeriğini sunucuda hazırlar; app.blade.php bunu
 * #tourency içine basar, React yüklenince aynı içeriği kendisi çizer (createRoot içeriği değiştirir).
 */
class SeoContentBuilder
{
    public function build(string $path, array $seo): array
    {
        $parts = $path === '' ? [] : explode('/', $path);
        $lower = Str::lower(Str::ascii($path));

        $content = [
            'h1'    => $this->stripBrand($seo['meta_title'] ?? ''),
            'intro' => $seo['meta_description'] ?? '',
        ];

        if (($seo['robots'] ?? '') !== 'index, follow') {
            return $content;
        }

        if ($lower === '') {
            return array_merge($content, [
                'h1'    => 'SMK Filo ile Araç Kiralama',
                'posts' => $this->posts(),
                'faqs'  => $this->faqs(),
                'blogs' => $this->blogs(6),
            ]);
        }

        if ($lower === 'ilanlar') {
            return array_merge($content, ['posts' => $this->posts(48)]);
        }

        if (count($parts) === 2 && Str::lower($parts[0]) === 'detay') {
            $post = $this->post($parts[1]);

            // Açıklama zaten gövdede basılıyor, girişte tekrar etmesin
            return array_merge($content, ['post' => $post, 'intro' => ($post['description'] ?? null) ? null : $content['intro']]);
        }

        if ($lower === 'blog/listing') {
            return array_merge($content, ['blogs' => $this->blogs(30)]);
        }

        if (count($parts) === 3 && Str::startsWith($lower, 'blog/detay/')) {
            $blog = Blog::where('slug', $parts[2])->first();

            return array_merge($content, [
                'h1'      => $blog?->title ?? $content['h1'],
                'article' => $blog ? $this->cleanHtml($blog->content) : null,
            ]);
        }

        return $content;
    }

    protected function posts(int $limit = 24): array
    {
        return Cache::remember("seo_ssr_posts_{$limit}", 600, fn() => Post::query()
            ->where('status', 1)
            ->with(['region'])
            ->withMin('prices', 'price')
            ->latest('updated_at')
            ->limit($limit)
            ->get()
            ->map(fn(Post $p) => [
                'title'  => $p->title,
                'url'    => '/Detay/' . rawurlencode($p->slug),
                'price'  => $this->price($p->prices_min_price),
                'region' => $p->region?->name,
            ])
            ->all());
    }

    protected function post(string $slug): ?array
    {
        $post = Post::where('slug', $slug)->where('status', 1)
            ->with(['region', 'media'])
            ->withMin('prices', 'price')
            ->first();

        if (! $post) {
            return null;
        }

        return [
            'title'       => $post->title,
            'description' => $this->cleanHtml($post->description),
            'price'       => $this->price($post->prices_min_price),
            'region'      => $post->region?->name,
            'image'       => $post->media?->url,
        ];
    }

    protected function faqs(): array
    {
        return Cache::remember('seo_ssr_faqs', 600, fn() => Faq::latest()->limit(10)->get(['question', 'answer'])
            ->map(fn($f) => ['q' => $f->question, 'a' => strip_tags($f->answer)])
            ->all());
    }

    protected function blogs(int $limit): array
    {
        return Cache::remember("seo_ssr_blogs_{$limit}", 600, fn() => Blog::latest()->limit($limit)->get(['title', 'slug'])
            ->map(fn($b) => ['title' => $b->title, 'url' => '/Blog/Detay/' . rawurlencode($b->slug)])
            ->all());
    }

    protected function price($value): ?string
    {
        return $value ? number_format((float) $value, 0, ',', '.') . ' ₺' : null;
    }

    /**
     * Panelden gelen HTML'de sadece okunabilir/güvenli etiketler kalsın
     */
    protected function cleanHtml(?string $html): ?string
    {
        if (! $html) {
            return null;
        }

        $clean = strip_tags($html, '<p><br><h2><h3><h4><ul><ol><li><strong><b><em><i>');

        // Kalan etiketlerdeki tüm attribute'ları (style, onclick vb.) temizle
        return preg_replace('/<(\w+)\s[^>]*>/', '<$1>', $clean);
    }

    protected function stripBrand(string $title): string
    {
        return trim(preg_replace('/\s*\|\s*SMK Filo$/u', '', $title));
    }
}
