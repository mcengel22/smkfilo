<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SeoResolver;
use App\Services\SeoContentBuilder;

class SpaController extends Controller
{
    public function index(Request $request, SeoResolver $resolver, SeoContentBuilder $contentBuilder)
    {
        // URL path (örn: "", "Ilanlar", "Kampanyalar")
        $path = $request->path() === '/' ? '' : $request->path();
        $currentUrl = $request->fullUrl();

        // 🔹 path'e göre type belirle (tamamen dinamik)
        $type = null;
        if (str_contains(Str($path)->lower(), 'ilan')) {
            $type = 'villa';
        } elseif (str_contains(Str($path)->lower(), 'kampanya')) {
            $type = 'campaign';
        } elseif (str_contains(Str($path)->lower(), 'sss')) {
            $type = 'faq';
        } elseif (str_contains(Str($path)->lower(), 'iletisim')) {
            $type = 'contact';
        } elseif (str_contains(Str($path)->lower(), 'hakkimizda')) {
            $type = 'about';
        }

        // 🔹 SEO'yu çöz
        $initialSeo = $resolver->resolveType($type, $currentUrl);

        // 🔹 Ham HTML'de görünecek sayfa içeriği (arama motorları için)
        $seoContent = $contentBuilder->build(trim(rawurldecode($path), '/'), $initialSeo);

        return view('app', ['initialSeo' => $initialSeo, 'seoContent' => $seoContent]);
    }
}
