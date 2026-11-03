<?php

namespace App\Modules\Blog\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'content'       => $this->content,
            'slug'          => $this->slug,

            'image'         => $this->image ? url($this->image) : null, // tam URL döndürür

            'type'          => $this->type,
            'region_id'     => $this->region_id,
            'region_name'   => $this->whenLoaded('region', fn() => $this->region->name ?? null),

            // JSON alanlar
            'sections'      => $this->sections ?? [],
            'faq_title'     => $this->faq_title,
            'faqs'          => $this->faqs ?? [],
            'keywords'      => $this->keywords ?? [],
            'backlinks'     => $this->backlinks ?? [],

            'created_at'    => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'    => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
