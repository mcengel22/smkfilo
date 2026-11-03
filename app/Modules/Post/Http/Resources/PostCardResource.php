<?php

namespace App\Modules\Post\Http\Resources;

use App\Modules\PostHasAttr\Http\Resources\PostHasAttrResource;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class PostCardResource extends JsonResource
{
    public function toArray($request)
    {
        // ⭐ Ortalama puanı hesapla
        $ratings = $this->comments->pluck('rating');

        $averageRating = $ratings->count() > 0
            ? $ratings->sum() / $ratings->count()
            : 0;

        $commentsCount = $this->comments->count();

        // 🧩 Attribute'ları önce Resource çıktısına çevir
        $attributes = PostHasAttrResource::collection($this->postHasAttrs ?? [])
            ->resolve($request);

        // 🚗 Kartları operation attribute'lardan üret
        $operationCards = collect($attributes)
            ->filter(function ($attr) {
                return ($attr['attr_type'] ?? null) === 'operation';
            })
            ->map(function ($attr) {
                return [
                    'key' => 'operation_' . ($attr['id'] ?? ''),
                    'title' => $attr['title'] ?? '',
                    'icon' => data_get($attr, 'info.icon_class', 'settings'),
                    'value' => $attr['desc'] ?? $attr['title'] ?? '',
                ];
            })
            ->values()
            ->toArray();

        // 🗺 Bölge bilgisi
        $regionInfo = $this->region?->getRegionInfo();

        // 💸 Fiyat bilgisi
        $minPrice = $this->getMinFuturePrice() ?? 0;

        $minDays = 1;

        // ❤️ Favori kontrolü
        $user = auth('sanctum')->user();
        $isFavorite = false;

        if ($user) {
            $isFavorite = DB::table('favorites')
                ->where('user_id', $user->id)
                ->where('post_id', $this->id)
                ->whereNull('deleted_at')
                ->exists();
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,

            'cover' => [
                'media_url' => $this->media?->url,
                'media_title' => $this->media?->title,
                'media_alt' => $this->media?->alt,
            ],

            'description' => $this->description,
            'code' => $this->code,
            'status' => $this->status,

            'city' => $regionInfo['city'] ?? null,
            'district' => $regionInfo['district'] ?? null,

            'attributes' => $attributes,

            // Frontend şu an details okuyorsa bozulmasın
            'details' => $operationCards,

            // Yeni kullanım için
            'cards' => $operationCards,

            'rating' => $averageRating,
            'comments_count' => $commentsCount,

            'type' => $this->type ?? '',
            'min_price' => floatval($minPrice),
            'min_days' => $minDays,

            'favorite' => (bool) $isFavorite,

            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'phone' => $this->user->phone,
                    'avatar' => $this->user->avatar_url ?? null,
                ];
            }),
        ];
    }
}