<?php

namespace App\Modules\Campaign\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CampaignRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Yetkilendirme kontrolü burada yapılabilir
    }

    public function rules()
    {
        return [
            'title'        => ['required', 'string', 'max:255'], // Başlık zorunlu ve 255 karakteri geçmesin
            'content'      => ['required', 'string'], // İçerik zorunlu ve uzun metin olabilir
            'long_content' => ['nullable', 'string'], // Uzun içerik isteğe bağlı
            'image' => ['nullable', 'file', 'image'], // 🎨 Görsel alanı
            'cover_image' => ['nullable', 'file', 'image'], // 🎨 Görsel alanı
            'coupons_id'   => ['required', 'exists:coupons,id'], // Kupon ID'si zorunlu ve coupons tablosunda var olmalı
        ];
    }
}
