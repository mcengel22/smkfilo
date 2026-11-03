<?php

namespace App\Modules\Favorite\Http\Resources;
use App\Modules\Post\Http\Resources\PostCardResource;
use Illuminate\Http\Resources\Json\JsonResource;

class FavoriteResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'post' => new PostCardResource($this->whenLoaded('post')), // Post ilişkilendirmesi
        ];
    }
}
