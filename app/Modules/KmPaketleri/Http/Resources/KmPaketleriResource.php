<?php

namespace App\Modules\KmPaketleri\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class KmPaketleriResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'km'         => $this->km,
            'price'      => $this->price,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'status'     => 'active',
        ];
    }
}
