<?php

namespace App\Modules\ContactForm\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactFormRequest extends FormRequest
{
    public function authorize()
    {
        // Burada yetkilendirme kontrolü ekleyebilirsin.
        return true;
    }

    public function rules()
    {
        return [
            'fullname'   => ['required', 'string', 'max:255'],  // İsim zorunlu ve en fazla 255 karakter
            'email'      => ['required', 'email', 'max:255'],    // E-posta zorunlu ve geçerli formatta
            'phone'      => ['required', 'string', 'max:30'],     // Telefon zorunlu, string ve 15 karakteri geçmesin
            'description'=> ['required', 'string'],                // Açıklama zorunlu ve string olmalı
            'region_id'    => ['required', 'exists:regions,id'],      // city_id zorunlu ve cities tablosunda var olmalı
        ];
    }

    public function messages()
    {
        return [
            'fullname.required'  => 'Ad ve soyad alanı zorunludur.',
            'email.required'     => 'E-posta adresi zorunludur.',
            'email.email'        => 'Geçerli bir e-posta adresi girin.',
            'phone.required'     => 'Telefon numarası zorunludur.',
            'description.required' => 'Açıklama alanı zorunludur.',
            'region_id.required'   => 'Bölge bilgisi zorunludur.',
            'region_id.exists'     => 'Geçersiz Bölge seçildi.',
        ];
    }
}
