<?php

namespace App\Modules\Media\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'         => $this->id,
            'url'        => $this->url,
            'title'      => $this->title,
            'alt'        => $this->alt,
        ];
    }
}
