<?php

namespace App\Modules\Post\Http\Resources;

use App\Enums\PostCard;
use App\Enums\PostGetCard;
use App\Modules\PostHasAttr\Http\Resources\PostHasAttrResource;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Modules\Reservation\Models\Reservation;

class PostDetailResource extends JsonResource
{
    public function toArray($request)
    {
        // ✅ Ortalama puan ve yorum sayısı
        $ratings = $this->comments->pluck('rating');
        $averageRating = $ratings->count() ? $ratings->avg() : 0;
        $commentsCount = $this->comments->count();

        // ✅ Favori kontrolü
        $user = auth('sanctum')->user();
        $isFavorite = false;

        if ($user) {
            $isFavorite = \DB::table('favorites')
                ->where('user_id', $user->id)
                ->where('post_id', $this->id)
                ->whereNull('deleted_at')
                ->exists();
        }

        // ✅ Tip'e göre detayları oluştur
        $type = PostCard::tryFrom($this->type);
        $detailKeys = $type?->keys() ?? [];
        $details = collect($detailKeys)->map(function ($meta, $key) {
            return [
                'key' => $key,
                'title' => $meta['title'],
                'icon' => $meta['icon'],
                'value' => optional($this->details()->firstWhere('key', $key))->value
            ];
        })->values();


        // ✅ Tip'e göre detayları oluştur
        $getType = PostGetCard::tryFrom($this->type);
        $cardKeys = $getType?->keys() ?? [];
        $cards = collect($cardKeys)->map(function ($meta, $key) {
            return [
                'key' => $key,
                'title' => $meta['title'],
                'icon' => $meta['icon'],
                'value' => optional($this->details()->firstWhere('key', $key))->value
            ];
        })->values();


        // ✅ Gruplanmış attributeler
        $groupedAttributes = collect($this->postHasAttrs ?? [])
            ->groupBy(fn($item) => $item->attr?->attr_type ?? 'unknown')
            ->mapWithKeys(fn($items, $key) => [
                $key => PostHasAttrResource::collection($items),
            ]);

        // ✅ Rezervasyon takvimi
        $unavailableDates = $this->getUnavailableDates();

        // ✅ Galeri ve fiyat bilgileri ile birlikte dönüş
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'description' => $this->description,
            'slug' => $this->slug,
            'cover' => [
                'media_url' => $this->media?->url,
                'media_title' => $this->media?->title,
                'media_alt' => $this->media?->alt,
            ],
            'rating' => $averageRating,
            'comments_count' => $commentsCount,
            'comments' => $this->comments->map(fn($comment) => [
                'email' => $comment->email,
                'comment' => $comment->comment,
                'rating' => $comment->rating,
                'created_at' => $comment->created_at->format('Y-m-d H:i'),
            ]),
            'code' => $this->code,
            'status' => $this->status,
            'region' => $this->region ? [
                'id'   => $this->region->id,
                'name' => $this->region->fullNameWithCity(),
            ] : null,
            'neighborhood' => $this->neighborhood,
            'attributes' => $groupedAttributes,
            'details' => $details,
            'cards' => $cards,
            'min_price' => floatval($this->getMinFuturePrice() ?? 0),
            'favorite' => (bool) $isFavorite, // ✅ Burada 💖
            'gallery' => collect($this->postGalleries)
                ->sortBy('sort_order')
                ->values()
                ->map(fn($gallery) => [
                    'id' => $gallery->id,
                    'title' => $gallery->title,
                    'sort_order' => $gallery->sort_order,
                    'images' => collect($gallery->images)
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn($img) => [
                            'id' => $img->media?->id,
                            'media_url' => $img->media?->url,
                            'media_title' => $img->media?->title,
                            'media_alt' => $img->media?->alt,
                            'sort_order' => $img->sort_order,
                        ]),
                ]),
            'prices' => $this->prices
                ->sortBy([
                    ['years', 'asc'],
                    ['km', 'asc']
                ])
                ->values()
                ->map(fn($price) => [
                    'id' => $price->id,

                    'years' => intval($price->years),

                    'km' => intval($price->km),

                    'price' => floatval($price->price),

                    'formatted_price' => number_format($price->price, 0, ',', '.') . ' ₺',
                ]),
            'unavailable_dates' => $unavailableDates,
        ];
    }

    // ✅ Musait olmayan tarihleri al
    private function getUnavailableDates()
    {
        $today = now();
        $reservations = Reservation::where('post_id', $this->id)
            ->where('start_date', '>=', $today->format('Y-m-d'))
            ->where('status', '!=', 'cancelled')
            ->get();

        return $reservations->map(fn($reservation) => [
            'check_in' => is_string($reservation->start_date)
                ? \Carbon\Carbon::parse($reservation->start_date)->format('Y-m-d')
                : $reservation->start_date->format('Y-m-d'),
            'check_out' => is_string($reservation->end_date)
                ? \Carbon\Carbon::parse($reservation->end_date)->format('Y-m-d')
                : $reservation->end_date->format('Y-m-d'),
            'status' => $reservation->status,
        ]);
    }
}
