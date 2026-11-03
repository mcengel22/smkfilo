<?php

namespace App\Modules\Attr\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttrResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'cover' => [
                'media_url' => $this->media?->url,
                'media_title' => $this->media?->title,
                'media_alt' => $this->media?->alt,
            ],
            'desc' => $this->desc,
            'info' => $this->infoRelation ? [
                'value' => $this->infoRelation->icon_class,
                'label' => $this->infoRelation->name,
                'icon_class' => $this->infoRelation->icon_class,
            ] : null,
            'attr_type' => $this->attr_type,
            'post_type' => $this->post_type,
            'slug' => $this->slug,
            'near_id' => $this->near_id,
        ];
    }
}
