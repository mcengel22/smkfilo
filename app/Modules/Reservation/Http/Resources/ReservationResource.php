<?php

namespace App\Modules\Reservation\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'        => $this->id,
            'code'      => $this->code,
            'startDate' => $this->start_date,
            'endDate'   => $this->end_date,
            'image' => $this->post?->media ? [
                'media_url' => $this->post->media->url,
                'media_title' => $this->post->media->title,
                'media_alt' => $this->post->media->alt,
            ] : null,
            'title' => $this->post?->title,
            'slug' => $this->post?->slug,
            'customer'  => $this->reservable?->full_name ?? 'Harici',
            'customerPhone'  => $this->reservable?->phone ?? '',
            'dealer_code' =>$this->dealer_code,
            'dealer' => $this->whenLoaded('dealer', [
                'full_name' => trim(
                    ($this->dealer->name ?? '') . ' ' . ($this->dealer->surname ?? '')
                ),
            ]),
            'price'     => $this->price,
            'status'    => $this->status,
            'state'     => $this->state,
            'type'     => $this->type,
            'packageInfo' => $this->reservationDetails?->postPrice
                ? "{$this->reservationDetails->postPrice->years} Yıl · " . number_format($this->reservationDetails->postPrice->km, 0, ',', '.') . " KM"
                : null,
            'extraKmInfo' => $this->reservationDetails?->kmPackage
                ? number_format($this->reservationDetails->kmPackage->km, 0, ',', '.') . " KM Ek Paket"
                : null,
        ];
    }
}
