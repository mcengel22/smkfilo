<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IconResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'value' => $this->icon_class,
            'label' => $this->name,
            'icon_class' => $this->icon_class, // frontend için kolaylık
        ];
    }
}
