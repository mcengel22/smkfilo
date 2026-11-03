<?php

namespace App\Modules\Reservation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ManuelReservationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'        => $this->id,
            'code'      => $this->code,
            'startDate' => $this->start_date,
            'endDate'   => $this->end_date,
            'title' => $this->post?->title,
            'slug' => $this->post?->slug,
            'customer'  => $this->reservable?->full_name ?? 'Harici',
            'price'     => $this->price,
            'status'    => $this->status,
            'state'     => $this->state,
            'type'     => $this->type,
        ];
    }
}
