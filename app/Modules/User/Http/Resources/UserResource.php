<?php

namespace App\Modules\User\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'surname' => $this->surname,
            'phone' => $this->phone,
            'type' => $this->type,
            'status' => $this->status,
            'address' => $this->address,
            'email' => $this->email,

            'region' => $this->regionSimple ? [
                'id'   => $this->regionSimple->id,
                'name' => $this->regionSimple->name,
            ] : null,

            'ref_code' => $this->ref_code,
            'roles' => $this->roles ? $this->roles->pluck('name') : [],

            'created_at' => $this->created_at?->format('Y-m-d'),
            'updated_at' => $this->updated_at?->format('Y-m-d'),

            // 🛂 Admin talep durumu
            'admin_request_status' => $this->admin_request_status,

            /**
             * 🔥 BAYİ SİSTEMİ
             */
            'is_dealer' => (bool) $this->is_dealer,
            'dealer_code' => $this->dealer_code,
            'dealer_status' => $this->dealer_status,
            'dealer_start_date' => $this->dealer_start_date,
            'dealer_end_date' => $this->dealer_end_date,
            'iban' => $this->iban, // 💥 Buraya eklendi!
            /**
             * 💰 KOMİSYON MANTIĞI
             */
            'is_commissioned_user' => (bool) $this->is_commissioned_user,
        ];
    }
}
