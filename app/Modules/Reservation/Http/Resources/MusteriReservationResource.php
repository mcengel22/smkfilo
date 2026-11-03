<?php

namespace App\Modules\Reservation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MusteriReservationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'   => $this->id,
            'code' => $this->code,

            'customer' => [
                'name'  => $this->reservable?->full_name,
                'phone' => $this->reservable?->phone,
            ],

            'dateRange' => [
                'start' => $this->start_date,
                'end'   => $this->end_date,
            ],

            'post' => [
                'title'  => $this->post?->title,
                'slug'   => $this->post?->slug,
                'region' => $this->post?->region?->name,

                'media' => [
                    'url'  => $this->post?->media?->url,
                    'type' => $this->post?->media?->type,
                    'alt'  => $this->post?->media?->alt,
                ],
            ],

            'dealer_code' => $this->dealer_code,

            'dealer' => $this->whenLoaded('dealer', function () {
                return [
                    'full_name' => trim(
                        ($this->dealer?->name ?? '') . ' ' . ($this->dealer?->surname ?? '')
                    ),
                ];
            }),

            'cleaningFee' => $this->reservationDetails?->cleaning_fee,
            'deposit'     => $this->reservationDetails?->deposit,

            'totalPrice' => $this->price,
            'status'     => $this->status,
            'state'      => $this->state,
        ];
    }
}
