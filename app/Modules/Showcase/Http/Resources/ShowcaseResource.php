<?php

namespace App\Modules\Showcase\Http\Resources;

use App\Modules\Post\Http\Resources\PostCardResource;
use App\Modules\ShowcaseHasPost\Http\Resources\ShowcaseHasPostResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowcaseResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'sort_order' => $this->sort_order,
            'posts' => PostCardResource::collection(
                $this->whenLoaded('showcaseHasPosts')->pluck('post')->filter()
            ),
            'showcaseshaspost' => ShowcaseHasPostResource::collection($this->whenLoaded('showcaseHasPosts')), // İlişkili veriyi burada döndürüyoruz
        ];
    }

}
