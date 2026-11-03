<?php

namespace App\Modules\ContactForm\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ContactFormResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' =>$this->id,
            'fullname'      => $this->fullname,   // 'name' yerine 'fullname' kullanıyoruz
            'email'         => $this->email,      // E-posta alanı
            'phone'         => $this->phone,      // Telefon numarası
            'description'   => $this->description, // Açıklama
            'city_id'       => $this->city_id,    // Şehir ID
        ];
    }
}
