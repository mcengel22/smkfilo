<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- 🔹 Dinamik Title --}}
    <title>{{ $initialSeo['meta_title'] ?? 'Araç Kiralama - Hemen Aracını Kirala' }}</title>

    {{-- 🔹 Description --}}
    <meta name="description"
        content="{{ $initialSeo['meta_description'] ?? 'Araç Kiralama ile hayalinizdeki aracı kiralayın.' }}">

    {{-- 🔹 Keywords --}}
    <meta name="keywords" content="{{ $initialSeo['keywords'] ?? 'arac kiralama' }}">

    {{-- 🔹 Canonical URL --}}
    <link rel="canonical" href="{{ $initialSeo['canonical_url'] ?? url()->current() }}">

    {{-- 🔹 Open Graph Meta --}}
    <meta property="og:title" content="{{ $initialSeo['meta_title'] ?? 'Araç Kiralama' }}">
    <meta property="og:description" content="{{ $initialSeo['meta_description'] ?? 'Araç Kiralama' }}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $initialSeo['canonical_url'] ?? url()->current() }}">
    <meta property="og:image" content="{{ $initialSeo['media']['url'] ?? asset('img/smkfavicon.png') }}">

    {{-- 🔹 Twitter Card (extra bonus) --}}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $initialSeo['meta_title'] ?? 'Araç Kiralama' }}">
    <meta name="twitter:description" content="{{ $initialSeo['meta_description'] ?? 'Araç Kiralama' }}">
    <meta name="twitter:image" content="{{ $initialSeo['media']['url'] ?? asset('img/smkfavicon.png') }}">

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
    <div id="tourency"></div>

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
