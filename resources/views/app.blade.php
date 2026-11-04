<!DOCTYPE html>
<html lang="tr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @php
        $seo = $initialSeo ?? [];
        $seoTitle = $seo['meta_title'] ?? 'SMK Filo | Araç Kiralama ve Filo Kiralama';
        $seoDesc = $seo['meta_description'] ?? '';
        $seoCanonical = $seo['canonical_url'] ?? url()->current();
        $seoImage = is_array($seo['media'] ?? null) ? ($seo['media']['url'] ?? null) : ($seo['media'] ?? null);
        $seoImage = $seoImage ?: asset('img/logo/smklogo.webp');
        $siteUrl = \App\Services\SeoResolver::baseUrl();
    @endphp

    {{-- 🔹 Dinamik Title / Description --}}
    <title>{{ $seoTitle }}</title>
    <meta name="description" content="{{ $seoDesc }}">
    <meta name="keywords" content="{{ $seo['keywords'] ?? '' }}">
    <meta name="robots" content="{{ $seo['robots'] ?? 'index, follow' }}">
    <link rel="canonical" href="{{ $seoCanonical }}">

    {{-- 🔹 Open Graph --}}
    <meta property="og:site_name" content="SMK Filo">
    <meta property="og:locale" content="tr_TR">
    <meta property="og:title" content="{{ $seoTitle }}">
    <meta property="og:description" content="{{ $seoDesc }}">
    <meta property="og:type" content="{{ $seo['og_type'] ?? 'website' }}">
    <meta property="og:url" content="{{ $seoCanonical }}">
    <meta property="og:image" content="{{ $seoImage }}">

    {{-- 🔹 Twitter Card --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seoTitle }}">
    <meta name="twitter:description" content="{{ $seoDesc }}">
    <meta name="twitter:image" content="{{ $seoImage }}">

    {{-- 🔹 Yapılandırılmış veri: Google'ın site adını ve firmayı tanıması için --}}
    <script type="application/ld+json">
        {!! json_encode([
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'WebSite',
                    '@id' => $siteUrl . '/#website',
                    'url' => $siteUrl . '/',
                    'name' => 'SMK Filo',
                    'alternateName' => ['SMKFilo', 'SMK Filo Araç Kiralama'],
                    'inLanguage' => 'tr-TR',
                ],
                [
                    '@type' => 'AutoRental',
                    '@id' => $siteUrl . '/#organization',
                    'name' => 'SMK Filo',
                    'url' => $siteUrl . '/',
                    'logo' => asset('img/logo/smklogo.webp'),
                    'image' => asset('img/logo/smklogo.webp'),
                    'telephone' => '+905305421233',
                    'address' => ['@type' => 'PostalAddress', 'addressCountry' => 'TR'],
                ],
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
    </script>

    {{-- 🔹 Fonts (CSS içinden @import yerine burada: render'ı bloklamaz, paralel iner) --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&family=Montez&display=swap" rel="stylesheet">

    {{-- 🔹 Ana sayfa hero görseli erken yüklensin --}}
    @if (request()->is('/'))
        <link rel="preload" as="image" href="/img/banner/rentacar.webp" fetchpriority="high">
    @endif

    {{-- 🔹 Favicon --}}
    <link rel="icon" type="image/png" sizes="124x124" href="{{ asset('img/smkfavicon.png') }}">

    {{-- 🔹 Sunucuda basılan içerik: React açılınca yerini alır, JS yoksa 2 sn sonra görünür --}}
    <style>
        .seo-ssr{max-width:1100px;margin:0 auto;padding:24px 16px;font-family:Quicksand,system-ui,sans-serif;color:#1f2937;line-height:1.6;opacity:0;animation:seo-ssr-in .3s ease 2s forwards}
        .seo-ssr a{color:#0b2a5b}
        .seo-ssr nav{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0}
        .seo-ssr img{max-width:100%;height:auto}
        .seo-ssr h1{font-size:1.8rem;margin:16px 0 8px}
        .seo-ssr h2{font-size:1.3rem;margin:24px 0 8px}
        @keyframes seo-ssr-in{to{opacity:1}}
    </style>

    {{-- 🔹 React'e SEO datayı gönder --}}
    <script>
        window.__INITIAL_SEO__ = {!! json_encode($initialSeo ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!};
    </script>

    {{-- 🔹 Styles & Scripts --}}
    @if (app()->environment('production'))
        @php
            $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
        @endphp
        <script type="module" src="/build/{{ $manifest['resources/js/app.jsx']['file'] }}"></script>
        <link rel="stylesheet" href="/build/{{ $manifest['resources/globals.scss']['file'] }}">
    @else
        @viteReactRefresh
        @vite(['resources/globals.scss', 'resources/js/app.jsx'])
    @endif
</head>

<body>
    {{-- 🔹 React uygulaması mount noktası --}}
    <div id="tourency">
        @isset($seoContent)
            @include('partials.seo-content', ['content' => $seoContent])
        @endisset
    </div>

    {{-- 🔹 Production hata yakalama --}}
    @if (app()->environment('production'))
        <script>
            window.onerror = function(msg, url, line, col, error) {
                console.error("Frontend Hatası:", {
                    msg,
                    url,
                    line,
                    col,
                    error
                });
                return false;
            };
        </script>
    @endif
</body>

</html>
