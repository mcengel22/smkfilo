<?php

namespace App\Http\Controllers;

use App\Http\Resources\IconResource;
use App\Models\Icon;
use App\Models\Region;
use App\Modules\Post\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

final class Select2Controller
{
    public function searchRegions(Request $request): JsonResponse
    {
        $term = $request->input('term');

        // Null kontrolü ekledim
        $term = $term ? $this->normalizeTurkishChars($term) : '';

        if (empty($term)) {
            return response()->json([]);
        }

        $results = Region::where(static function ($query) use ($term) {
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$term}%"])
                ->orWhere('slug', Str::slug($term));
        })
            ->select('id', 'name', 'city')
            ->orderByRaw("name LIKE ? DESC", ["{$term}%"])
            ->orderBy('name')
            ->limit(10)
            ->get()
            ->map(function ($region) {
                return [
                    'id' => $region->id,
                    'text' => $region->fullNameWithCity(),
                ];
            });

        return response()->json($results);
    }

    public function searchIcons(): JsonResponse
    {
        return response()->json(IconResource::collection(Icon::all()));
    }

public function searchPosts(Request $request): JsonResponse
{
    $term = $request->input('term', '');

    if (strlen($term) < 2) {
        return response()->json(['results' => []]);
    }

    // Normalize edilen arama anahtarı
    $normalizedTerm = $this->normalize($term);

    $posts = Post::select('id', 'title', 'slug')
        ->where('status', 1) // SADECE AKTİF OLANLARI (status = 1) GETİR
        ->get()
        ->filter(function ($post) use ($normalizedTerm) {
            // Post başlığını normalize et
            $normalizedTitle = $this->normalize($post->title);
            $normalizedSlug  = $this->normalize($post->slug);

            // İçeriyor mu kontrol et
            return str_contains($normalizedTitle, $normalizedTerm)
                || str_contains($normalizedSlug, $normalizedTerm);
        })
        ->take(15)
        ->map(function ($post) {
            return [
                'id'   => $post->id,
                'text' => $post->title,
                'slug' => $post->slug,
            ];
        })
        ->values();

    return response()->json(['results' => $posts]);
}




    private function normalize(string $str): string
    {
        // Türkçe karakter dönüştürme
        $map = [
            'Ç' => 'c', 'ç' => 'c',
            'Ğ' => 'g', 'ğ' => 'g',
            'İ' => 'i', 'I' => 'i', 'ı' => 'i', 'i' => 'i',
            'Ö' => 'o', 'ö' => 'o',
            'Ş' => 's', 'ş' => 's',
            'Ü' => 'u', 'ü' => 'u'
        ];

        // Harfleri değiştir + küçük harfe çevir
        return mb_strtolower(strtr($str, $map), 'UTF-8');
    }

    private function normalizeTurkishChars(string $string): string
    {
        $replace = [
            'ç' => 'c', 'Ç' => 'c',
            'ğ' => 'g', 'Ğ' => 'g',
            'ı' => 'i', 'I' => 'i',
            'i' => 'i', 'İ' => 'i',
            'ö' => 'o', 'Ö' => 'o',
            'ş' => 's', 'Ş' => 's',
            'ü' => 'u', 'Ü' => 'u'
        ];

        $string = strtr($string, $replace);
        return mb_strtolower($string, 'UTF-8');
    }
}
