<?php

namespace App\Modules\Reference\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReferenceResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'link' => $this->link,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'logo' => $this->media?->url,
        ];
    }
}
