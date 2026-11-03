<?php

namespace App\Modules\Coupon\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'type' => $this->type,
            'discount_value' => $this->discount_value,
            'usage_limit' => $this->usage_limit,
            'valid_for' => $this->valid_for,
            'post_type' => $this->valid_for, // frontend için alias
            'post_ids' => $this->whenLoaded('posts', fn() => $this->posts->pluck('id')->toArray()),
            'posts' => $this->whenLoaded('posts', function () {
                return $this->posts->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'title' => $p->title,
                        'name' => $p->title,
                    ];
                });
            }),
            'min_order_value' => $this->min_order_value,
            'start_date' => $this->start_date ? Carbon::parse($this->start_date)->toIso8601String() : null,
            'end_date' => $this->end_date ? Carbon::parse($this->end_date)->toIso8601String() : null,
            'is_first_order_only' => (bool) $this->is_first_order_only,
        ];
    }
}
