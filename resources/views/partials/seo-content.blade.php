{{-- Sunucuda basılan sayfa içeriği: arama motorları ham HTML'de içeriği görsün.
     React yüklenince bu blok kendiliğinden kaldırılır; JS çalışmazsa 2 sn sonra görünür olur. --}}
<div class="seo-ssr">
    <header class="seo-ssr__head">
        <a href="/"><img src="/img/logo/smklogo.webp" alt="SMK Filo" width="140" height="48"></a>
        <nav aria-label="Ana menü">
            <a href="/">Ana Sayfa</a>
            <a href="/Ilanlar">Kiralık Araçlar</a>
            <a href="/Kurumsal">Kurumsal</a>
            <a href="/Campaign/Listing">Kampanyalar</a>
            <a href="/Blog/Listing">Blog</a>
            <a href="/Hakkimizda">Hakkımızda</a>
            <a href="/{{ rawurlencode('İletisim') }}">İletişim</a>
        </nav>
    </header>

    <main>
        <h1>{{ $content['h1'] }}</h1>
        @if (!empty($content['intro']))
            <p>{{ $content['intro'] }}</p>
        @endif

        @if (!empty($content['post']))
            @php($post = $content['post'])
            @if ($post['image'])
                <img src="{{ $post['image'] }}" alt="{{ $post['title'] }}" loading="lazy" width="640" height="400">
            @endif
            <ul>
                @if ($post['price'])<li>Başlangıç fiyatı: {{ $post['price'] }}</li>@endif
                @if ($post['region'])<li>Bölge: {{ $post['region'] }}</li>@endif
            </ul>
            @if ($post['description'])
                <section>{!! $post['description'] !!}</section>
            @endif
        @endif

        @if (!empty($content['article']))
            <article>{!! $content['article'] !!}</article>
        @endif

        @if (!empty($content['posts']))
            <section>
                <h2>Kiralık Araçlarımız</h2>
                <ul>
                    @foreach ($content['posts'] as $p)
                        <li>
                            <a href="{{ $p['url'] }}">{{ $p['title'] }}</a>
                            @if ($p['region']) – {{ $p['region'] }}@endif
                            @if ($p['price']) – Başlangıç fiyatı: {{ $p['price'] }}@endif
                        </li>
                    @endforeach
                </ul>
            </section>
        @endif

        @if (!empty($content['faqs']))
            <section>
                <h2>Sıkça Sorulan Sorular</h2>
                @foreach ($content['faqs'] as $faq)
                    <h3>{{ $faq['q'] }}</h3>
                    <p>{{ $faq['a'] }}</p>
                @endforeach
            </section>
        @endif

        @if (!empty($content['blogs']))
            <section>
                <h2>Blog Yazıları</h2>
                <ul>
                    @foreach ($content['blogs'] as $b)
                        <li><a href="{{ $b['url'] }}">{{ $b['title'] }}</a></li>
                    @endforeach
                </ul>
            </section>
        @endif
    </main>

    <footer>
        <p>SMK Filo – Araç Kiralama ve Filo Kiralama · Telefon: <a href="tel:+905305421233">0530 542 12 33</a></p>
        <nav aria-label="Yasal">
            <a href="/Sozlesmeler/KiralikSozlesmesi">Kiralama Sözleşmesi</a>
            <a href="/Sozlesmeler/IptalSartlari">İptal Şartları</a>
            <a href="/Sozlesmeler/GizlilikSozlesmesi">Gizlilik</a>
            <a href="/Sozlesmeler/KisiselVerilerinKorunmasi">KVKK</a>
        </nav>
    </footer>
</div>
