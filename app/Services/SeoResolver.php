<?php

namespace App\Services;

use App\Modules\Seo\Services\SeoService;
use App\Modules\Blog\Models\Blog;
use App\Modules\Post\Models\Post;
use Illuminate\Support\Str;

class SeoResolver
{
    public const SITE_NAME = 'SMK Filo';

    protected const DEFAULT_TITLE = 'SMK Filo | Araç Kiralama ve Filo Kiralama';
    protected const DEFAULT_DESCRIPTION = 'SMK Filo ile günlük, aylık ve uzun dönem araç kiralama. Geniş araç filosu, uygun fiyatlar ve hızlı rezervasyon ile ihtiyacınıza uygun aracı hemen kiralayın.';
    protected const DEFAULT_KEYWORDS = 'smk filo, smkfilo, araç kiralama, filo kiralama, uzun dönem araç kiralama, kiralık araç';

    /**
     * Sabit sayfalar: path (küçük harf) => [başlık, açıklama]
     */
    protected const STATIC_PAGES = [
        'ilanlar' => ['Kiralık Araçlar', 'SMK Filo kiralık araç listesi. Marka, model ve fiyatlara göre filtreleyin, size uygun aracı hemen kiralayın.'],
        'blog/listing' => ['Blog', 'SMK Filo blog: araç kiralama rehberleri, ipuçları ve güncel haberler.'],
        'campaign/listing' => ['Kampanyalar', 'SMK Filo araç kiralama kampanyaları ve indirimli fırsatlar.'],
        'hakkimizda' => ['Hakkımızda', 'SMK Filo hakkında: araç kiralama ve filo kiralama hizmetlerimiz, vizyonumuz ve değerlerimiz.'],
        'kurumsal' => ['Kurumsal Filo Kiralama', 'SMK Filo kurumsal filo kiralama çözümleri: şirketinize özel uzun dönem araç kiralama.'],
        'iletisim' => ['İletişim', 'SMK Filo iletişim bilgileri. Araç kiralama talepleriniz için bize telefon, e-posta veya form ile ulaşın.'],
        'campaign/detay' => ['Kampanya Detayı', 'SMK Filo araç kiralama kampanya detayları ve kampanya koşulları.'],
        'sozlesmeler/kiraliksozlesmesi' => ['Kiralama Sözleşmesi', 'SMK Filo araç kiralama sözleşmesi ve kiralama koşulları.'],
        'sozlesmeler/iptalsartlari' => ['İptal Şartları', 'SMK Filo araç kiralama rezervasyon iptal ve iade şartları.'],
        'sozlesmeler/gizliliksozlesmesi' => ['Gizlilik Sözleşmesi', 'SMK Filo gizlilik sözleşmesi ve kişisel bilgilerin kullanımı.'],
        'sozlesmeler/kisiselverilerinkorunmasi' => ['KVKK Aydınlatma Metni', 'SMK Filo kişisel verilerin korunması (KVKK) aydınlatma metni.'],
        'sozlesmeler/onaymetni' => ['Onay Metni', 'SMK Filo açık rıza ve onay metni.'],
        'sozlesmeler/kullanimsartlari' => ['Kullanım Şartları', 'SMK Filo web sitesi kullanım şartları.'],
        'sozlesmeler' => ['Sözleşmeler', 'SMK Filo kiralama sözleşmeleri ve yasal metinler.'],
    ];

    /**
     * Arama motorlarında görünmemesi gereken (giriş gerektiren / işlem) sayfaları
     */
    protected const NOINDEX_PREFIXES = [
        'panel', 'kullanici', 'kullanicipanel', 'ilanolustur', 'ilanduzenle',
        'rezervasyon', 'rezervasyonsorgulama',
    ];

    protected SeoService $seoService;

    public function __construct(SeoService $seoService)
    {
        $this->seoService = $seoService;
    }

