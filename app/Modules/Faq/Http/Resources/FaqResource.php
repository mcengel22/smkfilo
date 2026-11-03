<?php

namespace App\Modules\Faq\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FaqResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'       => $this->id, // ✅ eklendi
            'question' => $this->question,
            'answer'   => $this->answer,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'status' => 'active', // opsiyonel placeholder
        ];
    }
}
