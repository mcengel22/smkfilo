<?php

namespace App\Modules\Seo\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SeoResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'main_title' => $this->main_title,
            'titles' => $this->titles,
            'main_description' => $this->main_description,
            'descriptions' => $this->descriptions,
            'canonical_url' => $this->canonical_url,
            'slug' => $this->slug,
            'image' => $this->image,
            'keywords' => $this->keywords,
            'type' => $this->type,
            'region' => $this->region ? [
                'id' => $this->region->id,
                'name' => $this->region->name,
            ] : null,
            'meta_title' => $this->meta_title,             // 🆕
            'meta_description' => $this->meta_description, // 🆕
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

    }
}
