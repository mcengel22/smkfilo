<?php

namespace App\Modules\PostHasAttr\Http\Resources;

use App\Modules\Attr\Http\Resources\AttrResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PostHasAttrResource extends JsonResource
{
    public function toArray($request)
    {
        if (!$this->attr) {
            return [
                'value' => $this->value,
                'id' => null,
                'title' => 'Missing Attribute',
            ];
        }

        $attrs = new AttrResource($this->attr);
        return array_merge($attrs->toArray($request), ['value' => $this->value]);
    }
}