    public function resolveType(?string $type, string $url): array
    {
        $path = trim(rawurldecode(parse_url($url, PHP_URL_PATH) ?? ''), '/');
        $parts = $path === '' ? [] : explode('/', $path);
        $lowerPath = Str::lower(Str::ascii($path));

        // Canonical her zaman tek adres (www'suz, query string'siz) olsun
        $canonical = $this->canonical($parts);

        $seo = $this->resolve($type, $parts, $lowerPath, $canonical);

        $seo['meta_title'] = $this->withBrand($seo['meta_title'] ?? self::DEFAULT_TITLE);
        $seo['meta_description'] = ($seo['meta_description'] ?? null) ?: self::DEFAULT_DESCRIPTION;
        $seo['keywords'] = ($seo['keywords'] ?? null) ?: self::DEFAULT_KEYWORDS;
        $seo['canonical_url'] = ($seo['canonical_url'] ?? null) ?: $canonical;
        $seo['media'] = ($seo['media'] ?? null) ?: asset('img/logo/smklogo.webp');

        if (Str::startsWith($lowerPath, self::NOINDEX_PREFIXES)) {
            $seo['robots'] = 'noindex, follow';
        }
        $seo['robots'] ??= 'index, follow';

        return $seo;
    }

    protected function resolve(?string $type, array $parts, string $lowerPath, string $canonical): array
    {
        /**
         * 🏡 POST DETAY: /Detay/{slug}
         */
        if (count($parts) === 2 && Str::lower($parts[0]) === 'detay') {
            $post = Post::with(['region', 'media'])->where('slug', $parts[1])->where('status', 1)->first();

            if (! $post) {
                return ['meta_title' => 'Araç bulunamadı', 'robots' => 'noindex, follow'];
            }

            $desc = Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($post->description ?? ''))), 155);

            return [
                'meta_title'       => ($post->title ?? 'Araç İlanı') . ' Kiralama',
                'meta_description' => $desc ?: "{$post->title} kiralama fiyatları ve detayları. SMK Filo ile hemen kiralayın.",
                'media'            => $post->media?->url,
                'og_type'          => 'product',
            ];
        }

        /**
         * 📰 BLOG DETAY: /Blog/Detay/{slug}
         */
        if (count($parts) === 3 && Str::lower($parts[0]) === 'blog' && Str::lower($parts[1]) === 'detay') {
            $blog = Blog::where('slug', $parts[2])->first();

            if (! $blog) {
                return ['meta_title' => 'Yazı bulunamadı', 'robots' => 'noindex, follow'];
            }

            $keywords = is_array($blog->keywords)
                ? implode(', ', array_filter($blog->keywords))
                : $blog->keywords;

            return [
                'meta_title'       => $blog->title ?? 'Blog',
                'meta_description' => Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($blog->content ?? ''))), 155),
                'keywords'         => $keywords,
                'media'            => $blog->image,
                'og_type'          => 'article',
            ];
        }

        /**
         * 📦 TYPE bazlı SEO (panelden girilen kayıtlar öncelikli)
         */
        $seo = $type ? $this->seoService->findByType($type) : null;

        if ($seo) {
            return [
                'meta_title'       => $seo->meta_title,
                'meta_description' => $seo->meta_description,
                'keywords'         => $seo->keywords,
                'canonical_url'    => $seo->canonical_url,
                'media'            => $seo->image ? url($seo->image) : null,
            ];
        }

        /**
         * 📄 Sabit sayfalar
         */
        foreach (self::STATIC_PAGES as $prefix => [$title, $desc]) {
            if ($lowerPath === $prefix || Str::startsWith($lowerPath, $prefix . '/')) {
                return ['meta_title' => $title, 'meta_description' => $desc];
            }
        }

        /**
         * 🌍 Ana sayfa / genel
         */
        return ['meta_title' => self::DEFAULT_TITLE];
    }

    /**
     * Sitenin tek (www'suz) kök adresi. APP_URL sunucuda yanlış olabileceği için istekten alınır.
     */
    public static function baseUrl(): string
    {
        return rtrim(preg_replace('#^(https?://)www\.#i', '$1', url('/')), '/');
    }

    protected function canonical(array $parts): string
    {
        $base = self::baseUrl();
        $encoded = implode('/', array_map('rawurlencode', $parts));

        return $encoded === '' ? $base . '/' : "{$base}/{$encoded}";
    }

    protected function withBrand(string $title): string
    {
        return Str::contains(Str::lower($title), 'smk filo')
            ? $title
            : "{$title} | " . self::SITE_NAME;
    }
}
