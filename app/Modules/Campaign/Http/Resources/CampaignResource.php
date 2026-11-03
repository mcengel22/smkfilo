<?php

namespace App\Modules\Campaign\Http\Resources;

use App\Modules\Media\Http\Resources\MediaResource;
use App\Modules\Coupon\Http\Resources\CouponResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'long_content' => $this->long_content,
            'slug' => $this->slug,

            'image' => [
                'id' => $this->media?->id,
                'media_url' => $this->media?->url,  // Media URL'si
                'media_title' => $this->media?->title,  // Media başlığı
                'media_alt' => $this->media?->alt,  // Media alt metni
            ],
            'coupon' => new CouponResource($this->whenLoaded('coupon')), // Coupon ilişkisini ekliyoruz
        ];
    }
}
